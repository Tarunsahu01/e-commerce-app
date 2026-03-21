import { Link } from 'react-router-dom';

export function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="card-surface p-6">
        <h1 className="text-2xl font-bold text-black">Contact</h1>
        <p className="mt-3 text-gray-700 leading-relaxed">
          For help with orders, payments, or products, reach us at{' '}
          <a className="underline" href="mailto:vermahg@rknec.edu">
            vermahg@rknec.edu
          </a>
          .
        </p>
        <Link to="/" className="btn-secondary mt-6 justify-center">
          Back to home
        </Link>
      </div>
    </div>
  );
}

