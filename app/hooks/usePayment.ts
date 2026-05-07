"use client";

import { usePaymentStore } from "../store/paymentStore";
import { PaymentPayload, Transaction } from "../types/payment";

export const usePayment = () => {
  const {
    setStatus,
    addTransaction,
    updateTransaction,
    currentTransactionId,
    setCurrentTransactionId,
    attempts,
    incrementAttempts,
    resetAttempts,
  } = usePaymentStore();

  const submitPayment = async (payload: Omit<PaymentPayload, "transactionId">) => {
    const transactionId = currentTransactionId || crypto.randomUUID();
    if (!currentTransactionId) {
      setCurrentTransactionId(transactionId);
    }
    setStatus("processing");
    incrementAttempts();
    const currentAttempts = attempts + 1;
    const transaction: Transaction = {
      transactionId,
      amount: payload.amount,
      currency: payload.currency,
      status: "processing",
      timestamp: new Date().toISOString(),
      attempts: currentAttempts,
    };
    if (currentAttempts === 1) {
      addTransaction(transaction);
    } else {
      updateTransaction(transactionId, "processing", currentAttempts);
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 6000);
    try {
      const response = await fetch("/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...payload, transactionId }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data: PaymentResponse = await response.json();
      if (response.ok) {
        setStatus("success");
        updateTransaction(transactionId, "success", currentAttempts);
        resetAttempts();
        setCurrentTransactionId(null);
        return data;
      }
      setStatus("failed");
      updateTransaction(transactionId, "failed", currentAttempts);
      return data;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("timeout");
        updateTransaction(transactionId, "timeout", currentAttempts);
        return {
          success: false,
          message: "Payment timed out. Please try again.",
          status: "timeout",
        };
      }
      setStatus("failed");
      updateTransaction(transactionId, "failed", currentAttempts);
      return {
        success: false,
        message: "An unexpected error occurred. Please try again.",
        status: "failed",
      };
    }
  };
  return {
    submitPayment,
  };
};