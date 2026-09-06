import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "../context/CartContext"

const navLinks = [
    { label: "Home", to: "/", type: "link" },
    { label: "Tentang", to: "/about", type: "link" },
    { label: "Menu", to: "/menu", type: "link" },
    { label: "Location", to: "/location", type: "link" },
    { label: "Galery", to: "/galery", type: "link" },
    { label: "Pesanan Saya", to: "/pesanan-saya", type: "link" },
    { label: "Contact", to: "/contact", type: "link" },
]

function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const { totalItems } = useCart()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        function handleScroll() {
            setScrolled(window.scrollY > 50)
        }

        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <>
            {/* TOP TICKER — sama persis dengan yang di Home.jsx, biar identitas brand konsisten di semua halaman */}
            <aside className="w-full bg-[#16120e] text-[#faf8f5] border-b-2 border-[#16120e] py-2 px-4 flex flex-wrap gap-y-1 justify-between items-center text-[10px] sm:text-xs font-mono tracking-widest uppercase overflow-hidden select-none">
                <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5 font-bold text-[#feb47b]">
                        <span className="h-2 w-2 rounded-full bg-[#ff6239] animate-ping" />
                        LIVE ROAST BATCH #042
                    </span>
                    <span className="hidden md:inline text-stone-400">LAT. -6.2297° S, 106.8164° E SENOPATI, JAKARTA</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-6 font-semibold">
                    <span className="hidden sm:inline">MON-FRI 10:00—00:00 / WEEKEND 08:00—23:00</span>
                    <span className="bg-[#ff6239] text-[#16120e] font-bold px-2 py-0.5 shadow-[3px_3px_0px_#16120e] text-[10px] sm:text-[11px]">
                        KEDAI TERBUKA
                    </span>
                </div>
            </aside>

            <nav
                className={`sticky top-0 z-50 bg-[#faf8f5]/95 backdrop-blur-md border-b-4 border-[#16120e] text-[#16120e] transition-all duration-300 ${
                    scrolled ? "py-1.5" : "py-3"
                }`}
            >
                <div className="flex items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
                    <Link to="/" className="flex items-center gap-2.5 md:gap-3 group shrink-0">
                        <div
                            className={`bg-[#16120e] rounded flex items-center justify-center border-2 border-[#16120e] shadow-[3px_3px_0px_#16120e] group-hover:bg-[#ff6239] transition-all duration-300 ${
                                scrolled ? "h-9 w-9" : "h-11 w-11"
                            }`}
                        >
                            <span className="font-display font-black text-xl text-[#faf8f5]">R</span>
                        </div>
                        <div className="leading-none flex-col hidden sm:flex">
                            <span className="font-display font-black text-xl tracking-tighter text-[#16120e] group-hover:text-[#ff6239] transition-colors">
                                MR. R
                            </span>
                            <span className="font-mono text-[9px] tracking-[0.25em] font-extrabold uppercase text-stone-600">
                                COFFEE &amp; EATERY
                            </span>
                        </div>
                    </Link>

                    <div className="hidden lg:flex gap-6 xl:gap-8 font-mono text-xs uppercase font-bold tracking-wider">
                        {navLinks.map((item) => {
                            const isActive = item.type === "link" && location.pathname === item.to
                            return item.type === "link" ? (
                                <Link
                                    key={item.label}
                                    to={item.to}
                                    className={`py-1 border-b-2 transition-all whitespace-nowrap ${
                                        isActive
                                            ? "border-[#ff6239] text-[#16120e]"
                                            : "border-transparent hover:border-[#16120e] hover:text-[#ff6239]"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <a
                                    key={item.label}
                                    href={item.to}
                                    className="py-1 border-b-2 border-transparent hover:border-[#16120e] hover:text-[#ff6239] transition-all whitespace-nowrap"
                                >
                                    {item.label}
                                </a>
                            )
                        })}
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <button
                            onClick={() => navigate("/cart")}
                            className="relative p-2 md:p-2.5 bg-[#faf8f5] border-2 border-[#16120e] rounded shadow-[3px_3px_0px_#16120e] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-[#16120e]"
                            aria-label="Keranjang"
                        >
                            <CartIcon />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#ff6239] border-2 border-[#16120e] text-[#16120e] font-mono font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-[2px_2px_0px_#16120e]">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => navigate("/menu")}
                            className="hidden sm:inline-flex items-center gap-1.5 bg-[#16120e] text-[#faf8f5] px-3.5 md:px-5 py-2 md:py-2.5 font-mono text-[11px] md:text-xs uppercase font-black border-2 border-[#16120e] shadow-[3px_3px_0px_#16120e] md:shadow-[6px_6px_0px_#16120e] hover:bg-[#ff6239] hover:text-[#16120e] hover:translate-x-0.5 hover:translate-y-0.5 transition-all whitespace-nowrap"
                        >
                            Pesan Sekarang
                        </button>

                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="lg:hidden p-2.5 border-2 border-[#16120e] rounded shadow-[3px_3px_0px_#16120e] flex flex-col gap-1.5 items-center justify-center w-10 h-10"
                            aria-label="Menu"
                        >
                            <motion.span
                                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
                                className="block w-5 h-0.5 bg-[#16120e]"
                            ></motion.span>
                            <motion.span
                                animate={{ opacity: menuOpen ? 0 : 1 }}
                                className="block w-5 h-0.5 bg-[#16120e]"
                            ></motion.span>
                            <motion.span
                                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
                                className="block w-5 h-0.5 bg-[#16120e]"
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
                            className="lg:hidden overflow-hidden border-t-2 border-[#16120e] bg-[#faf8f5]"
                        >
                            <div className="flex flex-col px-4 pt-4 pb-4 gap-3 font-mono text-xs uppercase font-bold tracking-wider">
                                {navLinks.map((item) => {
                                    const isActive = item.type === "link" && location.pathname === item.to
                                    return item.type === "link" ? (
                                        <Link
                                            key={item.label}
                                            to={item.to}
                                            onClick={() => setMenuOpen(false)}
                                            className={`py-1 transition-colors ${
                                                isActive ? "text-[#ff6239]" : "hover:text-[#ff6239]"
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <a
                                            key={item.label}
                                            href={item.to}
                                            onClick={() => setMenuOpen(false)}
                                            className="py-1 hover:text-[#ff6239] transition-colors"
                                        >
                                            {item.label}
                                        </a>
                                    )
                                })}
                                <button
                                    onClick={() => {
                                        setMenuOpen(false)
                                        navigate("/menu")
                                    }}
                                    className="mt-1 inline-flex items-center justify-center gap-2 bg-[#16120e] text-[#faf8f5] px-5 py-2.5 border-2 border-[#16120e] shadow-[4px_4px_0px_#16120e]"
                                >
                                    Pesan Sekarang
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    )
}

function CartIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h15l-1.5 9h-13z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6L4 3H2" />
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="18" cy="20" r="1.5" />
        </svg>
    )
}

export default Navbar