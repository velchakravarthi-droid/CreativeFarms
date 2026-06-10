import { Card, Pill } from "@/components/ui";
import type { StockBalance, StockItem } from "@/lib/load-stock-data";

export function StockBalanceTable({ balances, items }: { balances: StockBalance[]; items: StockItem[] }) {
  return (
    <Card title="Current Stock" action={<Pill>{items.length} items</Pill>}>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Type</th>
              <th>Item Name</th>
              <th>Current Balance</th>
              <th>Base Unit</th>
              <th>Package Balance</th>
              <th>Minimum Stock Alert</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.map((item) => {
                const balance = balances.find((stockBalance) => stockBalance.itemId === item.itemId);
                const current = Number(balance?.currentBaseQuantity ?? 0);
                const low = item.minimumStockQuantity > 0 && current <= minimumBase(item);

                return (
                  <tr key={item.itemId}>
                    <td>{item.categoryName}</td>
                    <td>{item.typeName || "-"}</td>
                    <td>{item.itemName}</td>
                    <td>{displayBalance(item, current)}</td>
                    <td>{item.baseUnit}</td>
                    <td>{item.hasPackage && item.packageQuantity ? `${formatQty(current / item.packageQuantity)} ${item.packageName}` : "-"}</td>
                    <td>{item.minimumStockQuantity ? `${item.minimumStockQuantity} ${item.minimumStockUnit}` : "-"}</td>
                    <td>
                      <Pill tone={low ? "warn" : "good"}>{low ? "Low Stock" : "OK"}</Pill>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8}>No stock items are configured yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function minimumBase(item: StockItem) {
  if (!item.minimumStockQuantity) return 0;
  if (item.hasPackage && item.minimumStockUnit === item.packageName) {
    return item.minimumStockQuantity * item.packageQuantity;
  }
  return item.minimumStockQuantity;
}

function displayBalance(item: StockItem, current: number) {
  if (item.hasPackage && item.packageQuantity) {
    const packageCount = current / item.packageQuantity;
    return `${formatQty(packageCount)} ${item.packageName} / ${formatQty(current)} ${item.baseUnit}`;
  }
  return `${formatQty(current)} ${item.baseUnit}`;
}

function formatQty(value: number) {
  return Number(value.toFixed(3)).toString();
}
