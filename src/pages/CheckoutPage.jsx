import { useState } from "react"
import { motion } from "framer-motion"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { api } from "../lib/api"
import { formatRupiah } from "../lib/format"
import { saveOrderToHistory } from "../lib/orderHistory"

const initialForm = { customer_name: "", email: "", phone: "", address: "" }

function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart()
    const location = useLocation()
    const navigate = useNavigate()

    // Kalau datang dari tombol "Beli Sekarang" di MenuPage, pakai 1 item itu aja
    // dan JANGAN sentuh keranjang user (gak clear, gak ke-mix). Kalau enggak, pakai isi keranjang.
    const buyNowItem = location.state?.buyNowItem
    const checkoutItems = buyNowItem ? [buyNowItem] : items
    const checkoutTotal = buyNowItem ? buyNowItem.price * buyNowItem.quantity : totalPrice

    const [form, setForm] = useState(initialForm)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (checkoutItems.length === 0) return

        setSubmitting(true)
        setError(null)

        try {
            // 1. Bikin order di backend
            const orderRes = await api.createOrder({
                ...form,
                items: checkoutItems.map((it) => ({ product_id: it.product_id, quantity: it.quantity })),
            })
            const order = orderRes.order

            // 2. Minta Snap token buat order ini
            const payRes = await api.payOrder(order.id)

            // 3. Gabungin snap_token ke object order, simpan ke history biar
            //    kebawa terus walau user reload/balik lagi ke halaman invoice
            const orderWithToken = { ...order, snap_token: payRes.snap_token }
            saveOrderToHistory(orderWithToken)

            // Cuma clear keranjang kalau order ini emang berasal dari keranjang,
            // bukan dari "Beli Sekarang" (biar keranjang yang lagi diisi user gak ke-reset)
            if (!buyNowItem) clearCart()

            // 4. Langsung ke halaman invoice — form pembayaran Midtrans
            //    bakal muncul NEMPEL di halaman itu (embed), bukan popup
            navigate(`/invoice/${order.order_number}`, { state: { order: orderWithToken } })
        } catch (err) {
            setError(err.message)
            setSubmitting(false)
        }
    }

    if (checkoutItems.length === 0) {
        return (
            <section className="min-h-screen px-6 md:px-8 py-16 md:py-24 bg-[#F5EFE3] text-center">
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#3a2c29] mb-3">
                    Keranjang Kosong
                </h1>
                <p className="text-sm md:text-base text-[#8a7a6d] mb-8">
                    Pilih menu dulu sebelum checkout.
                </p>
                <Link
                    to="/menu"
                    className="inline-block bg-[#3b322c] text-[#F5EFE3] px-6 py-3 font-semibold text-sm"
                >
                    Lihat Menu
                </Link>
            </section>
        )
    }

    return (
        <section className="min-h-screen px-6 md:px-8 py-12 md:py-20 bg-[#F5EFE3]">
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#3a2c29] mb-8 text-center">
                Checkout
            </h1>

            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <motion.form
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    onSubmit={handleSubmit}
                    className="border-2 border-[#1C1410] p-5 md:p-8"
                >
                    <h2 className="font-semibold text-base md:text-lg mb-6">Data Pemesan</h2>

                    <label className="block text-xs uppercase tracking-wide mb-2">Nama</label>
                    <input
                        name="customer_name"
                        value={form.customer_name}
                        onChange={handleChange}
                        required
                        placeholder="Nama kamu"
                        className="w-full border border-[#d4c9ae] px-3 py-2 mb-4 text-sm focus:border-[#3b322c] focus:outline-none"
                    />

                    <label className="block text-xs uppercase tracking-wide mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="email@kamu.com"
                        className="w-full border border-[#d4c9ae] px-3 py-2 mb-4 text-sm focus:border-[#3b322c] focus:outline-none"
                    />

                    <label className="block text-xs uppercase tracking-wide mb-2">No. HP</label>
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="08xxxxxxxxxx"
                        className="w-full border border-[#d4c9ae] px-3 py-2 mb-4 text-sm focus:border-[#3b322c] focus:outline-none"
                    />

                    <label className="block text-xs uppercase tracking-wide mb-2">Alamat</label>
                    <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        rows="3"
                        placeholder="Alamat pengantaran"
                        className="w-full border border-[#d4c9ae] px-3 py-2 mb-6 text-sm focus:border-[#3b322c] focus:outline-none"
                    />

                    {error && (
                        <p className="text-xs text-[#5a2a1e] bg-[#f8e4de] border border-[#1C1410] p-3 mb-4">
                            {error}
                        </p>
                    )}

                    <motion.button
                        type="submit"
                        disabled={submitting}
                        whileHover={{ scale: submitting ? 1 : 1.02 }}
                        whileTap={{ scale: submitting ? 1 : 0.98 }}
                        className="w-full bg-[#3b322c] text-[#F5EFE3] py-3 font-semibold text-sm disabled:opacity-60"
                    >
                        {submitting ? "Memproses..." : "Bayar Sekarang"}
                    </motion.button>
                </motion.form>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-2 border-[#1C1410] p-5 md:p-8 h-fit"
                >
                    <h2 className="font-semibold text-base md:text-lg mb-4">Ringkasan Pesanan</h2>
                    {buyNowItem && (
                        <p className="text-xs text-[#8a7a6d] mb-3">Beli langsung — bukan dari keranjang.</p>
                    )}
                    <div className="flex flex-col gap-3 mb-6">
                        {checkoutItems.map((item) => (
                            <div key={item.product_id} className="flex justify-between text-sm">
                                <span className="text-[#3a2c29]">
                                    {item.name} <span className="text-[#8a7a6d]">x{item.quantity}</span>
                                </span>
                                <span className="text-[#3a2c29]">{formatRupiah(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between border-t-2 border-[#1C1410] pt-4">
                        <span className="font-semibold text-sm md:text-base">Total</span>
                        <span className="font-heading font-bold text-base md:text-lg">
                            {formatRupiah(checkoutTotal)}
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default CheckoutPage