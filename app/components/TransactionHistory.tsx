"use client";

import { useEffect, useState } from "react";
import { usePaymentStore } from "../store/paymentStore";
import { Transaction } from "../types/payment";

export default function TransactionHistory() {
  const { transactions, loadTransactions, } = usePaymentStore();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <p className="font-medium">No Transactions yet</p>
        <p className="mt-2 text-sm text-gray-500">Your payment history will appear here</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Transaction History</h2>
        <p className="text-sm text-gray-500">View Previous Payments</p>
      </div>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <button
            key={transaction.transactionId}
            type="button"
            onClick={() => setSelectedTransaction(transaction)}
            className="w-full rounded-xl border p-4 text-left transition hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">
                {transaction.transactionId.slice(0, 8)}...
              </p>
              <span className="rounded-full border px-3 py-1 text-xs capitalize">{transaction.status}</span>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                <p>{transaction.currency}{" "}{transaction.amount}</p>
                <p>{new Date(transaction.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      {selectedTransaction && (
        <div className="rounded-xl border p-4">
          <h3 className="mb-4 text-lg font-semibold">Transaction Details</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Transaction ID:</span>{" "}{selectedTransaction.transactionId}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}{selectedTransaction.status}
            </p>
            <p>
              <span className="font-medium">Amount:</span>{" "}{selectedTransaction.currency}{" "}{selectedTransaction.amount}
            </p>
            <p>
              <span className="font-medium">Attempts:</span>{" "}{selectedTransaction.attempts}
            </p>
            <p>
              <span className="font-medium">Timestamp:</span>{" "}{new Date(selectedTransaction.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}