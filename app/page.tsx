import Image from "next/image";
import PaymentForm from "./components/PaymentForm";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Payment Gateway</h1>
      <PaymentForm />
    </main>
  );
}
