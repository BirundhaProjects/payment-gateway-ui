
import { create } from "zustand";
import { PaymentStatus, Transaction } from "../types/payment";

interface PaymentStore {
  status: PaymentStatus;

  transactions: Transaction[];

  currentTransactionId: string | null;

  attempts: number;

  setStatus: (
    status: PaymentStatus
  ) => void;

  addTransaction: (
    transaction: Transaction
  ) => void;

  updateTransaction: (
    transactionId: string,
    status: PaymentStatus,
    attempts: number
  ) => void;

  setCurrentTransactionId: (
    id: string | null
  ) => void;

  incrementAttempts: () => void;

  resetAttempts: () => void;

  loadTransactions: () => void;
}

export const usePaymentStore =
  create<PaymentStore>((set, get) => ({
    status: "idle",

    transactions: [],

    currentTransactionId: null,

    attempts: 0,

    setStatus: (status) =>
      set({ status }),

    setCurrentTransactionId: (id) =>
      set({
        currentTransactionId: id,
      }),

    incrementAttempts: () =>
      set((state) => ({
        attempts: state.attempts + 1,
      })),

    resetAttempts: () =>
      set({ attempts: 0 }),

    addTransaction: (transaction) => {
      const updatedTransactions = [
        transaction,
        ...get().transactions,
      ];

      localStorage.setItem(
        "transactions",
        JSON.stringify(
          updatedTransactions
        )
      );

      set({
        transactions:
          updatedTransactions,
      });
    },

    updateTransaction: (
      transactionId,
      status,
      attempts
    ) => {
      const updatedTransactions =
        get().transactions.map(
          (transaction) =>
            transaction.transactionId ===
              transactionId
              ? {
                ...transaction,
                status,
                attempts,
              }
              : transaction
        );

      localStorage.setItem(
        "transactions",
        JSON.stringify(
          updatedTransactions
        )
      );

      set({
        transactions:
          updatedTransactions,
      });
    },

    loadTransactions: () => {
      const storedTransactions =
        localStorage.getItem(
          "transactions"
        );

      if (storedTransactions) {
        set({
          transactions: JSON.parse(
            storedTransactions
          ),
        });
      }
    },
  }));