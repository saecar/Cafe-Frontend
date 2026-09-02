import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { getImageUrl } from "../lib/api"
import { formatRupiah } from "../lib/format"

function CartPage() {
    const { items, updateQuantity, removeItem, totalPrice } = useCart()
    const navigate = useNavigate()

    if (items.length === 0) {
        return (
            <section className="min-h-screen px-6 md:px-8 py-16 md:py-24 bg-[#F5EFE3] text-center">
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#3a2c29] mb-3">
                    Keranjang Kosong
                </h1>
                <p className="text-sm md:text-base text-[#8a7a6d] mb-8">
                    Belum ada menu yang kamu pilih.
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
                Keranjang Kamu
            </h1>

            <div className="max-w-2xl mx-auto flex flex-col gap-4">
                {items.map((item) => (
                    <motion.div
                        key={item.product_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 md:gap-4 border-2 border-[#1C1410] p-3 md:p-4 bg-[#F5EFE3]"
                    >
                        <div
                            className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-[#6B4832] bg-cover bg-center"
                            style={
                                item.image
                                    ? { backgroundImage: `url(${getImageUrl(item.image)})` }
                                    : undefined
                            }
                        />

                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm md:text-base text-[#3a2c29] truncate">
                                {item.name}
                            </h3>
                            <p className="text-xs md:text-sm text-[#8a7a6d]">{formatRupiah(item.price)}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                className="w-7 h-7 md:w-8 md:h-8 border border-[#1C1410] text-sm font-bold"
                            >
                                −
                            </button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                className="w-7 h-7 md:w-8 md:h-8 border border-[#1C1410] text-sm font-bold"
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={() => removeItem(item.product_id)}
                            className="text-xs text-[#8a7a6d] hover:text-[#5a2a1e] ml-1"
                        >
                            Hapus
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="max-w-2xl mx-auto mt-8 border-t-2 border-[#1C1410] pt-6 flex items-center justify-between">
                <span className="font-semibold text-sm md:text-base text-[#3a2c29]">Total</span>
                <span className="font-heading text-lg md:text-xl font-bold text-[#3a2c29]">
                    {formatRupiah(totalPrice)}
                </span>
            </div>

            <div className="max-w-2xl mx-auto mt-6 flex flex-col md:flex-row gap-3">
                <Link
                    to="/menu"
                    className="flex-1 text-center border-2 border-[#1C1410] text-[#3a2c29] py-3 font-semibold text-sm"
                >
                    Tambah Menu Lagi
                </Link>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/checkout")}
                    className="flex-1 bg-[#3b322c] text-[#F5EFE3] py-3 font-semibold text-sm"
                >
                    Lanjut ke Checkout
                </motion.button>
            </div>
        </section>
    )
}

export default CartPage
