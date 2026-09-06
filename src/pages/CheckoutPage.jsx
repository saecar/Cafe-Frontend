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

    // Kalau datang dari tombol "Beli Sekarang" di MenuPage/Home, pakai 1 item itu aja
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
            <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-20 md:py-28 bg-[#faf8f5] text-center border-b-4 border-[#16120e]">
                <span className="font-mono text-xs font-black uppercase tracking-widest text-[#ff6239] bg-[#16120e] px-2.5 py-1 inline-block shadow-[3px_3px_0px_#16120e] mb-4">
                    Checkout
                </span>
                <h1 className="font-display text-3xl md:text-5xl font-black uppercase text-[#16120e] mb-3">
                    Keranjang Kosong
                </h1>
                <p className="font-mono text-sm text-stone-600 mb-8">
                    Pilih menu dulu sebelum checkout.
                </p>
                <Link
                    to="/menu"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#16120e] text-[#faf8f5] font-mono text-xs font-black uppercase border-2 border-[#16120e] shadow-[4px_4px_0px_#16120e] hover:bg-[#ff6239] hover:text-[#16120e] transition-all"
                >
                    Lihat Menu
                </Link>
            </section>
        )
    }

    return (
        <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 md:py-20 bg-[#faf8f5] border-b-4 border-[#16120e]">
            <div className="max-w-5xl mx-auto">
                <div className="border-b-4 border-[#16120e] pb-6 mb-10 text-center">
                    <span className="font-mono text-xs font-black uppercase tracking-widest text-[#ff6239] bg-[#16120e] px-2.5 py-1 inline-block shadow-[3px_3px_0px_#16120e] mb-3">
                        Satu Langkah Lagi
                    </span>
                    <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#16120e]">
                        Checkout
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
                    <motion.form
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        onSubmit={handleSubmit}
                        className="border-4 border-[#16120e] bg-[#faf8f5] p-5 md:p-8 shadow-[8px_8px_0px_#16120e]"
                    >
                        <h2 className="font-display text-xl md:text-2xl font-bold text-[#16120e] mb-6">
                            Data Pemesan
                        </h2>

                        <label className="block font-mono text-[11px] font-bold uppercase tracking-wide mb-2 text-stone-600">
                            Nama
                        </label>
                        <input
                            name="customer_name"
                            value={form.customer_name}
                            onChange={handleChange}
                            required
                            placeholder="Nama kamu"
                            className="w-full border-2 border-[#16120e] bg-[#faf8f5] px-3 py-2.5 mb-4 text-sm font-sans focus:outline-none focus:bg-white"
                        />

                        <label className="block font-mono text-[11px] font-bold uppercase tracking-wide mb-2 text-stone-600">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="email@kamu.com"
                            className="w-full border-2 border-[#16120e] bg-[#faf8f5] px-3 py-2.5 mb-4 text-sm font-sans focus:outline-none focus:bg-white"
                        />

                        <label className="block font-mono text-[11px] font-bold uppercase tracking-wide mb-2 text-stone-600">
                            No. HP
                        </label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            placeholder="08xxxxxxxxxx"
                            className="w-full border-2 border-[#16120e] bg-[#faf8f5] px-3 py-2.5 mb-4 text-sm font-sans focus:outline-none focus:bg-white"
                        />

                        <label className="block font-mono text-[11px] font-bold uppercase tracking-wide mb-2 text-stone-600">
                            Alamat
                        </label>
                        <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            required
                            rows="3"
                            placeholder="Alamat pengantaran"
                            className="w-full border-2 border-[#16120e] bg-[#faf8f5] px-3 py-2.5 mb-6 text-sm font-sans focus:outline-none focus:bg-white"
                        />

                        {error && (
                            <p className="font-mono text-xs text-[#5a2a1e] bg-[#ffdad6] border-2 border-[#16120e] p-3 mb-4">
                                {error}
                            </p>
                        )}

                        <motion.button
                            type="submit"
                            disabled={submitting}
                            whileHover={{ scale: submitting ? 1 : 1.01 }}
                            whileTap={{ scale: submitting ? 1 : 0.98 }}
                            className="w-full py-3.5 bg-[#16120e] text-[#faf8f5] font-mono text-xs font-black uppercase border-2 border-[#16120e] shadow-[4px_4px_0px_#16120e] hover:bg-[#ff6239] hover:text-[#16120e] transition-all disabled:opacity-60 disabled:hover:bg-[#16120e] disabled:hover:text-[#faf8f5]"
                        >
                            {submitting ? "Memproses..." : "Bayar Sekarang"}
                        </motion.button>
                    </motion.form>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="border-4 border-[#16120e] bg-[#16120e] text-[#faf8f5] p-5 md:p-8 shadow-[8px_8px_0px_#ff6239] h-fit"
                    >
                        <h2 className="font-display text-xl md:text-2xl font-bold mb-1">Ringkasan Pesanan</h2>
                        {buyNowItem && (
                            <p className="font-mono text-[11px] text-[#feb47b] mb-4 uppercase">
                                Beli langsung — bukan dari keranjang
                            </p>
                        )}
                        <div className={`flex flex-col gap-3 mb-6 ${buyNowItem ? "" : "mt-4"}`}>
                            {checkoutItems.map((item) => (
                                <div
                                    key={item.product_id}
                                    className="flex justify-between text-sm font-mono border-b border-stone-700 pb-2"
                                >
                                    <span className="text-stone-200">
                                        {item.name} <span className="text-stone-500">x{item.quantity}</span>
                                    </span>
                                    <span className="text-stone-200 whitespace-nowrap">
                                        {formatRupiah(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center border-t-2 border-[#ff6239] pt-4">
                            <span className="font-mono text-xs font-bold uppercase text-[#feb47b]">Total</span>
                            <span className="font-display font-black text-xl md:text-2xl">
                                {formatRupiah(checkoutTotal)}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default CheckoutPage