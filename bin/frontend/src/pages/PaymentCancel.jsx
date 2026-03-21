import { Link } from 'react-router-dom';

export default function PaymentCancel() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="card-surface p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-red-50 text-red-700" aria-hidden="true">
            !
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-black">Payment Cancelled</h1>
            <p className="mt-1 text-sm text-gray-700">
              Your payment was not completed. No order was confirmed on this step.
            </p>
            <p className="mt-2 text-sm text-gray-700">
              You can try again from your cart.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            to="/cart"
            className="btn-primary"
          >
            Back to cart
          </Link>
          <Link
            to="/"
            className="btn-secondary"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}