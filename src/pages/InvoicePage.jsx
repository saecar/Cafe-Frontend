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
            <section className="min-h-screen px-6 md:px-8 py-16 md:py-24 bg-[#F5EFE3] text-center">
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#3a2c29] mb-3">
                    Invoice Tidak Ditemukan
                </h1>
                <p className="text-sm md:text-base text-[#8a7a6d] mb-8">
                    Invoice ini cuma tersimpan di browser tempat kamu checkout. Coba buka lagi dari
                    perangkat itu, atau lihat riwayat pesananmu.
                </p>
                <Link
                    to="/pesanan-saya"
                    className="inline-block bg-[#3b322c] text-[#F5EFE3] px-6 py-3 font-semibold text-sm"
                >
                    Pesanan Saya
                </Link>
            </section>
        )
    }

    return (
        <section className="min-h-screen px-6 md:px-8 py-12 md:py-20 bg-[#F5EFE3]">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl mx-auto border-2 border-[#1C1410] p-6 md:p-10 bg-[#F5EFE3] print:border-0"
            >
                <div className="text-center mb-8">
                    <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#3a2c29] mb-1">
                        Terima Kasih!
                    </h1>
                    <p className="text-sm text-[#8a7a6d]">Pesananmu sudah kami terima.</p>
                </div>

                <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#8a7a6d]">No. Pesanan</span>
                    <span className="font-semibold text-[#3a2c29]">{order.order_number}</span>
                </div>
                {order.created_at && (
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-[#8a7a6d]">Tanggal</span>
                        <span className="text-[#3a2c29]">{formatDate(order.created_at)}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm mb-6">
                    <span className="text-[#8a7a6d]">Status</span>
                    <span className="font-semibold text-[#3a2c29]">
                        {statusLabel[displayStatus] ?? displayStatus}
                        {displayStatus === "pending" && (
                            <span className="inline-block w-2 h-2 rounded-full bg-yellow-600 ml-2 animate-pulse" />
                        )}
                    </span>
                </div>

                <div className="border-t-2 border-[#1C1410] pt-4 mb-4">
                    <h2 className="font-semibold text-sm mb-3">Detail Pemesan</h2>
                    <p className="text-sm text-[#3a2c29]">{order.customer_name}</p>
                    <p className="text-sm text-[#8a7a6d]">{order.email} · {order.phone}</p>
                    <p className="text-sm text-[#8a7a6d]">{order.address}</p>
                </div>

                <div className="border-t-2 border-[#1C1410] pt-4 mb-4">
                    <h2 className="font-semibold text-sm mb-3">Item</h2>
                    <div className="flex flex-col gap-2">
                        {(order.orderItems || order.order_items || []).map((item) => (
                            <div key={item.id ?? item.product_id} className="flex justify-between text-sm">
                                <span className="text-[#3a2c29]">
                                    {item.product?.name ?? item.name} <span className="text-[#8a7a6d]">x{item.quantity}</span>
                                </span>
                                <span className="text-[#3a2c29]">{formatRupiah(item.subtotal ?? item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between border-t-2 border-[#1C1410] pt-4 mb-8">
                    <span className="font-semibold text-base">Total</span>
                    <span className="font-heading font-bold text-lg">{formatRupiah(order.total_amount)}</span>
                </div>

                {showPaymentForm && (
                    <div className="border-t-2 border-[#1C1410] pt-4 mb-8 print:hidden">
                        <h2 className="font-semibold text-sm mb-3">Selesaikan Pembayaran</h2>
                        <div id="snap-container"></div>
                        <p className="text-xs text-[#8a7a6d] mt-3 text-center">
                            Mengecek status pembayaran otomatis...
                        </p>
                    </div>
                )}

                {!showPaymentForm && displayStatus !== "pending" && (
                    <div className="border-t-2 border-[#1C1410] pt-6 mb-8 text-center print:hidden">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#3b322c] text-[#F5EFE3] text-xl mb-3">
                            ✓
                        </div>
                        <p className="font-semibold text-[#3a2c29] mb-1">Pembayaran Berhasil</p>
                        <p className="text-xs text-[#8a7a6d]">Pesananmu sedang kami siapkan.</p>
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-3 print:hidden">
                    <button
                        onClick={() => window.print()}
                        className="flex-1 border-2 border-[#1C1410] text-[#3a2c29] py-3 font-semibold text-sm"
                    >
                        Cetak Invoice
                    </button>
                    <Link
                        to="/menu"
                        className="flex-1 text-center bg-[#3b322c] text-[#F5EFE3] py-3 font-semibold text-sm"
                    >
                        Pesan Lagi
                    </Link>
                </div>
            </motion.div>
        </section>
    )
}

export default InvoicePage