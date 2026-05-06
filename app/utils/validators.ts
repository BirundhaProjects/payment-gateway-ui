import { CardType } from "../types/payment";

export const validateCardHolderName = (name: string) => {
  if (!name.trim()) return "Cardholder name is required.";
  if (!/^[a-zA-Z\s]+$/.test(name)) return "Cardholder name can only contain letters and spaces.";
  return "";
}

export const validateCardNumber = (number: string) => {
  const cleaned = number.replace(/\s/g, "");
  if (!cleaned) return "Card number is required.";
  if (!/^\d{13,19}$/.test(cleaned)) return "Card number must be between 13 and 19 digits.";
  return "";
}

export const validateExpiryDate = (date: string) => {
  if (!date.trim()) return "Expiry date is required.";
  if (!/^\d{2}\/\d{2}$/.test(date)) return "Expiry date must be in MM/YY format.";
  const [month, year] = date.split("/").map(Number);
  if (month < 1 || month > 12) return "Expiry month must be between 01 and 12.";
  const currentYear = new Date().getFullYear() % 100;
  if (year < currentYear || year > currentYear + 20) return "Expiry year is invalid.";
  const currentMonth = new Date().getMonth() + 1;
  if (year === currentYear && month < currentMonth) return "Card has expired.";
  const today = new Date(); const expiryDate = new Date(2000 + year, month - 1);
  if (expiryDate < today) return "Card has expired.";
  return "";
}

export const validateCVV = (cvv: string, cardType: CardType) => {
  if (!cvv.trim()) return "CVV is required.";
  const cvvLength = cardType === "amex" ? 4 : 3;
  if (!new RegExp(`^\\d{${cvvLength}}$`).test(cvv)) return `CVV must be ${cvvLength} digits.`;
  return "";
}

export const validateAmount = (amount: number) => {
  if (isNaN(amount) || amount <= 0) return "Amount must be a greater than 0.";
  return "";
}