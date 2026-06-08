"use client";

import { createTreeAssignment, deleteTreeAssignment, updateTreeAssignment } from "@/app/farm-structure/actions";
import { Card, Pill } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

type FarmRow = {
  id: string;
  name: string;
};

type FarmBlock = {
  id: string;
  name: string;
  rows: FarmRow[];
};

type FarmProperty = {
  id: string;
  type: string;
  name: string;
  status: string;
};

type TreeAssignment = {
  id: string;
  propertyId: string;
  blockId: string;
  rowId: string;
  propertyName: string;
  block: string;
  row: string;
  count: number;
  status: string;
  notes: string;
};

type PendingAction = {
  action: (formData: FormData) => Promise<void>;
  formData: FormData;
  message: string;
};

export function TreeAssignmentMaintenance({
  assignments,
  blocks,
  properties,
  isAdmin
}: {
  assignments: TreeAssignment[];
  blocks: FarmBlock[];
  properties: FarmProperty[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const treeProperties = properties.filter((property) => property.type.toLowerCase() === "tree");
  const [selectedId, setSelectedId] = useState(assignments[0]?.id ?? "");
  const selectedAssignment = useMemo(
    () => assignments.find((assignment) => assignment.id === selectedId) ?? assignments[0],
    [assignments, selectedId]
  );
  const [selectedBlockId, setSelectedBlockId] = useState(selectedAssignment?.blockId ?? "");
  const [newBlockId, setNewBlockId] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [isPending, startTransition] = useTransition();
  const selectedBlockRows = blocks.find((block) => block.id === selectedBlockId)?.rows ?? [];
  const newBlockRows = blocks.find((block) => block.id === newBlockId)?.rows ?? [];

  function selectAssignment(assignment: TreeAssignment) {
    setSelectedId(assignment.id);
    setSelectedBlockId(assignment.blockId);
  }

  function requestAction(action: (formData: FormData) => Promise<void>, formData: FormData, message: string) {
    setPendingAction({ action, formData, message });
  }

  function proceedAction() {
    if (!pendingAction) return;
    const transaction = pendingAction;
    setPendingAction(null);
    startTransition(() => {
      void (async () => {
        try {
          await transaction.action(transaction.formData);
          router.refresh();
        } catch (error) {
          window.alert(error instanceof Error ? error.message : "Transaction failed.");
        }
      })();
    });
  }

  return (
    <section className="module-section">
      {pendingAction ? (
        <div className="confirm-backdrop" role="presentation">
          <div aria-modal="true" className="confirm-dialog" role="dialog">
            <h3>Confirm Transaction</h3>
            <p>{pendingAction.message}</p>
            <div className="confirm-actions">
              <button className="button" onClick={proceedAction} type="button">
                Proceed
              </button>
              <button className="button secondary-button" onClick={() => setPendingAction(null)} type="button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {!isAdmin ? (
        <section className="notice">
          <strong>Admin access required</strong>
          <span>Only Admin role can add, modify, or delete tree type assignments.</span>
        </section>
      ) : null}

      <div className="master-detail-grid">
        <Card title="Assigned Tree Types" action={<Pill>{assignments.length} assignments</Pill>}>
          <div className="land-block-list">
            {assignments.map((assignment) => (
              <button
                className={`land-block-card ${assignment.id === selectedAssignment?.id ? "selected" : ""}`}
                key={assignment.id}
                onClick={() => selectAssignment(assignment)}
                type="button"
              >
                <div>
                  <strong>{assignment.propertyName}</strong>
                  <span>
                    {assignment.block} / {assignment.row}
                  </span>
                </div>
                <div className="land-block-meta">
                  <span>{assignment.count.toLocaleString()}</span>
                  <span>{assignment.status}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card title="Tree Assignment Maintenance" action={<Pill tone={isAdmin ? "good" : "warn"}>{isAdmin ? "Admin" : "View only"}</Pill>}>
          <form
            key={`assignment-${selectedAssignment?.id ?? "new"}`}
            className="entry-grid single"
            onSubmit={(event) => {
              event.preventDefault();
              if (!isAdmin) return;
              requestAction(updateTreeAssignment, new FormData(event.currentTarget), "Modify this tree assignment?");
            }}
          >
            <input name="id" type="hidden" value={selectedAssignment?.id ?? ""} />
            <label className="field">
              <span>Tree Type</span>
              <select disabled={!isAdmin || !selectedAssignment} name="farm_property_id" defaultValue={selectedAssignment?.propertyId ?? ""} required>
                {treeProperties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Block</span>
              <select
                disabled={!isAdmin || !selectedAssignment}
                name="block_id"
                value={selectedBlockId}
                onChange={(event) => setSelectedBlockId(event.target.value)}
              >
                <option value="">All Blocks</option>
                {blocks.map((block) => (
                  <option key={block.id} value={block.id}>
                    {block.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Row</span>
              <select
                disabled={!isAdmin || !selectedAssignment || !selectedBlockId}
                key={`row-${selectedBlockId}`}
                name="row_id"
                defaultValue={selectedAssignment?.blockId === selectedBlockId ? (selectedAssignment?.rowId ?? "") : ""}
              >
                <option value="">All Rows</option>
                {selectedBlockRows.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.name}
                  </option>
                ))}
              </select>
            </label>
            <input name="row_range" type="hidden" value={selectedBlockId ? "All Rows" : "All Blocks"} />
            <label className="field">
              <span>Tree Count</span>
              <input disabled={!isAdmin || !selectedAssignment} min="0" name="tree_count" type="number" defaultValue={selectedAssignment?.count ?? 0} />
            </label>
            <label className="field">
              <span>Status</span>
              <select disabled={!isAdmin || !selectedAssignment} name="status" defaultValue={selectedAssignment?.status ?? "active"}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="hold">Hold</option>
              </select>
            </label>
            <label className="field">
              <span>Notes</span>
              <input disabled={!isAdmin || !selectedAssignment} name="notes" defaultValue={selectedAssignment?.notes ?? ""} />
            </label>
            <button className="button" disabled={!isAdmin || !selectedAssignment || isPending} type="submit">
              Modify Assignment
            </button>
          </form>

          <form
            className="entry-grid single stacked-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!isAdmin) return;
              requestAction(createTreeAssignment, new FormData(event.currentTarget), "Add this tree assignment?");
              event.currentTarget.reset();
              setNewBlockId("");
            }}
          >
            <label className="field">
              <span>Tree Type</span>
              <select disabled={!isAdmin} name="farm_property_id" required>
                {treeProperties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Block</span>
              <select disabled={!isAdmin} name="block_id" value={newBlockId} onChange={(event) => setNewBlockId(event.target.value)}>
                <option value="">All Blocks</option>
                {blocks.map((block) => (
                  <option key={block.id} value={block.id}>
                    {block.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Row</span>
              <select disabled={!isAdmin || !newBlockId} key={`new-row-${newBlockId}`} name="row_id" defaultValue="">
                <option value="">All Rows</option>
                {newBlockRows.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.name}
                  </option>
                ))}
              </select>
            </label>
            <input name="row_range" type="hidden" value={newBlockId ? "All Rows" : "All Blocks"} />
            <label className="field">
              <span>Tree Count</span>
              <input disabled={!isAdmin} min="0" name="tree_count" placeholder="0" type="number" />
            </label>
            <label className="field">
              <span>Status</span>
              <select disabled={!isAdmin} name="status" defaultValue="active">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="hold">Hold</option>
              </select>
            </label>
            <label className="field">
              <span>Notes</span>
              <input disabled={!isAdmin} name="notes" placeholder="Optional" />
            </label>
            <button className="button secondary-button" disabled={!isAdmin || isPending || !treeProperties.length} type="submit">
              Add Assignment
            </button>
          </form>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!isAdmin) return;
              requestAction(deleteTreeAssignment, new FormData(event.currentTarget), "Delete this tree assignment?");
            }}
          >
            <input name="id" type="hidden" value={selectedAssignment?.id ?? ""} />
            <button className="button danger-button" disabled={!isAdmin || !selectedAssignment || isPending} type="submit">
              Delete Assignment
            </button>
          </form>
        </Card>
      </div>
    </section>
  );
}
