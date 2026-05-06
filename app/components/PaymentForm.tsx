"use client";

import { useMemo, useState } from "react";
import { CardType, CurrencyType, PaymentFormErrors } from "../types/payment";
import { detectCardType, formatCardNumber } from "../utils/cardUtils";
import { validateAmount, validateCardHolderName, validateCardNumber, validateCVV, validateExpiryDate } from "../utils/validators";
import { formatExpityDate } from "../utils/formatters";

export default function PaymentForm() {
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyType>('INR');
  const [errors, setErrors] = useState<PaymentFormErrors>({});

  const cardType: CardType = detectCardType(cardNumber);

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

  return (
    <form className="space-y-4 rounded-xl border p-6 shadow-sm">
      <div>
        <label htmlFor="cardholderName" className="mb-1 block text-sm font-medium">Cardholder Name</label>
        <input id="cardholderName" type="text" value={cardholderName} onChange={(e) => {
          setCardholderName(e.target.value)
          updateError('cardHolderName', validateCardHolderName(e.target.value))
        }} className="w-full rounded-lg border p-3" />
        {errors.cardHolderName && (
          <p className="mt-1 text-sm text-red-500">{errors.cardHolderName}</p>
        )}
      </div>
      <div>
        <label htmlFor="cardNumber" className="mb-1 block text-sm font-medium">Card Number</label>
        <input id="cardNumber" type="text" value={cardNumber} onChange={(e) => {
          const formatted = formatCardNumber(e.target.value);
          setCardNumber(formatted)
          updateError('cardNumber', validateCardNumber(formatted))
        }} className="w-full rounded-lg border p-3" maxLength={19} />
        <p className="mt-1 text-sm">Card Type: {cardType}</p>
        {errors.cardNumber && (
          <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiryDate" className="mb-1 block text-sm font-medium">Expiry Date</label>
          <input id="expiryDate" type="text" placeholder="MM/YY" value={expiryDate} onChange={(e) => {
            const formatted = formatExpityDate(e.target.value);
            setExpiryDate(formatted)
            updateError('expiryDate', validateExpiryDate(formatted))
          }} className="w-full rounded-lg border p-3" maxLength={5} />
          {errors.expiryDate && (
            <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>
          )}
        </div>
        <div>
          <label htmlFor="cvv" className="mb-1 block text-sm font-medium">CVV</label>
          <input id="cvv" type="password" value={cvv} onChange={(e) => {
            const cleaned = e.target.value.replace(/\D/g, "");
            setCvv(cleaned);
            updateError('cvv', validateCVV(cleaned, cardType))
          }} className="w-full rounded-lg border p-3" maxLength={cardType === 'amex' ? 4 : 3} />
          {errors.cvv && (
            <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="mb-1 block text-sm font-medium">Amount</label>
          <input id="amount" type="number" value={amount} onChange={(e) => {
            setAmount(e.target.value);
            updateError('amount', validateAmount(Number(e.target.value)))
          }} className="w-full rounded-lg border p-3" />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
          )}
        </div>
        <div>
          <label htmlFor="currency" className="mb-1 block text-sm font-medium">Currency</label>
          <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value as CurrencyType)} className="w-full rounded-lg border p-3" >
            <option value={'INR'}>INR</option>
            <option value={'USD'}>USD</option>
          </select>
        </div>
      </div>
      <button type="submit" disabled={!isFormValid} className="w-full rounded-lg bg-black p-3 text-white disabled:opacity-50">Pay Now</button>
    </form>
  )
}