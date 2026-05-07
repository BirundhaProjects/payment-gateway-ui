"use client";

import { useMemo, useState } from "react";
import { CardType, CurrencyType, PaymentFormErrors } from "../types/payment";
import { detectCardType, formatCardNumber } from "../utils/cardUtils";
import { validateAmount, validateCardHolderName, validateCardNumber, validateCVV, validateExpiryDate } from "../utils/validators";
import { formatExpityDate } from "../utils/formatters";
import CardPreview from "./CardPreview";
import { usePayment } from "../hooks/usePayment";
import { usePaymentStore } from "../store/paymentStore";

export default function PaymentForm() {
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyType>('INR');
  const [errors, setErrors] = useState<PaymentFormErrors>({});
  const [responseMessage, setResponseMessage] = useState('');

  const cardType: CardType = detectCardType(cardNumber);

  const { submitPayment } = usePayment();
  const { status, attempts } = usePaymentStore();

  const isFormValid = useMemo(() => {
    return (
      !validateCardHolderName(cardholderName) &&
      !validateCardNumber(cardNumber) &&
      !validateExpiryDate(expiryDate) &&
      !validateCVV(cvv, cardType) &&
      !validateAmount(Number(amount))
    );
  }, [cardholderName, cardNumber, expiryDate, cvv, amount, cardType]);

  const updateError = (field: keyof PaymentFormErrors, value: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: value,
    }))
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || attempts >= 3) return;
    const response = await submitPayment({
      cardholderName,
      cardNumber,
      expiryDate,
      cvv,
      amount: Number(amount),
      currency
    });
    setResponseMessage('message' in response ? response.message : '');
    if ('success' in response && response.success) {
      setCardholderName('');
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setAmount('');
    }
  };

  return (
    <div className="space-y-6">
      <CardPreview
        cardholderName={cardholderName}
        cardNumber={cardNumber}
        expiryDate={expiryDate}
        cardType={cardType}
      />
      <form className="space-y-4 rounded-xl border p-6 shadow-sm" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="cardholderName" className="mb-1 block text-sm font-medium">Cardholder Name</label>
          <input
            id="cardholderName"
            type="text"
            value={cardholderName}
            onChange={(e) => {
              setCardholderName(e.target.value)
              updateError('cardholderName', validateCardHolderName(e.target.value))
            }}
            className="w-full rounded-lg border p-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/20"
            disabled={status === "processing"}
            aria-describedby="cardholder-error"
          />
          {errors.cardholderName && (
            <p id="cardholder-error" className="mt-1 text-sm text-red-500">{errors.cardholderName}</p>
          )}
        </div>
        <div>
          <label htmlFor="cardNumber" className="mb-1 block text-sm font-medium">Card Number</label>
          <input
            id="cardNumber"
            type="text"
            value={cardNumber}
            onChange={(e) => {
              const formatted = formatCardNumber(e.target.value);
              setCardNumber(formatted)
              updateError('cardNumber', validateCardNumber(formatted))
            }}
            className="w-full rounded-lg border p-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/20"
            maxLength={19}
            disabled={status === "processing"}
            aria-describedby="cardnumber-error"
          />
          <p className="mt-1 text-sm">Card Type: {cardType}</p>
          {errors.cardNumber && (
            <p id="cardnumber-error" className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="mb-1 block text-sm font-medium">Expiry Date</label>
            <input
              id="expiryDate"
              type="text"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => {
                const formatted = formatExpityDate(e.target.value);
                setExpiryDate(formatted)
                updateError('expiryDate', validateExpiryDate(formatted))
              }}
              className="w-full rounded-lg border p-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/20"
              maxLength={5}
              disabled={status === "processing"}
              aria-describedby="expiry-error"
            />
            {errors.expiryDate && (
              <p id="expiry-error" className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>
            )}
          </div>
          <div>
            <label htmlFor="cvv" className="mb-1 block text-sm font-medium">CVV</label>
            <input
              id="cvv"
              type="password"
              value={cvv}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, "");
                setCvv(cleaned);
                updateError('cvv', validateCVV(cleaned, cardType))
              }}
              className="w-full rounded-lg border p-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/20"
              maxLength={cardType === 'amex' ? 4 : 3}
              disabled={status === "processing"}
              aria-describedby="cvv-error"
            />
            {errors.cvv && (
              <p id="cvv-error" className="mt-1 text-sm text-red-500">{errors.cvv}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="mb-1 block text-sm font-medium">Amount</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                updateError('amount', validateAmount(Number(e.target.value)))
              }}
              className="w-full rounded-lg border p-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/20"
              disabled={status === "processing"}
              aria-describedby="amount-error"
            />
            {errors.amount && (
              <p id="amount-error" className="mt-1 text-sm text-red-500">{errors.amount}</p>
            )}
          </div>
          <div>
            <label htmlFor="currency" className="mb-1 block text-sm font-medium">Currency</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyType)}
              className="w-full rounded-lg border p-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/20"
              disabled={status === "processing"}
            >
              <option value={'INR'}>INR</option>
              <option value={'USD'}>USD</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={!isFormValid || status === "processing"}
          className="w-full rounded-lg bg-black p-3 text-white disabled:cursor-not-allowed disabled:opacity-50 outline-none transition focus:border-black focus:ring-2 focus:ring-black/20"
        >
          Pay Now
        </button>
        {status !== "idle" && (
          <div className="rounded-lg border p-4">
            {status === "processing" && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                <p>Processing payment...</p>
              </div>
            )}
            {status === "success" && (
              <div aria-live="polite" className="rounded-lg bg-green-50 p-4">
                <p className="font-medium text-green-600">Payment Successful</p>
                <p className="mt-1 text-sm">{responseMessage}</p>
              </div>
            )}
            {status === "failed" && (
              <div aria-live="polite" className="rounded-lg bg-red-50 p-4">
                <p className="font-medium text-red-600">Payment Failed</p>
                <p className="mt-1 text-sm">{responseMessage}</p>
              </div>
            )}
            {status === "timeout" && (
              <div aria-live="polite" className="rounded-lg bg-orange-50 p-4">
                <p className="font-medium text-orange-600">Payment Timed Out</p>
                <p className="mt-1 text-sm">{responseMessage}</p>
              </div>
            )}
            {status !== "success" && attempts > 0 && (
              <p className="mt-3 text-sm">Attempt {attempts} of 3</p>
            )}
            {(status === "failed" || status === "timeout") &&
              attempts < 3 && (
                <button type="submit" className="mt-4 rounded-lg border px-4 py-2">Retry Payment</button>
              )}
            {attempts >= 3 && status !== 'success' && (
              <p className="mt-4 font-medium text-red-600">Maximum retry attempts reached</p>
            )}
          </div>
        )}
      </form>
    </div>
  )
}