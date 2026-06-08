"use client";

import { createBlock, createRow, deleteBlock, deleteRow, updateBlock, updateRow } from "@/app/farm-structure/actions";
import { Card, Pill } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

type FarmRow = {
  id: string;
  name: string;
  status: string;
  notes?: string;
};

type FarmBlock = {
  id: string;
  name: string;
  acres: number;
  rowCount: number;
  rows: FarmRow[];
  status: string;
  notes: string;
};

type Status = "active" | "inactive" | "hold";

export function FarmStructureMaintenance({
  blocks,
  farmName,
  totalAcres,
  isAdmin
}: {
  blocks: FarmBlock[];
  farmName: string;
  totalAcres: number;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [selectedBlockId, setSelectedBlockId] = useState(blocks[0]?.id ?? "");
  const [editingRowId, setEditingRowId] = useState(blocks[0]?.rows[0]?.id ?? "");
  const [pendingAction, setPendingAction] = useState<{
    action: (formData: FormData) => Promise<{ ok: boolean; error?: string } | void>;
    formData: FormData;
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const selectedBlock = useMemo(
    () => blocks.find((block) => block.id === selectedBlockId) ?? blocks[0],
    [blocks, selectedBlockId]
  );
  const editingRow = selectedBlock?.rows.find((row) => row.id === editingRowId) ?? selectedBlock?.rows[0];

  function requestAction(action: (formData: FormData) => Promise<{ ok: boolean; error?: string } | void>, formData: FormData, message: string) {
    setPendingAction({ action, formData, message });
  }

  function proceedAction() {
    if (!pendingAction) return;
    const transaction = pendingAction;
    setPendingAction(null);
    startTransition(() => {
      void (async () => {
        try {
          const result = await transaction.action(transaction.formData);
          if (result && !result.ok) {
            window.alert(result.error ?? "Transaction failed.");
            return;
          }
          router.refresh();
        } catch (error) {
          window.alert(error instanceof Error ? error.message : "Transaction failed.");
        }
      })();
    });
  }

  return (
    <section id="land-structure" className="module-section">
      <div className="module-title">
        <h2>Land Structure</h2>
      </div>

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
          <span>Only Admin role can add, modify, or delete farm blocks and rows.</span>
        </section>
      ) : null}

      <div className="land-builder">
        <Card title="Master Farm Blocks" action={<Pill>{blocks.length} blocks</Pill>}>
          <div className="master-farm-band">
            <strong>{farmName}</strong>
            <span>{totalAcres || 125} acres</span>
          </div>
          <div className="land-block-list">
            {blocks.map((block) => (
              <button
                className={`land-block-card ${block.id === selectedBlock?.id ? "selected" : ""}`}
                key={block.id}
                onClick={() => {
                  setSelectedBlockId(block.id);
                  setEditingRowId(block.rows[0]?.id ?? "");
                }}
                type="button"
              >
                <div>
                  <strong>{block.name}</strong>
                  <span>{block.notes || "Farm operating area"}</span>
                </div>
                <div className="land-block-meta">
                  <span>{block.acres} acres</span>
                  <span>{block.rowCount} rows</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card title="Block Maintenance" action={<Pill tone={isAdmin ? "good" : "warn"}>{isAdmin ? "Admin" : "View only"}</Pill>}>
          <form
            key={`block-${selectedBlock?.id ?? "new"}`}
            className="entry-grid"
            onSubmit={(event) => {
              event.preventDefault();
              if (!isAdmin) return;
              requestAction(updateBlock, new FormData(event.currentTarget), "Modify this block?");
            }}
          >
            <input name="id" type="hidden" value={selectedBlock?.id ?? ""} />
            <label className="field">
              <span>Block Name</span>
              <input disabled={!isAdmin || !selectedBlock} name="name" required defaultValue={selectedBlock?.name ?? ""} />
            </label>
            <label className="field">
              <span>Acres</span>
              <input disabled={!isAdmin || !selectedBlock} name="acres" type="number" defaultValue={selectedBlock?.acres ?? 0} />
            </label>
            <label className="field">
              <span>Status</span>
              <select disabled={!isAdmin || !selectedBlock} name="status" defaultValue={(selectedBlock?.status ?? "active") as Status}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="hold">Hold</option>
              </select>
            </label>
            <label className="field">
              <span>Notes</span>
              <input disabled={!isAdmin || !selectedBlock} name="notes" defaultValue={selectedBlock?.notes ?? ""} />
            </label>
            <button className="button" disabled={!isAdmin || !selectedBlock || isPending} type="submit">
              Modify Block
            </button>
          </form>

          <form
            id="add-block-form"
            className="entry-grid single stacked-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!isAdmin) return;
              requestAction(createBlock, new FormData(event.currentTarget), "Add this block?");
              event.currentTarget.reset();
            }}
          >
            <label className="field">
              <span>New Block Name</span>
              <input disabled={!isAdmin} name="name" placeholder="Block name" required />
            </label>
            <label className="field">
              <span>Acres</span>
              <input disabled={!isAdmin} min="0" name="acres" placeholder="0" type="number" />
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
              <input disabled={!isAdmin} name="notes" placeholder="Purpose or location" />
            </label>
          </form>

          <form
            id="delete-block-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!isAdmin) return;
              requestAction(deleteBlock, new FormData(event.currentTarget), "Delete this block and its rows?");
            }}
          >
            <input name="id" type="hidden" value={selectedBlock?.id ?? ""} />
          </form>

          <div className="action-row">
            <button className="button secondary-button" disabled={!isAdmin || isPending} form="add-block-form" type="submit">
              Add Block
            </button>
            <button className="button danger-button" disabled={!isAdmin || !selectedBlock || isPending} form="delete-block-form" type="submit">
              Delete Block
            </button>
          </div>
        </Card>
      </div>

      <div className="grid-two">
        <Card title={`Rows in ${selectedBlock?.name ?? "Selected Block"}`} action={<Pill>{selectedBlock?.rows.length ?? 0} rows</Pill>}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Row</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(selectedBlock?.rows ?? []).map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>
                      <Pill tone={row.status === "active" ? "good" : "warn"}>{row.status}</Pill>
                    </td>
                    <td>
                      <button className="text-button" onClick={() => setEditingRowId(row.id)} type="button">
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Row Maintenance" action={<Pill tone={isAdmin ? "good" : "warn"}>{isAdmin ? "Admin" : "View only"}</Pill>}>
          <form
            key={`row-${editingRow?.id ?? "new"}`}
            className="entry-grid single"
            onSubmit={(event) => {
              event.preventDefault();
              if (!isAdmin) return;
              requestAction(updateRow, new FormData(event.currentTarget), "Modify this row?");
            }}
          >
            <input name="id" type="hidden" value={editingRow?.id ?? ""} />
            <label className="field">
              <span>Selected Row</span>
              <input disabled={!isAdmin || !editingRow} name="name" required defaultValue={editingRow?.name ?? ""} />
            </label>
            <label className="field">
              <span>Status</span>
              <select disabled={!isAdmin || !editingRow} name="status" defaultValue={(editingRow?.status ?? "active") as Status}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="hold">Hold</option>
              </select>
            </label>
            <label className="field">
              <span>Notes</span>
              <input disabled={!isAdmin || !editingRow} name="notes" defaultValue={editingRow?.notes ?? ""} />
            </label>
            <button className="button" disabled={!isAdmin || !editingRow || isPending} type="submit">
              Modify Row
            </button>
          </form>

          <form
            id="add-row-form"
            className="entry-grid single stacked-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!isAdmin) return;
              requestAction(createRow, new FormData(event.currentTarget), "Add this row under the selected block?");
              event.currentTarget.reset();
            }}
          >
            <input name="block_id" type="hidden" value={selectedBlock?.id ?? ""} />
            <label className="field">
              <span>New Row Name</span>
              <input disabled={!isAdmin || !selectedBlock} name="name" placeholder="Row name" required />
            </label>
            <label className="field">
              <span>Status</span>
              <select disabled={!isAdmin || !selectedBlock} name="status" defaultValue="active">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="hold">Hold</option>
              </select>
            </label>
            <label className="field">
              <span>Notes</span>
              <input disabled={!isAdmin || !selectedBlock} name="notes" placeholder="Optional" />
            </label>
          </form>

          <form
            id="delete-row-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!isAdmin) return;
              requestAction(deleteRow, new FormData(event.currentTarget), "Delete this row?");
            }}
          >
            <input name="id" type="hidden" value={editingRow?.id ?? ""} />
          </form>

          <div className="action-row">
            <button className="button secondary-button" disabled={!isAdmin || !selectedBlock || isPending} form="add-row-form" type="submit">
              Add Row
            </button>
            <button className="button danger-button" disabled={!isAdmin || !editingRow || isPending} form="delete-row-form" type="submit">
              Delete Row
            </button>
          </div>
        </Card>
      </div>
    </section>
  );
}
