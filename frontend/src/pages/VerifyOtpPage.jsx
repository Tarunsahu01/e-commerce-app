import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export function VerifyOtpPage() {
	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const location = useLocation();
	const navigate = useNavigate();

	const email = location.state?.email;

	useEffect(() => {
		if (!email) {
			navigate("/register", { replace: true });
		}
	}, [email, navigate]);

	if (!email) {
		return null;
	}

	const verify = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			await api.post("/auth/verify-otp", {
				email,
				otp
			});

			alert("Email verified successfully! You can now log in.");
			navigate("/login");
		} catch (err) {
			setError(err.response?.data?.message ?? "OTP verification failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-[60vh] flex items-center justify-center px-4 bg-gray-50">
			<div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
				<h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
					Verify Your Email
				</h1>

				<p className="text-sm text-gray-600 mb-8 text-center">
					We have sent a 6-digit code to <br />
					<span className="font-semibold text-black">{email}</span>
				</p>

				<form onSubmit={verify} className="space-y-6">
					<div>
						<label
							htmlFor="otp"
							className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1"
						>
							Verification Code
						</label>
						<input
							id="otp"
							type="text"
							value={otp}
							onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Only allow numbers
							required
							maxLength={6}
							placeholder="000000"
							className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] shadow-sm focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all"
						/>
					</div>

					{error && (
						<div className="p-3 bg-red-50 rounded-lg">
							<p className="text-xs text-red-600 text-center font-medium">{error}</p>
						</div>
					)}

					<button
						type="submit"
						disabled={loading || otp.length < 6}
						className="w-full py-3 px-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
					>
						{loading ? "Checking Code..." : "Verify & Continue"}
					</button>
				</form>

				<div className="mt-8 text-center">
					<button
						onClick={() => navigate("/register")}
						className="text-sm text-gray-500 hover:text-black transition-colors"
					>
						Entered the wrong email? <span className="underline">Change it</span>
					</button>
				</div>
			</div>
		</div>
	);
}