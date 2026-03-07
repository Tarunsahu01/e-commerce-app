/**
 * AdminDashboard: Landing page for admin after login.
 * Sections: Manage Products, Add Product, Create Coupon.
 * No cart icon or user cart features (handled by AdminLayout).
 */
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-black mb-8">Admin Dashboard</h1>
      <div className="flex flex-wrap gap-4">
        <Link
          to="/admin-dashboard/products"
          className="px-5 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
        >
          Manage Products
        </Link>
        <Link
          to="/admin-dashboard/add-product"
          className="px-5 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
        >
          Add Product
        </Link>
        <Link
          to="/admin-dashboard/create-coupon"
          className="px-5 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
        >
          Create Coupon
        </Link>
      </div>
    </div>
  );
}
