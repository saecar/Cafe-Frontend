import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import ScrollTop from './components/ScrollTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { CartProvider } from './context/CartContext'
import Home from './pages/Home'
import Galery from './pages/Galery'
import Contact from './pages/Contact'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import InvoicePage from './pages/InvoicePage'
import MyOrdersPage from './pages/MyOrdersPage'
import About from './pages/About'
import AdminLayout from './admin/AdminLayout'
import AdminLoginPage from './admin/AdminLoginPage'
import AdminDashboardPage from './admin/AdminDashboardPage'
import AdminProductsPage from "./admin/AdminProductPage"
import AdminCategoriesPage from './admin/AdminCategoriesPage'
import AdminProfitRecapPage from './admin/AdminProfitRecapPage'

function PublicLayout({ children }) {
    const location = useLocation()
    const hideFooter = location.pathname === '/'

    return (
        <>
            <ScrollTop />
            <Navbar />
            {children}
            {!hideFooter && <Footer />}
        </>
    )
}

function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    {/* Admin — TANPA Navbar/Footer customer */}
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboardPage />} />
                        <Route path="products" element={<AdminProductsPage />} />
                        <Route path="categories" element={<AdminCategoriesPage />} />
                        <Route path="profit" element={<AdminProfitRecapPage />} />
                    </Route>

                    {/* Public — pakai Navbar/Footer (Footer disembunyikan khusus di Home) */}
                    <Route
                        path="/*"
                        element={
                            <PublicLayout>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/about" element={<About />} />
                                    <Route path="/galery" element={<Galery />} />
                                    <Route path="/contact" element={<Contact />} />
                                    <Route path="/menu" element={<MenuPage />} />
                                    <Route path="/cart" element={<CartPage />} />
                                    <Route path="/checkout" element={<CheckoutPage />} />
                                    <Route path="/invoice/:orderNumber" element={<InvoicePage />} />
                                    <Route path="/pesanan-saya" element={<MyOrdersPage />} />
                                </Routes>
                            </PublicLayout>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </CartProvider>
    )
}

export default App