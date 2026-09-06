import { useState } from "react"
import { motion } from "framer-motion"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { api } from "../lib/api"
import { formatRupiah } from "../lib/format"
import { saveOrderToHistory } from "../lib/orderHistory"

const initialForm = { customer_name: "", email: "", phone: "", address: "" }
const SPRING_GENTLE = { type: "spring", stiffness: 260, damping: 24 }

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
            <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-20 md:py-28 bg-[#FDFBF7] text-center">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F9F3EB] border border-[#E6DDD2] text-[#C86D44] font-mono text-[11px] font-bold tracking-wider uppercase mb-4">
                    Checkout
                </span>
                <h1 className="text-2xl md:text-4xl font-extrabold text-[#17120F] mb-3">Keranjang Kosong</h1>
                <p className="text-sm text-[#342822]/80 mb-8">Pilih menu dulu sebelum checkout.</p>
                <Link
                    to="/menu"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#17120F] hover:bg-[#231B17] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                    Lihat Menu
                </Link>
            </section>
        )
    }

    return (
        <section className="min-h-screen bg-[#FDFBF7] text-[#231B17]">
            {/* Header */}
            <div className="bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E6DDD2] sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        aria-label="Kembali"
                        className="w-10 h-10 rounded-full border border-[#E6DDD2] bg-white flex items-center justify-center text-[#342822] hover:bg-[#F9F3EB] transition-colors shrink-0"
                    >
                        <BackIcon />
                    </button>
                    <div className="min-w-0">
                        <h1 className="text-base sm:text-lg font-extrabold text-[#17120F] tracking-tight truncate">
                            Konfirmasi &amp; Pembayaran
                        </h1>
                        <span className="text-[11px] font-mono text-[#C86D44] uppercase tracking-widest">
                            Satu langkah lagi
                        </span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-32 lg:pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
                    {/* Data pemesan */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={SPRING_GENTLE}
                        className="bg-white rounded-2xl border border-[#E6DDD2] p-5 md:p-7 shadow-[0_10px_30px_-8px_rgba(35,27,23,0.08)]"
                    >
                        <h2 className="text-lg font-bold text-[#17120F] mb-5">Data Pemesan</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-[#342822]/70">
                                    Nama
                                </label>
                                <input
                                    name="customer_name"
                                    value={form.customer_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Nama kamu"
                                    className="w-full rounded-xl border border-[#E6DDD2] bg-[#FDFBF7] px-4 py-3 text-sm focus:outline-none focus:border-[#C86D44] focus:ring-2 focus:ring-[#C86D44]/15 transition-shadow"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-[#342822]/70">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="email@kamu.com"
                                    className="w-full rounded-xl border border-[#E6DDD2] bg-[#FDFBF7] px-4 py-3 text-sm focus:outline-none focus:border-[#C86D44] focus:ring-2 focus:ring-[#C86D44]/15 transition-shadow"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-[#342822]/70">
                                    No. HP
                                </label>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="08xxxxxxxxxx"
                                    className="w-full rounded-xl border border-[#E6DDD2] bg-[#FDFBF7] px-4 py-3 text-sm focus:outline-none focus:border-[#C86D44] focus:ring-2 focus:ring-[#C86D44]/15 transition-shadow"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-[#342822]/70">
                                    Alamat
                                </label>
                                <textarea
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    placeholder="Alamat pengantaran"
                                    className="w-full rounded-xl border border-[#E6DDD2] bg-[#FDFBF7] px-4 py-3 text-sm focus:outline-none focus:border-[#C86D44] focus:ring-2 focus:ring-[#C86D44]/15 transition-shadow resize-none"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="mt-4 text-xs text-[#934825] bg-[#F8ECE6] border border-[#E6DDD2] rounded-xl p-3">
                                {error}
                            </p>
                        )}

                        {/* Tombol submit — cuma keliatan di layar besar, di mobile dipindah ke sticky bar bawah */}
                        <motion.button
                            type="submit"
                            disabled={submitting}
                            whileHover={{ scale: submitting ? 1 : 1.01 }}
                            whileTap={{ scale: submitting ? 1 : 0.98 }}
                            transition={SPRING_GENTLE}
                            className="hidden lg:flex w-full mt-6 py-3.5 rounded-xl bg-[#C86D44] hover:bg-[#B55E36] text-white text-sm font-bold uppercase tracking-wider items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-60"
                        >
                            {submitting ? "Memproses..." : "Bayar Sekarang"}
                        </motion.button>
                    </motion.div>

                    {/* Ringkasan pesanan */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...SPRING_GENTLE, delay: 0.08 }}
                        className="bg-[#17120F] text-white rounded-2xl p-5 md:p-7 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.25)]"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="text-lg font-bold">Ringkasan Pesanan</h2>
                            <span className="text-[11px] font-mono text-[#E4D5C1]/70">
                                {checkoutItems.length} item
                            </span>
                        </div>
                        {buyNowItem && (
                            <p className="text-[11px] font-mono text-[#C86D44] uppercase mb-4">
                                Beli langsung — bukan dari keranjang
                            </p>
                        )}

                        <div className={`flex flex-col gap-3 mb-5 ${buyNowItem ? "" : "mt-4"}`}>
                            {checkoutItems.map((item) => (
                                <div
                                    key={item.product_id}
                                    className="flex justify-between text-sm gap-3 pb-3 border-b border-white/10"
                                >
                                    <span className="text-[#F1E7DA] min-w-0 truncate">
                                        {item.name} <span className="text-[#E4D5C1]/60">×{item.quantity}</span>
                                    </span>
                                    <span className="text-[#F1E7DA] whitespace-nowrap">
                                        {formatRupiah(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-1">
                            <span className="text-xs font-bold uppercase text-[#E4D5C1]/70">Total</span>
                            <span className="font-extrabold text-xl md:text-2xl text-white">
                                {formatRupiah(checkoutTotal)}
                            </span>
                        </div>

                        <p className="mt-5 pt-4 border-t border-white/10 text-[11px] text-[#E4D5C1]/60 leading-relaxed">
                            Pembayaran diproses secara aman melalui Midtrans di halaman berikutnya — pilih QRIS,
                            transfer VA, atau kartu langsung di sana.
                        </p>
                    </motion.div>
                </div>

                {/* Sticky bottom bar — mobile & tablet portrait */}
                <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#E6DDD2] px-4 py-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] shadow-[0_-8px_24px_-8px_rgba(35,27,23,0.10)]">
                    <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#342822]/60">
                                Total Tagihan
                            </span>
                            <span className="block text-lg font-extrabold text-[#17120F] truncate">
                                {formatRupiah(checkoutTotal)}
                            </span>
                        </div>
                        <motion.button
                            type="submit"
                            disabled={submitting}
                            whileTap={{ scale: submitting ? 1 : 0.97 }}
                            transition={SPRING_GENTLE}
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C86D44] hover:bg-[#B55E36] text-white text-sm font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-60 shrink-0"
                        >
                            {submitting ? "Memproses..." : "Bayar Sekarang"}
                        </motion.button>
                    </div>
                </div>
            </form>
        </section>
    )
}

function BackIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0l7 7m-7-7l7-7" />
        </svg>
    )
}

export default CheckoutPage