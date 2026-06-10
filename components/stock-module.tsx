"use client";

import { addStock, createStockCategory, createStockItem, createStockType, reduceStock } from "@/app/stock/actions";
import { Card, Pill } from "@/components/ui";
import type { StockBalance, StockCategory, StockItem, StockTransaction, StockType } from "@/lib/load-stock-data";
import { useMemo, useState, useTransition } from "react";

type Worker = {
  name: string;
};

type PendingAction = {
  action: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
  formData: FormData;
  message: string;
};

type StockTab = "category-type" | "stock-item" | "add-stock" | "reduce-stock" | "history";

const units = ["Kg", "Bag", "Litre", "Piece", "Meter", "Ton", "Bottle", "Can"];
const usedForOptions = [
  "Fertigation",
  "Soil Application",
  "Pest Spray",
  "Disease Control",
  "Weed Control",
  "Irrigation Repair",
  "Equipment Maintenance",
  "Tractor Usage",
  "Generator Usage",
  "Harvesting",
  "Packing",
  "General Farm Use"
];

export function StockModule({
  categories,
  types,
  items,
  balances,
  transactions,
  workers,
  zones
}: {
  categories: StockCategory[];
  types: StockType[];
  items: StockItem[];
  balances: StockBalance[];
  transactions: StockTransaction[];
  workers: Worker[];
  zones: string[];
}) {
  const [activeTab, setActiveTab] = useState<StockTab>("category-type");
  const [selectedItemId, setSelectedItemId] = useState(items[0]?.itemId ?? "");
  const [selectedTypeCategoryId, setSelectedTypeCategoryId] = useState(categories[0]?.categoryId ?? "");
  const [selectedItemCategoryId, setSelectedItemCategoryId] = useState(categories[0]?.categoryId ?? "");
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [isPending, startTransition] = useTransition();
  const selectedItem = items.find((item) => item.itemId === selectedItemId) ?? items[0];
  const itemCategoryOptions = useMemo(() => types.filter((type) => type.categoryId === selectedItemCategoryId), [selectedItemCategoryId, types]);

  function balanceFor(item: StockItem) {
    return balances.find((balance) => balance.itemId === item.itemId);
  }

  function displayBalance(item: StockItem) {
    const balance = balanceFor(item);
    const base = Number(balance?.currentBaseQuantity ?? 0);
    if (item.hasPackage && item.packageQuantity) {
      const packageCount = base / item.packageQuantity;
      return `${formatQty(packageCount)} ${item.packageName} / ${formatQty(base)} ${item.baseUnit}`;
    }
    return `${formatQty(base)} ${item.baseUnit}`;
  }

  function requestAction(action: PendingAction["action"], formData: FormData, message: string) {
    setPendingAction({ action, formData, message });
  }

  function proceedAction() {
    if (!pendingAction) return;
    const transaction = pendingAction;
    setPendingAction(null);
    startTransition(() => {
      void (async () => {
        const result = await transaction.action(transaction.formData);
        if (!result.ok) {
          window.alert(result.error ?? "Transaction failed.");
          return;
        }
        window.location.reload();
      })();
    });
  }

  return (
    <div className="content">
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

      <section className="module-section stock-workspace">
        <div className="stock-tabs" role="tablist" aria-label="Stock maintenance">
          {[
            ["category-type", "Add Category / Type"],
            ["stock-item", "Add Stock Item"],
            ["add-stock", "Add Stock"],
            ["reduce-stock", "Reduce Stock"],
            ["history", "History"]
          ].map(([id, label]) => (
            <button
              aria-selected={activeTab === id}
              className={`stock-tab ${activeTab === id ? "active" : ""}`}
              key={id}
              onClick={() => setActiveTab(id as StockTab)}
              role="tab"
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "category-type" ? (
          <Card title="Add Category / Type" action={<Pill>Master</Pill>}>
            <form
              className="entry-grid"
              onSubmit={(event) => {
                event.preventDefault();
                requestAction(createStockCategory, new FormData(event.currentTarget), "Add this stock category?");
              }}
            >
              <label className="field">
                <span>Category Name</span>
                <input name="category_name" placeholder="Organic Input" required />
              </label>
              <label className="field">
                <span>Description</span>
                <input name="description" placeholder="Optional" />
              </label>
              <button className="button secondary-button" disabled={isPending} type="submit">
                Add Category
              </button>
            </form>
            <form
              className="entry-grid stacked-form"
              onSubmit={(event) => {
                event.preventDefault();
                requestAction(createStockType, new FormData(event.currentTarget), "Add this stock type?");
              }}
            >
              <label className="field">
                <span>Category</span>
                <select
                  name="category_id"
                  onChange={(event) => setSelectedTypeCategoryId(event.target.value)}
                  required
                  value={selectedTypeCategoryId}
                >
                  {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Stock Type Name</span>
                <input name="stock_type_name" placeholder="Bio-fertilizer" required />
              </label>
              <button className="button secondary-button" disabled={isPending || !categories.length} type="submit">
                Add Type
              </button>
            </form>
          </Card>
        ) : null}

        {activeTab === "stock-item" ? (
          <Card title="Add Stock Item" action={<Pill>Item</Pill>}>
            <form
              className="entry-grid"
              onSubmit={(event) => {
                event.preventDefault();
                requestAction(createStockItem, new FormData(event.currentTarget), "Add this stock item?");
              }}
            >
              <label className="field">
                <span>Category</span>
                <select name="category_id" onChange={(event) => setSelectedItemCategoryId(event.target.value)} required value={selectedItemCategoryId}>
                  {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Type</span>
                <select name="stock_type_id">
                  <option value="">No type</option>
                  {itemCategoryOptions.map((type) => (
                    <option key={type.typeId} value={type.typeId}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Item Name</span>
                <input name="item_name" placeholder="Urea" required />
              </label>
              <label className="field">
                <span>Base Unit</span>
                <select name="base_unit" required>
                  {units.map((unit) => (
                    <option key={unit}>{unit}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Has Package</span>
                <select name="has_package" defaultValue="false">
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </label>
              <label className="field">
                <span>Package Name</span>
                <input name="package_name" placeholder="Bag" />
              </label>
              <label className="field">
                <span>Package Quantity</span>
                <input min="0" name="package_quantity" placeholder="45" type="number" />
              </label>
              <label className="field">
                <span>Package Unit</span>
                <select name="package_unit">
                  {units.map((unit) => (
                    <option key={unit}>{unit}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Minimum Stock Quantity</span>
                <input min="0" name="minimum_stock_quantity" placeholder="10" type="number" />
              </label>
              <label className="field">
                <span>Minimum Stock Unit</span>
                <select name="minimum_stock_unit">
                  {units.map((unit) => (
                    <option key={unit}>{unit}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Active</span>
                <select name="is_active" defaultValue="true">
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </label>
              <button className="button" disabled={isPending || !categories.length} type="submit">
                Add Item
              </button>
            </form>
          </Card>
        ) : null}

        {activeTab === "add-stock" ? (
          <Card title="Add Stock" action={<Pill>Purchase</Pill>}>
            <StockMovementForm
              action={addStock}
              buttonText="Add Stock"
              isPending={isPending}
              items={items}
              mode="ADD"
              onItemChange={setSelectedItemId}
              onSubmit={requestAction}
              selectedItem={selectedItem}
            />
          </Card>
        ) : null}

        {activeTab === "reduce-stock" ? (
          <Card title="Reduce Stock" action={<Pill tone="warn">Usage</Pill>}>
            <p>Available: {selectedItem ? displayBalance(selectedItem) : "-"}</p>
            <StockMovementForm
              action={reduceStock}
              balances={balances}
              buttonText="Reduce Stock"
              isPending={isPending}
              items={items}
              mode="REDUCE"
              onItemChange={setSelectedItemId}
              onSubmit={requestAction}
              selectedItem={selectedItem}
              workers={workers}
              zones={zones}
            />
          </Card>
        ) : null}

        {activeTab === "history" ? (
          <Card title="Transaction History" action={<Pill>{transactions.length} transactions</Pill>}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Base Qty</th>
                  <th>Cost</th>
                  <th>Used For</th>
                  <th>Supplier</th>
                  <th>Notes</th>
                  <th>Created By</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.transactionId}>
                    <td>{transaction.transactionDate}</td>
                    <td>{transaction.transactionType}</td>
                    <td>{transaction.itemName}</td>
                    <td>
                      {formatQty(transaction.quantity)} {transaction.quantityUnit}
                    </td>
                    <td>
                      {formatQty(transaction.baseQuantity)} {transaction.baseUnit}
                    </td>
                    <td>{transaction.totalCost ?? "-"}</td>
                    <td>{transaction.usedFor || "-"}</td>
                    <td>{transaction.supplierName || "-"}</td>
                    <td>{transaction.notes || "-"}</td>
                    <td>{transaction.createdBy || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </Card>
        ) : null}
      </section>
    </div>
  );
}

function StockMovementForm({
  action,
  balances,
  buttonText,
  isPending,
  items,
  mode,
  onItemChange,
  onSubmit,
  selectedItem,
  workers = [],
  zones = []
}: {
  action: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
  balances?: StockBalance[];
  buttonText: string;
  isPending: boolean;
  items: StockItem[];
  mode: "ADD" | "REDUCE";
  onItemChange: (itemId: string) => void;
  onSubmit: (action: (formData: FormData) => Promise<{ ok: boolean; error?: string }>, formData: FormData, message: string) => void;
  selectedItem?: StockItem;
  workers?: Worker[];
  zones?: string[];
}) {
  const balance = selectedItem ? balances?.find((itemBalance) => itemBalance.itemId === selectedItem.itemId) : null;
  return (
    <form
      className="entry-grid"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(action, new FormData(event.currentTarget), mode === "ADD" ? "Add this stock purchase?" : "Reduce this stock?");
      }}
    >
      <label className="field">
        <span>Stock Item</span>
        <select
          name="item_id"
          onChange={(event) => onItemChange(event.target.value)}
          required
          value={selectedItem?.itemId ?? ""}
        >
          {items.map((item) => (
            <option key={item.itemId} value={item.itemId}>
              {item.itemName}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>{mode === "ADD" ? "Purchase Date" : "Usage Date"}</span>
        <input defaultValue={new Date().toISOString().slice(0, 10)} name="transaction_date" required type="date" />
      </label>
      {mode === "REDUCE" ? (
        <label className="field">
          <span>Current Available Balance</span>
          <input readOnly value={balance ? `${formatQty(balance.currentBaseQuantity)} ${balance.baseUnit}` : "0"} />
        </label>
      ) : null}
      {selectedItem?.hasPackage ? (
        <>
          <label className="field">
            <span>Package Count</span>
            <input min="0" name="package_count" placeholder="20" step="0.001" type="number" />
          </label>
          <label className="field">
            <span>Quantity Per Package</span>
            <input defaultValue={selectedItem.packageQuantity || ""} min="0" name="quantity_per_package" step="0.001" type="number" />
          </label>
        </>
      ) : (
        <label className="field">
          <span>{mode === "ADD" ? "Quantity Added" : "Quantity Used"}</span>
          <input min="0" name="quantity" placeholder="200" step="0.001" type="number" />
        </label>
      )}
      <label className="field">
        <span>Quantity Unit</span>
        <input name="quantity_unit" readOnly value={selectedItem?.hasPackage ? selectedItem.packageName : selectedItem?.baseUnit ?? ""} />
      </label>
      {mode === "ADD" ? (
        <>
          <label className="field">
            <span>Cost Per Unit / Package</span>
            <input min="0" name="cost_per_unit" step="0.01" type="number" />
          </label>
          <label className="field">
            <span>Total Cost</span>
            <input min="0" name="total_cost" step="0.01" type="number" />
          </label>
          <label className="field">
            <span>Supplier Name</span>
            <input name="supplier_name" />
          </label>
          <label className="field">
            <span>Invoice Number</span>
            <input name="invoice_number" />
          </label>
          <label className="field">
            <span>Storage Location</span>
            <input name="storage_location" />
          </label>
        </>
      ) : (
        <>
          <label className="field">
            <span>Used For</span>
            <select name="used_for" required>
              {usedForOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Zone</span>
            <select name="zone_id">
              {zones.map((zone) => (
                <option key={zone}>{zone}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Row Range</span>
            <input name="row_range" placeholder="Row 1-3" />
          </label>
          <label className="field">
            <span>Worker Name</span>
            <select name="worker_name">
              {workers.map((worker) => (
                <option key={worker.name}>{worker.name}</option>
              ))}
            </select>
          </label>
        </>
      )}
      <label className="field entry-grid-wide">
        <span>Notes</span>
        <input name="notes" placeholder="Optional notes" />
      </label>
      <button className="button" disabled={isPending || !items.length} type="submit">
        {buttonText}
      </button>
    </form>
  );
}

function formatQty(value: number) {
  return Number(value.toFixed(3)).toString();
}
