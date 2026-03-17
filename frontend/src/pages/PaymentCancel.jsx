import { Link } from 'react-router-dom';

export default function PaymentCancel() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
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
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-900 transition-colors"
          >
            Back to cart
          </Link>
          <Link
            to="/"
            className="px-4 py-2 text-sm font-medium text-black border border-black rounded-md hover:bg-gray-100 transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}