import Link from "next/link";
import { CheckCircle2, Download, Printer } from "lucide-react";
import { downloadCashMemo, openCashMemo } from "@/lib/cashMemo";
import { Button, Modal, formatTaka } from "@/components/Dashboard/Kit";

export default function SaleCompleteModal({ sale, settings, onClose }) {
  return (
    <Modal
      open={!!sale}
      onClose={onClose}
      size="sm"
      title="Sale completed"
      footer={
        <>
          <Link href={sale ? `/dashboard/orders/${sale._id}` : "#"} className="mr-auto inline-flex h-10 items-center rounded-xl px-3 text-sm font-semibold text-gray-600 hover:bg-gray-100">View order</Link>
          <Button variant="primary" onClick={onClose}>New sale</Button>
        </>
      }
    >
      {sale && (
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-7 w-7" /></span>
          <p className="mt-3 font-mono text-sm font-semibold text-gray-500">{sale.invoiceNumber}</p>
          <p className="mt-1 text-3xl font-extrabold text-gray-900">{formatTaka(sale.total)}</p>
          {sale.payment?.change > 0 && <p className="mt-1 text-sm text-gray-600">Give change: <span className="font-bold text-gray-900">{formatTaka(sale.payment.change)}</span></p>}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button variant="secondary" className="justify-center" onClick={() => downloadCashMemo(sale, settings)}><Download className="h-4 w-4" /> Memo PDF</Button>
            <Button variant="secondary" className="justify-center" onClick={() => openCashMemo(sale, settings)}><Printer className="h-4 w-4" /> Print</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
