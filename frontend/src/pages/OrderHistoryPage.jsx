import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export function OrderHistoryPage() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const resolveProductImage = (raw) => {
		if (!raw || typeof raw !== 'string') return null;
		const trimmed = raw.trim();
		if (!trimmed) return null;
		if (trimmed.startsWith('http')) return trimmed;
		// Backend may return `/uploads/...` or `uploads/...`
		const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
		return `http://localhost:8080${path}`;
	};

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			navigate('/login');
			return;
		}
		let mounted = true;
		const fetchOrders = async () => {
			setLoading(true);
			setError('');
			try {
				const { data } = await api.get('orders/my');
				if (!mounted) return;
				setOrders(Array.isArray(data) ? data : []);
			} catch (e) {
				if (!mounted) return;
				setError('Failed to load orders.');
				setOrders([]);
			} finally {
				if (mounted) setLoading(false);
			}
		};
		fetchOrders();
		return () => {
			mounted = false;
		};
	}, []);

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<h1 className="text-3xl font-bold text-black mb-1">My Orders</h1>
			<p className="text-sm text-gray-600 mb-6 leading-relaxed">
				Track your purchases and view order totals.
			</p>

			{loading && <p className="text-gray-700">Loading...</p>}
			{!loading && error && <p className="text-red-600">{error}</p>}

			{!loading && !error && orders.length === 0 && (
				<div className="card-surface p-6">
					<p className="text-gray-700 leading-relaxed">No orders found.</p>
				</div>
			)}

			<div className="space-y-4">
				{orders.map((order) => {
					const createdAt = order?.createdAt ? new Date(order.createdAt).toLocaleString() : '—';
					const items = Array.isArray(order?.orderItems) ? order.orderItems : [];
					const status = order?.status ?? order?.paymentStatus ?? null;
					return (
						<div key={order?.id ?? Math.random()} className="card-surface p-6">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
								<div>
									<p className="text-xs text-gray-600">Order date</p>
									<p className="text-base font-semibold text-black">{createdAt}</p>
								</div>
								<div className="text-right">
									<p className="text-xs text-gray-600">Total</p>
									<p className="text-base font-semibold text-black">₹{order?.totalAmount ?? 0}</p>
									{status && (
										<span
											className={[
												'inline-flex items-center mt-2 rounded-full px-3 py-1 text-xs font-semibold',
												status === 'SUCCESS' || status === 'PAID'
													? 'bg-emerald-50 text-emerald-800'
													: status === 'FAILED' || status === 'CANCELLED'
														? 'bg-red-50 text-red-700'
														: 'bg-amber-50 text-amber-800'
											].join(' ')}
										>
											{status}
										</span>
									)}
								</div>
							</div>

							<div className="mt-4">
								<p className="text-base font-semibold text-black mb-2">Products</p>
								{items.length === 0 ? (
									<p className="text-sm text-gray-700">No products.</p>
								) : (
									<ul className="space-y-2">
										{items.map((it) => (
											<li
												key={it?.id ?? Math.random()}
												className="flex items-start justify-between gap-3 p-3 rounded-2xl border border-[#E5E5E5] bg-[#faf0e6]"
											>
												<div className="flex items-start gap-3 min-w-0">
													<div className="w-12 h-12 flex-shrink-0 rounded-2xl overflow-hidden border border-[#E5E5E5] bg-white">
														{resolveProductImage(it?.product?.imageUrl ?? it?.product?.image) ? (
															<img
																src={resolveProductImage(it?.product?.imageUrl ?? it?.product?.image)}
																alt={it?.product?.name ?? 'Product'}
																className="w-full h-full object-cover"
																onError={(e) => {
																	e.currentTarget.style.display = 'none';
																}}
															/>
														) : (
															<div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
																No img
															</div>
														)}
													</div>
													<div className="min-w-0">
														<p className="text-base font-semibold text-black truncate">
															{it?.product?.name ?? 'Product'}
														</p>
														<p className="text-sm text-gray-600 leading-relaxed">
															Qty: {it?.quantity ?? 0} • Price: ₹{it?.priceAtTime ?? 0}
														</p>
													</div>
												</div>
												<div className="text-base text-black font-semibold">
													₹{(it?.priceAtTime ?? 0) * (it?.quantity ?? 0)}
												</div>
											</li>
										))}
									</ul>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

