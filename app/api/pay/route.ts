import { PaymentPayload, PaymentResponse } from "@/app/types/payment";
import { NextResponse } from "next/server";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  const body: PaymentPayload = await request.json();
  await delay(2000);

  const random = Math.random();

  if (random < 0.6) {
    const response: PaymentResponse = {
      success: true,
      message: "Payment processed successfully.",
      status: "success",
    };
    return NextResponse.json(response, { status: 200 });
  }
  if (random < 0.85) {
    const failureReasons = [
      "Insufficient funds.",
      "Bank declined the transaction.",
      "Card reported lost or stolen.",
      "Invalid card details.",
    ];
    const randomReason = failureReasons[Math.floor(Math.random() * failureReasons.length)];
    const response: PaymentResponse = {
      success: false,
      message: `Payment failed: ${randomReason}`,
      status: "failed",
    };
    return NextResponse.json(response, { status: 400 });
  }
  await delay(8000);
  const response: PaymentResponse = {
    success: false,
    message: "Payment timed out. Please try again.",
    status: "timeout",
  };
  return NextResponse.json(response, { status: 408 });
}