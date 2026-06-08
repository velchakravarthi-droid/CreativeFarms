"use client";

import { createPestDiseaseIssue } from "@/app/pest-disease/actions";
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

type IssueRecord = {
  id: string;
  observedOn: string;
  blockName: string;
  rowName: string;
  treeType: string;
  issueCategory: string;
  issueStatus: string;
  comments: string;
};

export function PestDiseaseEntry({
  blocks,
  properties,
  issues
}: {
  blocks: FarmBlock[];
  properties: FarmProperty[];
  issues: IssueRecord[];
}) {
  const router = useRouter();
  const treeTypes = properties.filter((property) => property.type.trim().toLowerCase() === "tree");
  const [selectedBlockId, setSelectedBlockId] = useState(blocks[0]?.id ?? "");
  const selectedBlock = useMemo(
    () => blocks.find((block) => block.id === selectedBlockId) ?? blocks[0],
    [blocks, selectedBlockId]
  );
  const [pendingForm, setPendingForm] = useState<FormData | null>(null);
  const [isPending, startTransition] = useTransition();
  const availableRows = selectedBlock?.rows ?? [];

  function proceedAction() {
    if (!pendingForm) return;
    const formData = pendingForm;
    setPendingForm(null);
    startTransition(() => {
      void (async () => {
        const result = await createPestDiseaseIssue(formData);
        if (!result.ok) {
          window.alert(result.error);
          return;
        }
        router.refresh();
      })();
    });
  }

  return (
    <section className="module-section">
      {pendingForm ? (
        <div className="confirm-backdrop" role="presentation">
          <div aria-modal="true" className="confirm-dialog" role="dialog">
            <h3>Confirm Transaction</h3>
            <p>Add this pest, disease, growth, or tree issue?</p>
            <div className="confirm-actions">
              <button className="button" onClick={proceedAction} type="button">
                Proceed
              </button>
              <button className="button secondary-button" onClick={() => setPendingForm(null)} type="button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid-two">
        <Card title="Add Issue" action={<Pill>Pest / Disease / Growth</Pill>}>
          <form
            className="entry-grid"
            onSubmit={(event) => {
              event.preventDefault();
              setPendingForm(new FormData(event.currentTarget));
            }}
          >
            <label className="field">
              <span>Date</span>
              <input defaultValue={new Date().toISOString().slice(0, 10)} name="observed_on" required type="date" />
            </label>
            <label className="field">
              <span>Block</span>
              <select
                name="block_id"
                onChange={(event) => setSelectedBlockId(event.target.value)}
                required
                value={selectedBlockId}
              >
                {blocks.map((block) => (
                  <option key={block.id} value={block.id}>
                    {block.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Row</span>
              <select disabled={!availableRows.length} key={selectedBlockId} name="row_id" required>
                {availableRows.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Tree Type</span>
              <select disabled={!treeTypes.length} name="tree_type" required>
                {treeTypes.length ? (
                  treeTypes.map((tree) => (
                    <option key={tree.id} value={tree.name}>
                      {tree.name}
                    </option>
                  ))
                ) : (
                  <option value="">Add Tree type in Farm Property Master</option>
                )}
              </select>
            </label>
            <label className="field">
              <span>Type Of Issue</span>
              <select name="issue_category" required>
                <option value="pest">Pest</option>
                <option value="disease">Disease</option>
                <option value="growth">Growth</option>
              </select>
            </label>
            <label className="field">
              <span>Issue Status</span>
              <select name="issue_status" required>
                <option>Open</option>
                <option>Treatment In Progress</option>
                <option>Cured</option>
                <option>Tree dead</option>
              </select>
            </label>
            <label className="field entry-grid-wide">
              <span>Comments</span>
              <textarea name="comments" placeholder="Describe the pest, disease, growth, or tree issue" required rows={4} />
            </label>
            <button className="button" disabled={isPending || !blocks.length || !availableRows.length || !treeTypes.length} type="submit">
              Add Issue
            </button>
          </form>
        </Card>

        <Card title="Issue Summary" action={<Pill>{issues.length} records</Pill>}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {["Open", "Treatment In Progress", "Cured", "Tree dead"].map((status) => (
                  <tr key={status}>
                    <td>{status}</td>
                    <td>{issues.filter((issue) => issue.issueStatus === status).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card title="Recent Pest / Disease / Tree Issues" action={<Pill>{issues.length} issues</Pill>}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Block</th>
                <th>Row</th>
                <th>Tree Type</th>
                <th>Type</th>
                <th>Status</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {issues.slice(0, 15).map((issue) => (
                <tr key={issue.id}>
                  <td>{issue.observedOn}</td>
                  <td>{issue.blockName}</td>
                  <td>{issue.rowName}</td>
                  <td>{issue.treeType}</td>
                  <td>{issue.issueCategory}</td>
                  <td>{issue.issueStatus}</td>
                  <td>{issue.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
