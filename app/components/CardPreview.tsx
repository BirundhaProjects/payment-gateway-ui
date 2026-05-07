import { CardType } from "../types/payment";

interface CardPreviewProps {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cardType: CardType;
}

export default function CardPreview({
  cardholderName, cardNumber, expiryDate, cardType
}: CardPreviewProps) {
  const cardLabel = {
    visa: 'VISA',
    mastercard: 'MASTERCARD',
    amex: 'AMEX',
    unknown: 'CARD'
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-black to-gray-800 p-6 text-white shadow-lg">
      <div className="mb-10 flex items-center justify-between">
        <p className="text-sm uppercase tracking-widest text-gray-300">Payment Card</p>
        <div className="rounded-md bg-white/20 px-3 py-1 text-sm font-semibold">{cardLabel[cardType]}</div>
      </div>
      <div className="mb-8 text-2xl tracking-[0.2em]">
        {cardNumber || ".... .... .... ...."}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs text-gray-400">Card Holder</p>
          <p className="text-sm uppercase tracking-wide">{cardholderName || "Your Name"}</p>
        </div>
        <div>
          <p className="mb-1 text-xs text-gray-400">Expires</p>
          <p className="text-sm">{expiryDate || "MM/YY"}</p>
        </div>
      </div>
    </div>
  );
}