import PaymentForm from "./components/PaymentForm";
import TransactionHistory from "./components/TransactionHistory";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Payment Gateway</h1>
      <div className="grid gap-8 xl:grid-cols-2">
        <PaymentForm />
        <TransactionHistory />
      </div>
    </main>
  );
}
