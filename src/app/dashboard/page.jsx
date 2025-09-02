import TransactionsTable from "@/components/TransactionsTable";

const transactions = [
  {
    no: 1,
    nopen: 87100,
    namaKantor: "KC WAINGAPU 87100",
    KCKCU: 87100,
    REG: 3,
    tipeKantor: "KPRK",
    tTrxRitel: 1,
    tRevRitel: 16.2,
    tBrtRitel: 0.56,
    tTrxLoket: 1,
    tRevLoket: 16.2,
    tBrtLoket: 0.56,
    tTrxAgenPos: 0,
    tRevAgenPos: 0,
    tBrtAgenPos: 0,
    tTrxOranger: 0,
    tRevOranger: 0,
    tBrtOranger: 0,
    tTrxMplace: 0,
    tRevMplace: 0,
    tBrtMplace: 0,
    tTrxPosAja: 0,
    tRevPosAja: 0,
    tBrtPosAja: 0,
    tTrxLPU: 0,
    tRevLPU: 0,
    tBrtLPU: 0,
  },
  {
    no: 2,
    nopen: 33000,
    namaKantor: "KC UJUNG BERUNG 87100",
    KCKCU: 87100,
    REG: 3,
    tipeKantor: "KC",
    tTrxRitel: 1,
    tRevRitel: 16.2,
    tBrtRitel: 0.56,
    tTrxLoket: 1,
    tRevLoket: 16.2,
    tBrtLoket: 0.56,
    tTrxAgenPos: 0,
    tRevAgenPos: 0,
    tBrtAgenPos: 0,
    tTrxOranger: 0,
    tRevOranger: 0,
    tBrtOranger: 0,
    tTrxMplace: 0,
    tRevMplace: 0,
    tBrtMplace: 0,
    tTrxPosAja: 0,
    tRevPosAja: 0,
    tBrtPosAja: 0,
    tTrxLPU: 0,
    tRevLPU: 0,
    tBrtLPU: 0,
  },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="p-6 space-y-6 font-poppins">
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>
      <div>
        {/* date time picker here */}
        <TransactionsTable data={transactions} />
      </div>
    </div>
  );
}
