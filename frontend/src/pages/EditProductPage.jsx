/**
 * EditProductPage: Admin form to edit a product.
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

export function EditProductPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { showToast } = useToast();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);
	const [categories, setCategories] = useState([]);
	const [image, setImage] = useState(null);
	const [preview, setPreview] = useState(null); 
	const [existingImageUrl, setExistingImageUrl] = useState(null);
	const [form, setForm] = useState({
		name: '',
		price: '',
		categoryId: '',
		description: '',
		quantityAvailable: 100,
	});

	// Handle New Image Preview Cleanup
	useEffect(() => {
		if (!image) {
			setPreview(null);
			return;
		}
		const objectUrl = URL.createObjectURL(image);
		setPreview(objectUrl);
		return () => URL.revokeObjectURL(objectUrl);
	}, [image]);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setError(null);
		Promise.all([
			api.get('/products/' + id),
			api.get('/categories'),
		])
			.then(([productRes, categoriesRes]) => {
				if (cancelled) return;
				const product = productRes.data;
				setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
				setExistingImageUrl(product.imageUrl ?? null);
				setForm({
					name: product.name ?? '',
					price: product.price ?? '',
					categoryId: product.categoryId ?? product.category?.id ?? '',
					description: product.description ?? '',
					quantityAvailable: product.quantityAvailable ?? 100,
				});
			})
			.catch((err) => {
				if (!cancelled)
					setError(err.response?.data?.message ?? err.message ?? 'Failed to load product');
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => { cancelled = true; };
	}, [id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]:
				name === 'categoryId' || name === 'quantityAvailable'
					? value === '' ? '' : Number(value)
					: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setSaving(true);
		try {
			const formData = new FormData();
			formData.append('name', form.name);
			formData.append('description', form.description || '');
			formData.append('price', Number(form.price));
			formData.append('quantityAvailable', Number(form.quantityAvailable) || 1);
			formData.append('categoryId', Number(form.categoryId));

			// If a new image is selected, it will replace the old one in Cloudinary via the backend
			if (image) {
				formData.append('image', image);
			}

			await api.put('/products/' + id, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			showToast('Product updated successfully', 'success');
			navigate('/admin-dashboard/products');
		} catch (err) {
			setError(err.response?.data?.message ?? err.message ?? 'Failed to save');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!window.confirm("Are you sure you want to delete this product? This will also remove the image from the cloud.")) return;

		try {
			await api.delete('/products/' + id);
			showToast('Product and image deleted successfully', 'success');
			navigate('/admin-dashboard/products');
		} catch (err) {
			showToast('Failed to delete product', 'error');
		}
	};

	if (loading) {
		return (
			<div className="max-w-2xl mx-auto p-8">
				<p className="text-gray-600">Loading...</p>
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto p-8 card-surface">
			<h1 className="text-2xl font-bold text-black mb-6">Edit Product</h1>
			<form onSubmit={handleSubmit} className="space-y-4">

				<div>
					<label className="block text-sm font-medium text-gray-700">Product Name</label>
					<input
						name="name"
						type="text"
						value={form.name}
						onChange={handleChange}
						required
						className="mt-1 block w-full field-premium"
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">Price</label>
						<input
							name="price"
							type="number"
							min="0"
							step="0.01"
							value={form.price}
							onChange={handleChange}
							required
							className="mt-1 block w-full field-premium"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Quantity</label>
						<input
							name="quantityAvailable"
							type="number"
							min="1"
							value={form.quantityAvailable}
							onChange={handleChange}
							className="mt-1 block w-full field-premium"
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">Category</label>
					<select
						name="categoryId"
						value={form.categoryId}
						onChange={handleChange}
						required
						className="mt-1 block w-full field-premium"
					>
						<option value="">Select category</option>
						{categories.map((c) => (
							<option key={c.id} value={c.id}>{c.name}</option>
						))}
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">Description</label>
					<textarea
						name="description"
						value={form.description}
						onChange={handleChange}
						rows={3}
						className="mt-1 block w-full field-premium"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>

					<div className="flex items-start gap-4 mb-4">
						{/* Display current Cloudinary image */}
						{existingImageUrl && !preview && (
							<div className="text-center">
								<p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Current</p>
								<img
									src={existingImageUrl}
									alt="current"
									className="w-24 h-24 object-cover rounded-2xl border border-[#E5E5E5]"
								/>
							</div>
						)}

						{/* Display new selection preview */}
						{preview && (
							<div className="text-center">
								<p className="text-[10px] text-blue-500 uppercase font-bold mb-1">New Selection</p>
								<img
									src={preview}
									alt="preview"
									className="w-24 h-24 object-cover rounded-2xl border-2 border-blue-100"
								/>
							</div>
						)}
					</div>

					<input
						type="file"
						accept="image/*"
						onChange={(e) => setImage(e.target.files[0])}
						className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#faf0e6] file:text-[#7A5C2E] hover:file:bg-[#faf0e6]"
					/>
				</div>

				{error && <p className="text-sm text-red-600">{error}</p>}

				<div className="mt-8 flex items-center justify-between gap-4 border-t border-gray-100 pt-6">
					<button
						type="button"
						onClick={handleDelete}
						className="px-6 py-2 text-sm font-semibold rounded-xl border border-red-100 bg-white text-red-600 hover:bg-red-50 hover:border-red-200 transition-all"
					>
						Delete Product
					</button>
					<button
						type="submit"
						disabled={saving}
						className="flex-1 py-2 px-4 btn-primary disabled:opacity-70 disabled:pointer-events-none"
					>
						{saving ? 'Updating…' : 'Save Changes'}
					</button>
				</div>
			</form>
		</div>
	);
}