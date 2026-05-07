# Payment Gateway UI

A realistic payment gateway simulation built using Next.js App Router, TypeScript, Zustand, and Tailwind CSS.

The application simulates a real-world payment flow including:
- payment processing
- success and failure handling
- timeout handling
- retry logic
- transaction persistence


## Features

- Real-time payment form validation
- Card number auto-formatting
- Visa / Mastercard / Amex detection
- Live payment card preview
- Payment lifecycle handling
- Mock payment gateway API
- Timeout handling using AbortController
- Retry support with max 3 attempts
- Persistent transaction history using localStorage
- Responsive UI for mobile and desktop
- Accessibility support with proper labels and aria attributes


## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Zustand
- Tailwind CSS


## Setup Instructions

Clone the repository: git clone https://github.com/BirundhaProjects/payment-gateway-ui.git

Move into project folder: cd payment-gateway-ui

Install dependencies: npm install

Run development server: npm run dev

Open in browser: http://localhost:3000


## Folder Structure

src/
├── app/
│ ├── api/
│ │ └── pay/
│ │ └── route.ts
│ └── page.tsx
│
├── components/
│ ├── CardPreview.tsx
│ ├── PaymentForm.tsx
│ └── TransactionHistory.tsx
│
├── hooks/
│ └── usePayment.ts
│
├── store/
│ └── paymentStore.ts
│
├── types/
│ └── payment.ts
│
└── utils/
    ├── cardUtils.ts
    ├── formatters.ts
    └── validators.ts


## Payment Lifecycle

The application supports the following payment states:

- Idle
- Processing
- Success
- Failed
- Timeout


## Mock API Behaviour

The `/api/pay` route simulates realistic payment gateway behavior:

- ~60% Success response
- ~25% Failure response
- ~15% Delayed timeout response

Frontend timeout handling is implemented using `AbortController` with a 6-second timeout limit.


## Assumptions

- Payment processing is fully simulated using a mock API route
- No third-party payment SDKs were used
- Transaction history is stored locally using browser localStorage
- Retry attempts are limited to 3 per transaction
- Same transaction ID is reused for retries to maintain idempotency


## Accessibility

The application includes:
- visible form labels
- keyboard-friendly focus states
- aria-describedby support for validation messages
- accessible status updates using aria-live


## Future Improvements

- Add unit and integration testing
- Add dark mode support
- Improve card validation using Luhn algorithm
- Add transaction filtering and search
- Add animations and smoother transitions
- Persist transactions using a database
- Add authentication and user-specific payment history


## Deployment

The application can be deployed easily using Vercel.

Live Demo: https://your-vercel-url.vercel.app


## Build Check

Run production build before submission: npm run build

## Author

Developed as part of a frontend payment gateway assignment using Next.js and TypeScript.