import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export function VerifyOtpPage() {

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const verify = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError(null);

    try {

      await api.post("/auth/verify-otp", {
        email,
        otp
      });

      alert("Email verified successfully");

      navigate("/login");

    } catch (err) {

      setError(err.response?.data?.message ?? "OTP verification failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Verify Email
        </h1>

        <p className="text-sm text-gray-600 mb-4">
          Enter the OTP sent to <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={verify} className="space-y-4">

          <div>

            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              OTP
            </label>

            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              placeholder="Enter 6 digit OTP"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
            />

          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

      </div>

    </div>
  );
}