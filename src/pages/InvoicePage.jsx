import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, useLocation, useParams } from "react-router-dom"
import { formatRupiah, formatDate } from "../lib/format"
import { getOrderFromHistory, updateOrderStatusInHistory } from "../lib/orderHistory"
import { useMidtransSnap } from "../hooks/useMidtransSnap"
import { api } from "../lib/api"

const statusLabel = {
    pending: "Menunggu pembayaran",
    processing: "Dibayar / diproses",
    completed: "Selesai",
    cancelled: "Dibatalkan",
}

const statusAccent = {
    pending: "text-[#ffd56b]",
    processing: "text-[#feb47b]",
    completed: "text-emerald-500",
    cancelled: "text-[#ff6239]",
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
            <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-20 md:py-28 bg-[#faf8f5] text-center border-b-4 border-[#16120e]">
                <span className="font-mono text-xs font-black uppercase tracking-widest text-[#ff6239] bg-[#16120e] px-2.5 py-1 inline-block shadow-[3px_3px_0px_#16120e] mb-4">
                    404
                </span>
                <h1 className="font-display text-3xl md:text-5xl font-black uppercase text-[#16120e] mb-3">
                    Invoice Tidak Ditemukan
                </h1>
                <p className="font-mono text-sm text-stone-600 mb-8 max-w-md mx-auto leading-relaxed">
                    Invoice ini cuma tersimpan di browser tempat kamu checkout. Coba buka lagi dari
                    perangkat itu, atau lihat riwayat pesananmu.
                </p>
                <Link
                    to="/pesanan-saya"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#16120e] text-[#faf8f5] font-mono text-xs font-black uppercase border-2 border-[#16120e] shadow-[4px_4px_0px_#16120e] hover:bg-[#ff6239] hover:text-[#16120e] transition-all"
                >
                    Pesanan Saya
                </Link>
            </section>
        )
    }

    return (
        <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 md:py-20 bg-[#faf8f5] border-b-4 border-[#16120e]">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl mx-auto border-4 border-[#16120e] bg-[#faf8f5] shadow-[10px_10px_0px_#16120e] print:border-0 print:shadow-none overflow-hidden"
            >
                <div className="h-3 w-full bg-gradient-to-r from-[#ff6239] via-[#feb47b] to-[#ffd56b] border-b-2 border-[#16120e] print:hidden" />

                <div className="p-6 md:p-10">
                    <div className="text-center mb-8">
                        <span className="font-mono text-xs font-black uppercase tracking-widest text-[#ff6239] bg-[#16120e] px-2.5 py-1 inline-block shadow-[3px_3px_0px_#16120e] mb-4 print:hidden">
                            Invoice
                        </span>
                        <h1 className="font-display text-3xl md:text-4xl font-black uppercase text-[#16120e] mb-1">
                            Terima Kasih!
                        </h1>
                        <p className="font-mono text-xs text-stone-600">Pesananmu sudah kami terima.</p>
                    </div>

                    <div className="font-mono text-sm space-y-2 mb-6">
                        <div className="flex justify-between border-b border-stone-300 pb-2">
                            <span className="text-stone-500 uppercase text-xs">No. Pesanan</span>
                            <span className="font-bold text-[#16120e]">{order.order_number}</span>
                        </div>
                        {order.created_at && (
                            <div className="flex justify-between border-b border-stone-300 pb-2">
                                <span className="text-stone-500 uppercase text-xs">Tanggal</span>
                                <span className="text-[#16120e]">{formatDate(order.created_at)}</span>
                            </div>
                        )}
                        <div className="flex justify-between border-b-2 border-[#16120e] pb-2">
                            <span className="text-stone-500 uppercase text-xs">Status</span>
                            <span
                                className={`font-bold uppercase text-xs flex items-center gap-2 ${
                                    statusAccent[displayStatus] ?? "text-[#16120e]"
                                }`}
                            >
                                {statusLabel[displayStatus] ?? displayStatus}
                                {displayStatus === "pending" && (
                                    <span className="inline-block w-2 h-2 rounded-full bg-[#ffd56b] animate-pulse" />
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="border-2 border-[#16120e] p-4 mb-4 bg-white/40">
                        <h2 className="font-mono text-[11px] font-black uppercase tracking-widest text-stone-500 mb-2">
                            Detail Pemesan
                        </h2>
                        <p className="text-sm font-semibold text-[#16120e]">{order.customer_name}</p>
                        <p className="text-xs text-stone-600 font-mono">
                            {order.email} · {order.phone}
                        </p>
                        <p className="text-xs text-stone-600 font-mono">{order.address}</p>
                    </div>

                    <div className="border-2 border-[#16120e] p-4 mb-4">
                        <h2 className="font-mono text-[11px] font-black uppercase tracking-widest text-stone-500 mb-3">
                            Item
                        </h2>
                        <div className="flex flex-col gap-2">
                            {(order.orderItems || order.order_items || []).map((item) => (
                                <div
                                    key={item.id ?? item.product_id}
                                    className="flex justify-between text-sm font-mono"
                                >
                                    <span className="text-[#16120e]">
                                        {item.product?.name ?? item.name}{" "}
                                        <span className="text-stone-500">x{item.quantity}</span>
                                    </span>
                                    <span className="text-[#16120e]">
                                        {formatRupiah(item.subtotal ?? item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center border-2 border-[#16120e] bg-[#16120e] text-[#faf8f5] px-4 py-4 mb-8">
                        <span className="font-mono text-xs font-bold uppercase text-[#feb47b]">Total</span>
                        <span className="font-display font-black text-xl">{formatRupiah(order.total_amount)}</span>
                    </div>

                    {showPaymentForm && (
                        <div className="border-2 border-dashed border-[#16120e] p-4 mb-8 print:hidden">
                            <h2 className="font-mono text-[11px] font-black uppercase tracking-widest text-stone-500 mb-3">
                                Selesaikan Pembayaran
                            </h2>
                            <div id="snap-container"></div>
                            <p className="font-mono text-xs text-stone-500 mt-3 text-center">
                                Mengecek status pembayaran otomatis...
                            </p>
                        </div>
                    )}

                    {!showPaymentForm && displayStatus !== "pending" && (
                        <div className="border-2 border-[#16120e] pt-6 pb-6 mb-8 text-center print:hidden bg-emerald-50">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#16120e] text-[#faf8f5] text-xl mb-3 border-2 border-[#16120e]">
                                ✓
                            </div>
                            <p className="font-mono font-bold text-sm uppercase text-[#16120e] mb-1">
                                Pembayaran Berhasil
                            </p>
                            <p className="font-mono text-xs text-stone-600">Pesananmu sedang kami siapkan.</p>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-3 print:hidden">
                        <button
                            onClick={() => window.print()}
                            className="flex-1 border-2 border-[#16120e] text-[#16120e] py-3 font-mono text-xs font-black uppercase hover:bg-[#16120e] hover:text-[#faf8f5] transition-all"
                        >
                            Cetak Invoice
                        </button>
                        <Link
                            to="/menu"
                            className="flex-1 text-center bg-[#16120e] text-[#faf8f5] py-3 font-mono text-xs font-black uppercase border-2 border-[#16120e] shadow-[4px_4px_0px_#ff6239] hover:bg-[#ff6239] hover:text-[#16120e] transition-all"
                        >
                            Pesan Lagi
                        </Link>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

export default InvoicePage