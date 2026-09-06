import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { getOrderHistory } from "../lib/orderHistory"
import { formatRupiah, formatDate } from "../lib/format"

const statusLabel = {
    pending: "Menunggu pembayaran",
    processing: "Dibayar / diproses",
    completed: "Selesai",
    cancelled: "Dibatalkan",
}

// Badge status pakai palet yang sama dengan Home.jsx (oat/terracotta/espresso, low-contrast)
const statusBadge = {
    pending: "bg-[#F8ECE6] text-[#934825]",
    processing: "bg-[#F1E7DA] text-[#C86D44]",
    completed: "bg-[#E7F3EA] text-emerald-700",
    cancelled: "bg-[#F1E7DA] text-[#8c7a6b]",
}

const SPRING_GENTLE = { type: "spring", stiffness: 260, damping: 24 }
const staggerParent = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
}
const revealUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: SPRING_GENTLE },
}

const ACTIVE_STATUSES = ["pending", "processing"]

function MyOrdersPage() {
    const orders = getOrderHistory()
    const [tab, setTab] = useState("active")

    const activeOrders = useMemo(() => orders.filter((o) => ACTIVE_STATUSES.includes(o.status)), [orders])
    const historyOrders = useMemo(() => orders.filter((o) => !ACTIVE_STATUSES.includes(o.status)), [orders])
    const visibleOrders = tab === "active" ? activeOrders : historyOrders

    return (
        <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 sm:py-16 bg-[#FDFBF7] text-[#231B17]">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={SPRING_GENTLE}
                    className="mb-6 sm:mb-8"
                >
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F9F3EB] border border-[#E6DDD2] text-[#C86D44] font-mono text-[11px] font-bold tracking-wider uppercase mb-3">
                        Riwayat
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17120F] tracking-tight mb-1.5">
                        Pesanan Saya
                    </h1>
                    <p className="text-sm text-[#342822]/80">Riwayat pesanan yang dibuat dari browser ini.</p>
                </motion.div>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={SPRING_GENTLE}
                        className="text-center bg-white rounded-2xl border border-[#E6DDD2] shadow-[0_10px_30px_-8px_rgba(35,27,23,0.08)] py-12 px-6"
                    >
                        <p className="text-sm text-[#342822]/80 mb-6">Belum ada pesanan.</p>
                        <Link
                            to="/menu"
                            className="inline-flex items-center gap-2 bg-[#C86D44] hover:bg-[#B55E36] text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors shadow-sm"
                        >
                            Lihat Menu
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        {/* Segmented tabs — Aktif vs Selesai, dari field status asli */}
                        <div className="bg-[#F1E7DA] p-1 rounded-xl flex items-stretch gap-1 shadow-sm mb-6">
                            <button
                                onClick={() => setTab("active")}
                                className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                                    tab === "active" ? "bg-[#17120F] text-white shadow-sm" : "text-[#342822]/70 hover:text-[#17120F]"
                                }`}
                            >
                                <span>Pesanan Aktif</span>
                                <span
                                    className={`min-w-[20px] px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                                        tab === "active" ? "bg-[#C86D44] text-white" : "bg-white text-[#342822]/70"
                                    }`}
                                >
                                    {activeOrders.length}
                                </span>
                            </button>
                            <button
                                onClick={() => setTab("history")}
                                className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                                    tab === "history" ? "bg-[#17120F] text-white shadow-sm" : "text-[#342822]/70 hover:text-[#17120F]"
                                }`}
                            >
                                <span>Riwayat Selesai</span>
                                <span
                                    className={`min-w-[20px] px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                                        tab === "history" ? "bg-[#C86D44] text-white" : "bg-white text-[#342822]/70"
                                    }`}
                                >
                                    {historyOrders.length}
                                </span>
                            </button>
                        </div>

                        {/* List */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={tab}
                                initial="hidden"
                                animate="show"
                                variants={staggerParent}
                                className="flex flex-col gap-3 sm:gap-4"
                            >
                                {visibleOrders.length === 0 ? (
                                    <motion.div
                                        variants={revealUp}
                                        className="text-center bg-white rounded-2xl border border-[#E6DDD2] shadow-[0_10px_30px_-8px_rgba(35,27,23,0.06)] py-10 px-6"
                                    >
                                        <p className="text-sm text-[#342822]/70">
                                            {tab === "active"
                                                ? "Tidak ada pesanan yang sedang berjalan."
                                                : "Belum ada pesanan yang selesai."}
                                        </p>
                                    </motion.div>
                                ) : (
                                    visibleOrders.map((order) => (
                                        <motion.div key={order.order_number} variants={revealUp} whileHover={{ y: -3 }}>
                                            <Link
                                                to={`/invoice/${order.order_number}`}
                                                state={{ order }}
                                                className="block bg-white rounded-2xl border border-[#E6DDD2] p-4 sm:p-5 shadow-[0_10px_30px_-8px_rgba(35,27,23,0.07)] hover:shadow-[0_12px_32px_-4px_rgba(35,27,23,0.12)] transition-shadow"
                                            >
                                                <div className="flex justify-between items-center gap-3 mb-2">
                                                    <span className="font-mono font-bold text-sm text-[#17120F] truncate">
                                                        {order.order_number}
                                                    </span>
                                                    <span className="font-bold text-base text-[#17120F] whitespace-nowrap">
                                                        {formatRupiah(order.total_amount)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center gap-3">
                                                    <span className="text-xs text-[#342822]/60">
                                                        {order.created_at ? formatDate(order.created_at) : ""}
                                                    </span>
                                                    <span
                                                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full whitespace-nowrap ${
                                                            statusBadge[order.status] ?? "bg-[#F1E7DA] text-[#342822]/70"
                                                        }`}
                                                    >
                                                        {statusLabel[order.status] ?? order.status}
                                                    </span>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </>
                )}
            </div>
        </section>
    )
}

export default MyOrdersPage