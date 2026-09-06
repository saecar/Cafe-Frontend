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
            <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-[#faf8f5] text-[#16120e] text-center flex flex-col items-center justify-center">
                <span className="font-mono text-xs font-black uppercase tracking-widest text-[#ff6239] bg-[#16120e] px-2.5 py-1 inline-block shadow-[3px_3px_0px_#16120e] mb-4">
                    KERANJANG
                </span>
                <h1 className="font-display text-3xl md:text-4xl font-black uppercase text-[#16120e] mb-3">
                    Keranjang Kosong
                </h1>
                <p className="text-sm md:text-base font-mono text-stone-600 mb-8">Belum ada menu yang kamu pilih.</p>
                <Link
                    to="/menu"
                    className="inline-flex items-center gap-2 bg-[#16120e] text-[#faf8f5] px-6 py-3 font-mono font-black uppercase text-sm border-2 border-[#16120e] shadow-[6px_6px_0px_#16120e] hover:bg-[#ff6239] hover:text-[#16120e] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                    Lihat Menu
                </Link>
            </section>
        )
    }

    return (
        <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 md:py-20 bg-[#faf8f5] text-[#16120e]">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <span className="font-mono text-xs font-black uppercase tracking-widest text-[#ff6239] bg-[#16120e] px-2.5 py-1 inline-block shadow-[3px_3px_0px_#16120e] mb-4">
                        KERANJANG
                    </span>
                    <h1 className="font-display text-3xl md:text-4xl font-black uppercase text-[#16120e]">Keranjang Kamu</h1>
                </div>

                <div className="flex flex-col gap-4">
                    {items.map((item) => (
                        <motion.div
                            key={item.product_id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 md:gap-4 border-4 border-[#16120e] p-3 md:p-4 bg-[#faf8f5] shadow-[6px_6px_0px_#16120e]"
                        >
                            <div
                                className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-stone-300 bg-cover bg-center border-2 border-[#16120e]"
                                style={item.image ? { backgroundImage: `url(${getImageUrl(item.image)})` } : undefined}
                            />

                            <div className="flex-1 min-w-0">
                                <h3 className="font-display font-bold text-sm md:text-base text-[#16120e] truncate">
                                    {item.name}
                                </h3>
                                <p className="text-xs md:text-sm font-mono text-stone-600">{formatRupiah(item.price)}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                    className="w-7 h-7 md:w-8 md:h-8 border-2 border-[#16120e] text-sm font-black hover:bg-[#16120e] hover:text-[#faf8f5] transition-colors"
                                >
                                    −
                                </button>
                                <span className="w-6 text-center text-sm font-mono font-bold">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                    className="w-7 h-7 md:w-8 md:h-8 border-2 border-[#16120e] text-sm font-black hover:bg-[#16120e] hover:text-[#faf8f5] transition-colors"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={() => removeItem(item.product_id)}
                                className="text-[10px] font-mono uppercase font-bold text-stone-500 hover:text-[#ff6239] ml-1 transition-colors"
                            >
                                Hapus
                            </button>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 border-t-4 border-[#16120e] pt-6 flex items-center justify-between">
                    <span className="font-mono font-black uppercase text-sm md:text-base text-[#16120e]">Total</span>
                    <span className="font-display text-xl md:text-2xl font-black text-[#16120e]">
                        {formatRupiah(totalPrice)}
                    </span>
                </div>

                <div className="mt-6 flex flex-col md:flex-row gap-3">
                    <Link
                        to="/menu"
                        className="flex-1 text-center border-2 border-[#16120e] text-[#16120e] py-3.5 font-mono font-black uppercase text-sm hover:bg-[#16120e] hover:text-[#faf8f5] transition-all"
                    >
                        Tambah Menu Lagi
                    </Link>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/checkout")}
                        className="flex-1 bg-[#16120e] text-[#faf8f5] py-3.5 font-mono font-black uppercase text-sm border-2 border-[#16120e] shadow-[4px_4px_0px_#ff6239] hover:bg-[#ff6239] hover:text-[#16120e] transition-all"
                    >
                        Lanjut ke Checkout →
                    </motion.button>
                </div>
            </div>
        </section>
    )
}

export default CartPage