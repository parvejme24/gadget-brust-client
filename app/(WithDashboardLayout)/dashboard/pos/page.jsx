"use client";

import { usePosSale } from "@/components/Dashboard/Pos/usePosSale";
import PosProductGrid from "@/components/Dashboard/Pos/PosProductGrid";
import PosCustomer from "@/components/Dashboard/Pos/PosCustomer";
import PosLines from "@/components/Dashboard/Pos/PosLines";
import PosDiscounts from "@/components/Dashboard/Pos/PosDiscounts";
import PosPayment from "@/components/Dashboard/Pos/PosPayment";
import PosTotals from "@/components/Dashboard/Pos/PosTotals";
import SaleCompleteModal from "@/components/Dashboard/Pos/SaleCompleteModal";

export default function PosPage() {
  const sale = usePosSale();

  return (
    <div className="-mx-4 -my-6 sm:-mx-6 lg:-mx-8 lg:-my-8">
      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_420px]">
        <PosProductGrid qtyOf={sale.qtyOf} onAdd={sale.add} />

        <aside className="border-t border-gray-200/70 bg-surface lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:border-l lg:border-t-0">
          <div className="flex h-full flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <PosCustomer
                mode={sale.customerMode}
                onModeChange={sale.setCustomerMode}
                walkin={sale.walkin}
                onWalkinChange={sale.setWalkin}
                customer={sale.customer}
                onCustomerChange={sale.setCustomer}
              />
              <PosLines cart={sale.cart} onQty={sale.setQty} onRemove={sale.removeLine} onClear={sale.clearCart} />
              <PosDiscounts sale={sale} />
              <PosPayment sale={sale} />
            </div>
            <PosTotals sale={sale} />
          </div>
        </aside>
      </div>

      <SaleCompleteModal sale={sale.completed} settings={sale.settings} onClose={() => sale.setCompleted(null)} />
    </div>
  );
}
