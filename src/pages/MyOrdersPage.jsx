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

function MyOrdersPage() {
    const orders = getOrderHistory()

    return (
        <section className="min-h-screen px-6 md:px-8 py-12 md:py-20 bg-[#F5EFE3]">
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#3a2c29] mb-2 text-center">
                Pesanan Saya
            </h1>
            <p className="text-sm text-[#8a7a6d] text-center mb-10">
                Riwayat pesanan yang dibuat dari browser ini.
            </p>

            {orders.length === 0 ? (
                <div className="text-center">
                    <p className="text-sm text-[#8a7a6d] mb-6">Belum ada pesanan.</p>
                    <Link
                        to="/menu"
                        className="inline-block bg-[#3b322c] text-[#F5EFE3] px-6 py-3 font-semibold text-sm"
                    >
                        Lihat Menu
                    </Link>
                </div>
            ) : (
                <div className="max-w-2xl mx-auto flex flex-col gap-4">
                    {orders.map((order) => (
                        <motion.div
                            key={order.order_number}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Link
                                to={`/invoice/${order.order_number}`}
                                state={{ order }}
                                className="block border-2 border-[#1C1410] p-4 md:p-5 hover:bg-[#e8dfc8] transition-colors"
                            >
                                <div className="flex justify-between mb-1">
                                    <span className="font-semibold text-sm text-[#3a2c29]">
                                        {order.order_number}
                                    </span>
                                    <span className="text-sm font-semibold text-[#3a2c29]">
                                        {formatRupiah(order.total_amount)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-[#8a7a6d]">
                                    <span>{order.created_at ? formatDate(order.created_at) : ""}</span>
                                    <span>{statusLabel[order.status] ?? order.status}</span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    )
}

export default MyOrdersPage
