import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { SearchProvider } from './context/SearchContext';
import { UserOnlyRoute } from './components/UserOnlyRoute'; 
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminRoute } from './components/AdminRoute';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { PaymentPage } from './pages/PaymentPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { EditProductPage } from './pages/EditProductPage';
import { AddProductPage } from './pages/AddProductPage';
import { CreateCouponPage } from './pages/CreateCouponPage';
import { AdminEditCouponsPage } from './pages/AdminEditCouponsPage';
import { VerifyOtpPage } from './pages/VerifyOtpPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { ContactPage } from './pages/ContactPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import { AdminSendOfferEmailPage } from './pages/AdminSendOfferEmailPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
          <CartProvider>
            <ToastProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/contact" element={<ContactPage />} />

                  <Route path="/cart" element={<UserOnlyRoute><CartPage /></UserOnlyRoute>} />
                  <Route path="/payment" element={<UserOnlyRoute><PaymentPage /></UserOnlyRoute>} />
                  <Route path="/orders" element={<UserOnlyRoute><OrderHistoryPage /></UserOnlyRoute>} />
                  <Route path="/payment-success" element={<UserOnlyRoute><PaymentSuccess /></UserOnlyRoute>} />
                  <Route path="/payment-cancel" element={<UserOnlyRoute><PaymentCancel /></UserOnlyRoute>} />

                </Route>

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-otp" element={<VerifyOtpPage />} />

                <Route
                  path="/admin-dashboard"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="edit-product/:id" element={<EditProductPage />} />
                  <Route path="add-product" element={<AddProductPage />} />
                  <Route path="create-coupon" element={<CreateCouponPage />} />
                  <Route path="edit-coupons" element={<AdminEditCouponsPage />} />
                  <Route path="send-offer-email" element={<AdminSendOfferEmailPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ToastProvider>
          </CartProvider>
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;