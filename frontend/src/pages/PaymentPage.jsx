/**
 * PaymentPage: Placeholder payment UI.
 */
import { useToast } from '../context/ToastContext';

export function PaymentPage() {
  const { showToast } = useToast();

  const handleProceed = () => {
    showToast('Payment integration coming soon', 'info');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-black">Payment Gateway</h1>
      <p className="mt-3 text-gray-700">
        This is the payment page. Payment integration will be added later.
      </p>

      <button
        type="button"
        onClick={handleProceed}
        className="mt-6 px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-900 transition-colors"
      >
        Proceed to Pay
      </button>
    </div>
  );
}

