"use client";

import { createFarmProperty, deleteFarmProperty, updateFarmProperty } from "@/app/farm-structure/actions";
import { Card, Pill } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

type FarmProperty = {
  id: string;
  type: string;
  name: string;
  quantity: string;
  status: string;
};

type PendingAction = {
  action: (formData: FormData) => Promise<void>;
  formData: FormData;
  message: string;
};

export function FarmPropertyMaintenance({ properties, isAdmin }: { properties: FarmProperty[]; isAdmin: boolean }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(properties[0]?.id ?? "");
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [isPending, startTransition] = useTransition();
  const selectedProperty = useMemo(
    () => properties.find((property) => property.id === selectedId) ?? properties[0],
    [properties, selectedId]
  );

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
          <span>Only Admin role can add, modify, or delete farm properties.</span>
        </section>
      ) : null}

      <div className="master-detail-grid">
        <Card title="Farm Properties" action={<Pill>{properties.length} masters</Pill>}>
          <div className="land-block-list">
            {properties.map((property) => (
              <button
                className={`land-block-card ${property.id === selectedProperty?.id ? "selected" : ""}`}
                key={property.id}
                onClick={() => setSelectedId(property.id)}
                type="button"
              >
                <div>
                  <strong>{property.name}</strong>
                  <span>{property.type}</span>
                </div>
                <div className="land-block-meta">
                  <span>{property.quantity || "-"}</span>
                  <span>{property.status}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card title="Property Maintenance" action={<Pill tone={isAdmin ? "good" : "warn"}>{isAdmin ? "Admin" : "View only"}</Pill>}>
          <form
            key={`property-${selectedProperty?.id ?? "new"}`}
            className="entry-grid single"
            onSubmit={(event) => {
              event.preventDefault();
              if (!isAdmin) return;
              requestAction(updateFarmProperty, new FormData(event.currentTarget), "Modify this farm property?");
            }}
          >
            <input name="id" type="hidden" value={selectedProperty?.id ?? ""} />
            <label className="field">
              <span>Property Type</span>
              <select disabled={!isAdmin || !selectedProperty} name="property_type" defaultValue={selectedProperty?.type ?? "Tree"}>
                <option>Tree</option>
                <option>Equipment</option>
                <option>Building</option>
                <option>Water Source</option>
                <option>Storage</option>
              </select>
            </label>
            <label className="field">
              <span>Property Name</span>
              <input disabled={!isAdmin || !selectedProperty} name="name" required defaultValue={selectedProperty?.name ?? ""} />
            </label>
            <label className="field">
              <span>Quantity</span>
              <input disabled={!isAdmin || !selectedProperty} min="0" name="quantity" type="number" defaultValue={selectedProperty?.quantity ?? ""} />
            </label>
            <label className="field">
              <span>Status</span>
              <select disabled={!isAdmin || !selectedProperty} name="status" defaultValue={selectedProperty?.status ?? "active"}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="hold">Hold</option>
              </select>
            </label>
            <button className="button" disabled={!isAdmin || !selectedProperty || isPending} type="submit">
              Modify Property
            </button>
          </form>

          <form
            className="entry-grid single stacked-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!isAdmin) return;
              requestAction(createFarmProperty, new FormData(event.currentTarget), "Add this farm property?");
              event.currentTarget.reset();
            }}
          >
            <label className="field">
              <span>New Property Type</span>
              <select disabled={!isAdmin} name="property_type" defaultValue="Tree">
                <option>Tree</option>
                <option>Equipment</option>
                <option>Building</option>
                <option>Water Source</option>
                <option>Storage</option>
              </select>
            </label>
            <label className="field">
              <span>New Property Name</span>
              <input disabled={!isAdmin} name="name" placeholder="Water Coconut" required />
            </label>
            <label className="field">
              <span>Quantity</span>
              <input disabled={!isAdmin} min="0" name="quantity" placeholder="Optional" type="number" />
            </label>
            <label className="field">
              <span>Status</span>
              <select disabled={!isAdmin} name="status" defaultValue="active">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="hold">Hold</option>
              </select>
            </label>
            <button className="button secondary-button" disabled={!isAdmin || isPending} type="submit">
              Add Property
            </button>
          </form>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!isAdmin) return;
              requestAction(deleteFarmProperty, new FormData(event.currentTarget), "Delete this farm property?");
            }}
          >
            <input name="id" type="hidden" value={selectedProperty?.id ?? ""} />
            <button className="button danger-button" disabled={!isAdmin || !selectedProperty || isPending} type="submit">
              Delete Property
            </button>
          </form>
        </Card>
      </div>
    </section>
  );
}
