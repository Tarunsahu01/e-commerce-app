import { Link } from 'react-router-dom';

export function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-black">Contact</h1>
      <p className="mt-3 text-gray-700">
        For help with orders, payments, or products, reach us at{' '}
        <a className="underline" href="mailto:vermahg@rknec.edu">
          vermahg@rknec.edu
        </a>
        .
      </p>
      <Link
        to="/"
        className="inline-block mt-6 px-4 py-2 text-sm font-medium text-black border border-black rounded-md hover:bg-gray-100 transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}

