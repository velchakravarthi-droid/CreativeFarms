"use client";

import { createFarmExpense } from "@/app/farm-costs/actions";
import { Card, Pill } from "@/components/ui";
import { costTypes } from "@/lib/farm-data";
import { useMemo, useState, useTransition } from "react";

type FarmBlock = {
  id: string;
  name: string;
};

type FarmProperty = {
  id: string;
  type: string;
  name: string;
  quantity: string;
  status: string;
};

type FarmExpense = {
  id: string;
  expenseDate: string;
  costType: string;
  propertyName: string;
  propertyType: string;
  propertyCount: number | null;
  amount: number;
  paymentStatus: string;
  notes: string;
};

const linkedModules = [
  "Farm Costs",
  "Labor",
  "Stock",
  "Irrigation",
  "Fertigation",
  "Pest / Disease",
  "Harvest",
  "Equipment",
  "Work Orders",
  "Admin"
];

const paymentMethods = ["Cash", "Bank", "UPI", "Credit", "Not paid"];
const paymentStatuses = [
  { label: "Paid", value: "paid" },
  { label: "Due", value: "due" },
  { label: "Advance", value: "advance" },
  { label: "Part paid", value: "part_paid" }
];

export function FarmCostEntry({
  blocks,
  expenses,
  properties
}: {
  blocks: FarmBlock[];
  expenses: FarmExpense[];
  properties: FarmProperty[];
}) {
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id ?? "");
  const [pendingForm, setPendingForm] = useState<FormData | null>(null);
  const [isPending, startTransition] = useTransition();
  const selectedProperty = useMemo(
    () => properties.find((property) => property.id === selectedPropertyId) ?? properties[0],
    [properties, selectedPropertyId]
  );

  function proceedAction() {
    if (!pendingForm) return;
    const formData = pendingForm;
    setPendingForm(null);
    startTransition(() => {
      void (async () => {
        const result = await createFarmExpense(formData);
        if (!result.ok) {
          window.alert(result.error);
          return;
        }
        window.location.reload();
      })();
    });
  }

  return (
    <section className="module-section">
      {pendingForm ? (
        <div className="confirm-backdrop" role="presentation">
          <div aria-modal="true" className="confirm-dialog" role="dialog">
            <h3>Confirm Transaction</h3>
            <p>Add this farm cost?</p>
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
        <Card title="Add Farm Cost" action={<Pill>Property linked</Pill>}>
          <form
            className="entry-grid"
            onSubmit={(event) => {
              event.preventDefault();
              setPendingForm(new FormData(event.currentTarget));
            }}
          >
            <label className="field">
              <span>Date</span>
              <input defaultValue={new Date().toISOString().slice(0, 10)} name="expense_date" required type="date" />
            </label>
            <label className="field">
              <span>Farm Property</span>
              <select
                name="farm_property_id"
                onChange={(event) => setSelectedPropertyId(event.target.value)}
                required
                value={selectedPropertyId}
              >
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.type} - {property.name}
                  </option>
                ))}
              </select>
            </label>
            <input name="farm_property_name" type="hidden" value={selectedProperty?.name ?? ""} />
            <label className="field">
              <span>Cost Type</span>
              <select name="cost_type" required>
                {costTypes.map((costType) => (
                  <option key={costType}>{costType}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Linked Module</span>
              <select name="linked_module">
                {linkedModules.map((module) => (
                  <option key={module}>{module}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Block / Area</span>
              <select name="block_id">
                <option value="">General farm</option>
                {blocks.map((block) => (
                  <option key={block.id} value={block.id}>
                    {block.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Expense For</span>
              <input name="expense_for" placeholder={selectedProperty?.name ?? "Worker, item, repair, bill, or work"} />
            </label>
            <label className="field">
              <span>Count / Quantity</span>
              <input min="0" name="property_count" placeholder="Enter count manually" required step="0.01" type="number" />
            </label>
            <label className="field">
              <span>Amount</span>
              <input min="0" name="amount" placeholder="Cost amount" required step="0.01" type="number" />
            </label>
            <label className="field">
              <span>Paid By</span>
              <select name="paid_by">
                {paymentMethods.map((method) => (
                  <option key={method}>{method}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Payment Status</span>
              <select name="payment_status">
                {paymentStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field entry-grid-wide">
              <span>Notes</span>
              <textarea name="notes" placeholder="Optional reason, bill number, vendor, or approval note" />
            </label>
            <button className="button" disabled={isPending || !properties.length} type="submit">
              Save Expense
            </button>
          </form>
        </Card>

        <Card title="Selected Property" action={<Pill tone="good">Master</Pill>}>
          {selectedProperty ? (
            <div className="property-cost-summary">
              <strong>{selectedProperty.name}</strong>
              <span>{selectedProperty.type}</span>
              <span>Status: {selectedProperty.status}</span>
            </div>
          ) : (
            <p>Add farm properties first from Farm Structure.</p>
          )}
        </Card>
      </div>

      <Card title="Recent Property Costs" action={<Pill>{expenses.length} records</Pill>}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Farm Property</th>
                <th>Cost Type</th>
                <th>Count</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length ? (
                expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.expenseDate}</td>
                    <td>
                      <strong>{expense.propertyName || "General farm"}</strong>
                      <div className="table-sub">{expense.propertyType || "-"}</div>
                    </td>
                    <td>{expense.costType}</td>
                    <td>{expense.propertyCount ?? "-"}</td>
                    <td>Rs {expense.amount.toLocaleString("en-US")}</td>
                    <td>{expense.paymentStatus}</td>
                    <td>{expense.notes || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>No farm costs recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
