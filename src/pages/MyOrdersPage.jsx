import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { getOrderHistory } from "../lib/orderHistory"
import { formatRupiah, formatDate } from "../lib/format"

const statusLabel = {
    pending: "Menunggu pembayaran",
    processing: "Dibayar / diproses",
    completed: "Selesai",
    cancelled: "Dibatalkan",
}

const statusTag = {
    pending: "bg-[#ffd56b]",
    processing: "bg-[#feb47b]",
    completed: "bg-[#ff6239]",
    cancelled: "bg-stone-300",
}

function MyOrdersPage() {
    const orders = getOrderHistory()

    return (
        <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 md:py-20 bg-[#faf8f5] text-[#16120e]">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <span className="font-mono text-xs font-black uppercase tracking-widest text-[#ff6239] bg-[#16120e] px-2.5 py-1 inline-block shadow-[3px_3px_0px_#16120e] mb-4">
                        RIWAYAT
                    </span>
                    <h1 className="font-display text-3xl md:text-4xl font-black uppercase text-[#16120e] mb-2">
                        Pesanan Saya
                    </h1>
                    <p className="text-sm font-mono text-stone-600">Riwayat pesanan yang dibuat dari browser ini.</p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center">
                        <p className="text-sm font-mono text-stone-600 mb-6">Belum ada pesanan.</p>
                        <Link
                            to="/menu"
                            className="inline-flex items-center gap-2 bg-[#16120e] text-[#faf8f5] px-6 py-3 font-mono font-black uppercase text-sm border-2 border-[#16120e] shadow-[6px_6px_0px_#16120e] hover:bg-[#ff6239] hover:text-[#16120e] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                        >
                            Lihat Menu
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {orders.map((order) => (
                            <motion.div key={order.order_number} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <Link
                                    to={`/invoice/${order.order_number}`}
                                    state={{ order }}
                                    className="block border-4 border-[#16120e] p-4 md:p-5 bg-[#faf8f5] shadow-[6px_6px_0px_#16120e] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0px_#16120e] transition-all"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-mono font-black text-sm text-[#16120e]">{order.order_number}</span>
                                        <span className="font-display font-bold text-base text-[#16120e]">
                                            {formatRupiah(order.total_amount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-mono text-stone-500">
                                            {order.created_at ? formatDate(order.created_at) : ""}
                                        </span>
                                        <span
                                            className={`text-[10px] font-mono font-black uppercase px-2 py-1 border-2 border-[#16120e] ${
                                                statusTag[order.status] ?? "bg-stone-200"
                                            }`}
                                        >
                                            {statusLabel[order.status] ?? order.status}
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default MyOrdersPage