"use client";

import { createFertigationEntry } from "@/app/fertigation/actions";
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

type Worker = {
  id: string;
  name: string;
  role: string;
};

type StockItem = {
  name: string;
  category: string;
  type: string;
  qty: string;
  status: string;
};

type FertigationHistory = {
  id: string;
  blockId: string;
  rowId: string;
  blockName: string;
  rowName: string;
  workerName: string;
  activityDate: string;
  notes: string;
};

export function FertigationEntry({
  blocks,
  workers,
  stock,
  history
}: {
  blocks: FarmBlock[];
  workers: Worker[];
  stock: StockItem[];
  history: FertigationHistory[];
}) {
  const router = useRouter();
  const fertilizerItems = stock.filter((item) => item.category.toLowerCase().includes("fertilizer"));
  const [selectedBlockId, setSelectedBlockId] = useState(blocks[0]?.id ?? "");
  const selectedBlock = useMemo(
    () => blocks.find((block) => block.id === selectedBlockId) ?? blocks[0],
    [blocks, selectedBlockId]
  );
  const [selectedRowId, setSelectedRowId] = useState(selectedBlock?.rows[0]?.id ?? "");
  const [pendingForm, setPendingForm] = useState<FormData | null>(null);
  const [isPending, startTransition] = useTransition();
  const availableRows = selectedBlock?.rows ?? [];
  const lastFertigated = history
    .filter((entry) => entry.blockId === selectedBlockId && entry.rowId === selectedRowId)
    .sort((a, b) => b.activityDate.localeCompare(a.activityDate))[0];

  function proceedAction() {
    if (!pendingForm) return;
    const formData = pendingForm;
    setPendingForm(null);
    startTransition(() => {
      void (async () => {
        const result = await createFertigationEntry(formData);
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
            <p>Add this fertigation entry?</p>
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
        <Card title="Add Fertigation" action={<Pill>Block / Row</Pill>}>
          <form
            className="entry-grid"
            onSubmit={(event) => {
              event.preventDefault();
              setPendingForm(new FormData(event.currentTarget));
            }}
          >
            <label className="field">
              <span>Date</span>
              <input defaultValue={new Date().toISOString().slice(0, 10)} name="activity_date" required type="date" />
            </label>
            <label className="field">
              <span>Block</span>
              <select
                name="block_id"
                onChange={(event) => {
                  const blockId = event.target.value;
                  const nextBlock = blocks.find((block) => block.id === blockId);
                  setSelectedBlockId(blockId);
                  setSelectedRowId(nextBlock?.rows[0]?.id ?? "");
                }}
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
              <span>Worker</span>
              <select name="worker_id" required>
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Row Fertigated</span>
              <select
                disabled={!availableRows.length}
                key={selectedBlockId}
                name="row_id"
                onChange={(event) => setSelectedRowId(event.target.value)}
                required
                value={selectedRowId}
              >
                {availableRows.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Fertilizer</span>
              <select name="fertilizer">
                {fertilizerItems.length ? (
                  fertilizerItems.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))
                ) : (
                  <option value="">No fertilizer stock setup</option>
                )}
              </select>
            </label>
            <label className="field">
              <span>Quantity</span>
              <input name="quantity" placeholder="Example: 25 kg" />
            </label>
            <label className="field entry-grid-wide">
              <span>Notes</span>
              <input name="notes" placeholder="Optional fertigation notes" />
            </label>
            <button className="button" disabled={isPending || !blocks.length || !workers.length || !availableRows.length} type="submit">
              Add Fertigation
            </button>
          </form>
        </Card>

        <Card title="Last Fertigated Date" action={<Pill tone={lastFertigated ? "good" : "warn"}>{lastFertigated ? "Found" : "No history"}</Pill>}>
          <strong className="metric">{lastFertigated?.activityDate ?? "Not fertigated"}</strong>
          <p>
            {selectedBlock?.name ?? "Select block"} / {availableRows.find((row) => row.id === selectedRowId)?.name ?? "Select row"}
          </p>
          {lastFertigated ? <p>Last worker: {lastFertigated.workerName}</p> : null}
          {lastFertigated?.notes ? <p>{lastFertigated.notes}</p> : null}
        </Card>
      </div>

      <Card title="Recent Fertigation" action={<Pill>{history.length} entries</Pill>}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Block</th>
                <th>Row</th>
                <th>Worker</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 10).map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.activityDate}</td>
                  <td>{entry.blockName}</td>
                  <td>{entry.rowName}</td>
                  <td>{entry.workerName}</td>
                  <td>{entry.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
