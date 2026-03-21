/**
 * AdminSendOfferEmailPage: Form for admin to send offer emails to verified male users.
 * Simple form with subject and message, calls backend API.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

export function AdminSendOfferEmailPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setStatus('Please fill subject and message.');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      const response = await api.post('/admin/send-offer-email', {
        subject: subject.trim(),
        message: message.trim()
      });
      setStatus(response.data);
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Send offer error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 card-surface">
      <div className="mb-8">
        <Link
          to="/admin-dashboard"
          className="btn-ghost"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-black mb-6">Send Offer Email to Users</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full field-premium"
            placeholder="e.g., Summer Sale - 50% Off!"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            rows={8}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full field-premium resize-vertical"
            placeholder="Write your offer message here..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-70 disabled:pointer-events-none transition-colors"
        >
          {loading ? 'Sending...' : 'Send Emails'}
        </button>
      </form>

      {status && (
        <div
          className={`mt-6 p-4 rounded-2xl border ${status.includes('success') || status.includes('sent')
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'}`}
        >
          {status}
        </div>
      )}
    </div>
  );
}
