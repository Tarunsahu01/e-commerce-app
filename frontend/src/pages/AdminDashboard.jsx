/**
 * AdminDashboard: Landing page for admin after login.
 * Sections: Manage Products, Add Product, Create Coupon, Edit Coupons.
 * No cart icon or user cart features (handled by AdminLayout).
 */
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="card-surface p-6">
        <h1 className="text-2xl font-bold text-black mb-8">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-4">
        <Link
          to="/admin-dashboard/products"
          className="btn-primary"
        >
          Manage Products
        </Link>
        <Link
          to="/admin-dashboard/add-product"
          className="btn-primary"
        >
          Add Product
        </Link>
        <Link
          to="/admin-dashboard/create-coupon"
          className="btn-primary"
        >
          Create Coupon
        </Link>
        <Link
          to="/admin-dashboard/edit-coupons"
          className="btn-primary"
        >
          Manage Coupons
        </Link>
        <Link
          to="/admin-dashboard/send-offer-email"
          className="btn-primary"
        >
          Send Offer Email
        </Link>
        </div>
      </div>
    </div>
  );
}
