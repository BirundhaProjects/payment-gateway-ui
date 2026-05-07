export type PaymentStatus = | "idle" | "processing" | "success" | "failed" | "timeout";

export type CardType = | "visa" | "mastercard" | "amex" | "unknown";

export type CurrencyType = | "INR" | "USD";

export interface PaymentPayload {
  transactionId: string;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: number;
  currency: CurrencyType;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  status: PaymentStatus;
}

export interface Transaction {
  transactionId: string;
  amount: number;
  currency: CurrencyType;
  status: PaymentStatus;
  timestamp: string;
  attempts: number;
}

export interface PaymentFormErrors {
  cardholderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  amount?: string;
}

