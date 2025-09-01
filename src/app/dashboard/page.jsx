import TransactionsTable from "@/components/TransactionsTable";

const transactions = [
  { id: 1, name: "Order #1", date: "2025-08-01", amount: 200000 },
  { id: 2, name: "Order #2", date: "2025-08-05", amount: 150000 },
  { id: 3, name: "Order #3", date: "2025-08-15", amount: 300000 },
  { id: 4, name: "Order #4", date: "2025-08-28", amount: 400000 },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 font-poppins">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <TransactionsTable data={transactions} />
    </div>
  );
}
