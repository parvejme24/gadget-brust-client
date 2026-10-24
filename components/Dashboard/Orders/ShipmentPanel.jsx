"use client";

import { Bike, Copy, ExternalLink, Phone, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button, CourierBadge, Panel, buttonClass, formatDate, trackingLink } from "@/components/Dashboard/Kit";

export default function ShipmentPanel({ order, onEdit, editable = true }) {
  const shipment = order.shipment?.courier ? order.shipment : null;
  const cancelled = order.orderStatus === "cancelled";
  const track = trackingLink(shipment?.courier, shipment?.trackingNumber);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shipment.trackingNumber);
      toast.success("Tracking number copied");
    } catch {
      toast.error("Couldn't copy");
    }
  };

  return (
    <Panel
      title="Shipment"
      action={
        editable &&
        !cancelled && (
          <button onClick={onEdit} className="text-xs font-semibold text-gray-500 hover:text-gray-900 print:hidden">
            {shipment ? "Change" : "Assign courier"}
          </button>
        )
      }
    >
      {shipment ? (
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <CourierBadge courier={shipment.courier} />
            <div className="min-w-0">
              <p className="font-semibold text-gray-900">{shipment.courier.name}</p>
              <p className="text-xs text-gray-500">Handed over {formatDate(shipment.shippedAt)}</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 rounded-xl bg-gray-50 px-3 py-2.5">
            <div className="min-w-0">
              <p className="text-[11px] text-gray-500">Tracking number</p>
              <p className="truncate font-mono text-sm font-semibold text-gray-900">{shipment.trackingNumber || "Not added"}</p>
            </div>
            {shipment.trackingNumber && (
              <div className="flex shrink-0 gap-1 print:hidden">
                <button onClick={copy} title="Copy tracking number" className={buttonClass("ghost", "icon")}><Copy className="h-4 w-4" /></button>
                {track && (
                  <a href={track} target="_blank" rel="noopener noreferrer" title="Track parcel" className={buttonClass("ghost", "icon")}><ExternalLink className="h-4 w-4" /></a>
                )}
              </div>
            )}
          </div>
          {shipment.note && <p className="text-xs text-gray-500">{shipment.note}</p>}
          {shipment.courier.phone && (
            <a href={`tel:${shipment.courier.phone}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900"><Phone className="h-3.5 w-3.5" /> {shipment.courier.phone}</a>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center py-2 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-400"><Bike className="h-5 w-5" /></span>
          <p className="mt-2 text-sm font-medium text-gray-900">Not shipped yet</p>
          {editable && !cancelled && (
            <Button size="sm" variant="secondary" className="mt-3 print:hidden" onClick={onEdit}><Truck className="h-3.5 w-3.5" /> Ship with courier</Button>
          )}
        </div>
      )}
    </Panel>
  );
}
