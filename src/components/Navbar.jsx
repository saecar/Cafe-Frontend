import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "../context/CartContext"

const navLinks = [
    { label: "Home", to: "/", type: "link" },
    { label: "Tentang", to: "/#tentang", type: "anchor" },
    { label: "Menu", to: "/menu", type: "link" },
    { label: "Location", to: "/#lokasi", type: "anchor" },
    { label: "Galery", to: "/galery", type: "link" },
    { label: "Pesanan Saya", to: "/pesanan-saya", type: "link" },
    { label: "Contact", to: "/contact", type: "link" },
]

function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const { totalItems } = useCart()
    const navigate = useNavigate()

    useEffect(() => {
        function handleScroll() {
            setScrolled(window.scrollY > 50)
        }

        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav
            className={`sticky top-0 z-50 bg-[#3b322c] text-[#FFE2D4] transition-all duration-300 ${
                scrolled ? "py-2 shadow-lg" : "py-4"
            }`}
        >
            <div className="flex items-center justify-between px-4 md:px-8">
                <Link
                    to="/"
                    className={`font-heading font-bold transition-all duration-300 ${
                        scrolled ? "text-lg md:text-xl" : "text-xl md:text-2xl"
                    }`}
                >
                    Mr. R
                </Link>

                <div className="hidden md:flex gap-4 lg:gap-8 text-sm font-medium">
                    {navLinks.map((item) =>
                        item.type === "link" ? (
                            <Link
                                key={item.label}
                                to={item.to}
                                className="font-elegant hover:text-[#ffe6a7] transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <a
                                key={item.label}
                                href={item.to}
                                className="font-elegant hover:text-[#ffe6a7] transition-colors"
                            >
                                {item.label}
                            </a>
                        )
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/cart")}
                        className="relative font-elegant hover:text-[#ffe6a7] transition-colors text-sm md:text-base"
                        aria-label="Keranjang"
                    >
                        🛒
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#ffe6a7] text-[#1C1410] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => navigate("/menu")}
                        className="font-elegant bg-[#F5EFE3] text-[#1C1410] px-3 md:px-4 py-2 rounded font-semibold text-xs md:text-sm hover:bg-[#ffe6a7] transition-colors"
                    >
                        Order Now
                    </button>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden flex flex-col gap-1.5 p-1"
                    >
                        <motion.span
                            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
                            className="block w-6 h-0.5 bg-[#FFE2D4]"
                        ></motion.span>
                        <motion.span
                            animate={{ opacity: menuOpen ? 0 : 1 }}
                            className="block w-6 h-0.5 bg-[#FFE2D4]"
                        ></motion.span>
                        <motion.span
                            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
                            className="block w-6 h-0.5 bg-[#FFE2D4]"
                        ></motion.span>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden overflow-hidden"
                    >
                        <div className="flex flex-col px-4 pt-4 pb-2 gap-4 text-sm">
                            {navLinks.map((item) =>
                                item.type === "link" ? (
                                    <Link
                                        key={item.label}
                                        to={item.to}
                                        onClick={() => setMenuOpen(false)}
                                        className="font-elegant hover:text-[#ffe6a7] transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <a
                                        key={item.label}
                                        href={item.to}
                                        onClick={() => setMenuOpen(false)}
                                        className="font-elegant hover:text-[#ffe6a7] transition-colors"
                                    >
                                        {item.label}
                                    </a>
                                )
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar
