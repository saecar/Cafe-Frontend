import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, useLocation, useParams } from "react-router-dom"
import { formatRupiah, formatDate } from "../lib/format"
import { getOrderFromHistory, updateOrderStatusInHistory } from "../lib/orderHistory"
import { useMidtransSnap } from "../hooks/useMidtransSnap"
import { api } from "../lib/api"

// Sama seperti getImageUrl di adminApi.js — didefinisikan lokal di sini
// supaya InvoicePage.jsx tidak bergantung pada path import ke file admin.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api").replace(/\/$/, "")
const SERVER_BASE_URL = API_BASE_URL.replace(/\/api$/, "")

function getImageUrl(path) {
    if (!path) return null
    if (path.startsWith("http://") || path.startsWith("https://")) return path
    return `${SERVER_BASE_URL}/storage/${path}`
}

const statusLabel = {
    pending: "Menunggu Pembayaran",
    processing: "Dibayar / Diproses",
    completed: "Selesai",
    cancelled: "Dibatalkan",
}

const statusStyle = {
    pending: "bg-[#f7e6cf] text-[#8a5a1f]",
    processing: "bg-[#fbe3d6] text-[#a34a1f]",
    completed: "bg-[#e1ecdf] text-[#3f6b45]",
    cancelled: "bg-[#f3ded9] text-[#8a4a3a]",
}

function InvoicePage() {
    const { orderNumber } = useParams()
    const location = useLocation()
    const { embed } = useMidtransSnap()

    // Order dikirim lewat state navigasi (baru saja checkout), fallback ke localStorage
    const order = location.state?.order ?? getOrderFromHistory(orderNumber)

    // Status yang dipakai buat nampilin UI — dimulai dari status order,
    // tapi bisa berubah sendiri lewat polling ke backend
    const [displayStatus, setDisplayStatus] = useState(order?.status)
    const showPaymentForm = displayStatus === "pending" && order?.snap_token

    // 1. Munculin form pembayaran Midtrans nempel di halaman
    useEffect(() => {
        if (showPaymentForm) {
            embed(order.snap_token, "snap-container", {
                onError: () => alert("Pembayaran gagal, coba lagi."),
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showPaymentForm])

    // 2. Polling status ke backend tiap 3 detik selama masih pending.
    //    Ini lebih diandalkan daripada callback onSuccess Snap, terutama
    //    buat QRIS/Virtual Account yang konfirmasinya bisa lama/kelewat.
    useEffect(() => {
        if (displayStatus !== "pending" || !order?.order_number) return

        const interval = setInterval(async () => {
            try {
                const res = await api.checkOrderStatus(order.order_number)
                if (res?.status && res.status !== "pending") {
                    setDisplayStatus(res.status)
                    updateOrderStatusInHistory(order.order_number, res.status)
                    clearInterval(interval)
                }
            } catch (err) {
                console.error("Gagal cek status order:", err)
            }
        }, 3000)

        return () => clearInterval(interval)
    }, [displayStatus, order?.order_number])

    if (!order) {
        return (
            <section className="min-h-screen px-4 sm:px-6 py-20 md:py-28 bg-[#fff8f0] text-center">
                <span className="inline-block text-xs font-semibold uppercase tracking-wide text-[#a34a1f] bg-[#fbe3d6] px-3 py-1 rounded-full mb-4">
                    404
                </span>
                <h1 className="text-2xl md:text-4xl font-semibold text-[#2c221e] mb-3">
                    Invoice Tidak Ditemukan
                </h1>
                <p className="text-sm text-[#6b5f58] mb-8 max-w-md mx-auto leading-relaxed">
                    Invoice ini cuma tersimpan di browser tempat kamu checkout. Coba buka lagi dari
                    perangkat itu, atau lihat riwayat pesananmu.
                </p>
                <Link
                    to="/pesanan-saya"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#2c221e] text-[#fff8f0] text-sm font-semibold rounded-2xl hover:bg-[#4a3a32] transition-colors"
                >
                    Pesanan Saya
                </Link>
            </section>
        )
    }

    const items = order.orderItems || order.order_items || []
    const subtotal = items.reduce((sum, item) => sum + Number(item.subtotal ?? item.price * item.quantity), 0)
    const hasAdjustment = Math.abs(subtotal - Number(order.total_amount)) > 0.5

    return (
        <section className="min-h-screen bg-[#fff8f0] px-4 sm:px-6 py-8 md:py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl mx-auto"
            >
                {/* Back link */}
                <Link
                    to="/pesanan-saya"
                    className="inline-flex items-center gap-1.5 text-sm text-[#6b5f58] hover:text-[#2c221e] transition-colors mb-4 print:hidden"
                >
                    <span aria-hidden="true">←</span> Pesanan Saya
                </Link>

                <div className="bg-[#f9f3eb] rounded-2xl border border-[#e6ded5] shadow-sm overflow-hidden print:border-0 print:shadow-none">

                    {/* Status header */}
                    <div className="bg-[#2c221e] text-[#f6f0e8] p-5 sm:p-6 flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-3">
                            <span
                                className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                                    statusStyle[displayStatus] ?? "bg-[#4a3a32] text-[#f6f0e8]"
                                }`}
                            >
                                {displayStatus === "pending" && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                )}
                                {statusLabel[displayStatus] ?? displayStatus}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[#c9beb5]">No. Pesanan</p>
                            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">{order.order_number}</h1>
                        </div>
                        {order.created_at && (
                            <p className="text-xs text-[#c9beb5]">{formatDate(order.created_at)}</p>
                        )}
                    </div>

                    <div className="p-5 sm:p-8 space-y-5">

                        {/* Customer detail */}
                        <div className="bg-white rounded-xl border border-[#e6ded5] p-4">
                            <h2 className="text-xs font-semibold uppercase tracking-wide text-[#8c7a6b] mb-2">
                                Detail Pemesan
                            </h2>
                            <p className="text-sm font-semibold text-[#2c221e]">{order.customer_name}</p>
                            <p className="text-xs text-[#6b5f58] mt-0.5">
                                {order.email} · {order.phone}
                            </p>
                            {order.address && (
                                <p className="text-xs text-[#6b5f58] mt-0.5">{order.address}</p>
                            )}
                        </div>

                        {/* Items */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between px-0.5">
                                <h2 className="text-xs font-semibold uppercase tracking-wide text-[#8c7a6b]">Item</h2>
                                <span className="text-xs text-[#8c7a6b]">{items.length} Menu</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {items.map((item) => {
                                    const name = item.product?.name ?? item.name
                                    const image = item.product?.image ? getImageUrl(item.product.image) : null
                                    return (
                                        <div
                                            key={item.id ?? item.product_id}
                                            className="flex items-center gap-3 bg-white rounded-xl border border-[#e6ded5] p-3"
                                        >
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={name}
                                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-[#f3ede5]"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-[#f3ede5] flex-shrink-0" />
                                            )}
                                            <div className="flex-1 min-w-0 flex items-baseline justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-[#2c221e] truncate">{name}</p>
                                                    <p className="text-xs text-[#8c7a6b]">Qty: {item.quantity}x</p>
                                                </div>
                                                <span className="text-sm font-semibold text-[#2c221e] whitespace-nowrap">
                                                    {formatRupiah(item.subtotal ?? item.price * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="bg-white rounded-xl border border-[#e6ded5] p-4 space-y-2">
                            <div className="flex items-center justify-between text-sm text-[#6b5f58]">
                                <span>Subtotal</span>
                                <span>{formatRupiah(subtotal)}</span>
                            </div>
                            {hasAdjustment && (
                                <div className="flex items-center justify-between text-sm text-[#6b5f58]">
                                    <span>Biaya &amp; Penyesuaian Lain</span>
                                    <span>{formatRupiah(Number(order.total_amount) - subtotal)}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between pt-2 border-t border-[#e6ded5]">
                                <span className="text-sm font-semibold text-[#2c221e]">Total Pembayaran</span>
                                <span className="text-lg font-semibold text-[#a34a1f]">{formatRupiah(order.total_amount)}</span>
                            </div>
                        </div>

                        {/* Payment */}
                        {showPaymentForm && (
                            <div className="bg-white rounded-xl border border-dashed border-[#d2c4bf] p-4 print:hidden">
                                <h2 className="text-xs font-semibold uppercase tracking-wide text-[#8c7a6b] mb-3">
                                    Selesaikan Pembayaran
                                </h2>
                                <div id="snap-container"></div>
                                <p className="text-xs text-[#8c7a6b] mt-3 text-center">
                                    Mengecek status pembayaran otomatis...
                                </p>
                            </div>
                        )}

                        {!showPaymentForm && displayStatus !== "pending" && displayStatus !== "cancelled" && (
                            <div className="bg-[#eef3ec] rounded-xl p-5 text-center print:hidden">
                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#3f6b45] text-white text-base mb-2">
                                    ✓
                                </div>
                                <p className="text-sm font-semibold text-[#2c221e] mb-1">Pembayaran Berhasil</p>
                                <p className="text-xs text-[#6b5f58]">Pesananmu sedang kami siapkan.</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-2.5 print:hidden pt-1">
                            <button
                                onClick={() => window.print()}
                                className="flex-1 border border-[#d2c4bf] text-[#2c221e] py-3 rounded-2xl text-sm font-semibold hover:bg-[#f3ede5] transition-colors"
                            >
                                Cetak Invoice
                            </button>
                            <Link
                                to="/menu"
                                className="flex-1 text-center bg-[#c86d44] text-white py-3 rounded-2xl text-sm font-semibold hover:bg-[#b25f39] transition-colors"
                            >
                                Pesan Lagi
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

export default InvoicePage