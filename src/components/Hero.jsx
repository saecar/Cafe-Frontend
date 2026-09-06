import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

function Hero() {
    const navigate = useNavigate()

    function handleViewMenu() {
        document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center overflow-hidden px-6 md:px-8 py-20 bg-[#F5EFE3]"
        >
            {/* Decorative floating blobs */}
            <motion.div
                className="absolute -top-24 -right-24 w-72 h-72 md:w-96 md:h-96 rounded-full bg-[#3b322c]/10 blur-3xl"
                animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -bottom-32 -left-20 w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full bg-[#8a6a4f]/10 blur-3xl"
                animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
                transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating coffee beans (decorative) */}
            {[
                { top: "18%", left: "78%", size: 22, delay: 0 },
                { top: "70%", left: "85%", size: 16, delay: 0.6 },
                { top: "40%", left: "68%", size: 12, delay: 1.2 },
            ].map((bean, i) => (
                <motion.div
                    key={i}
                    className="hidden md:block absolute rounded-full bg-[#3b322c]"
                    style={{ top: bean.top, left: bean.left, width: bean.size, height: bean.size * 1.3 }}
                    animate={{ y: [0, -18, 0], rotate: [0, 15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: bean.delay }}
                >
                    <div className="absolute inset-y-0 left-1/2 w-px bg-[#F5EFE3]/60" />
                </motion.div>
            ))}

            <div className="relative z-10 max-w-xl">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 bg-[#3b322c]/10 text-[#3a2c29] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
                >
                    ☕ Fresh Roasted Daily
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#3a2c29] leading-tight mb-4"
                >
                    Every cup, Every bite,{" "}
                    <span className="relative inline-block">
                        Every moment
                        <motion.span
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                            className="absolute left-0 -bottom-1 h-2 md:h-3 w-full bg-[#c9a876]/50 origin-left -z-10"
                        />
                    </span>{" "}
                    matters.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-sm md:text-base text-[#3a2c29]/80 mb-8"
                >
                    Good Coffee, Good Food, Great Moment.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                >
                    <motion.button
                        onClick={() => navigate("/menu")}
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59,50,44,0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative flex items-center justify-center gap-2 bg-[#3b322c] text-[#ccc5b9] px-6 py-3 rounded font-semibold text-sm md:text-base overflow-hidden"
                    >
                        <span className="relative z-10">Order Now</span>
                        <motion.svg
                            className="relative z-10 w-4 h-4"
                            initial={{ x: 0 }}
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </motion.svg>
                    </motion.button>

                    <motion.button
                        onClick={handleViewMenu}
                        whileHover={{ scale: 1.05, backgroundColor: "#3a2c29", color: "#F5EFE3" }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 border border-[#3a2c29] text-[#3a2c29] px-6 py-3 rounded font-semibold text-sm md:text-base transition-colors"
                    >
                        View Menu
                    </motion.button>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-widest text-[#3a2c29]/60">Scroll</span>
                <motion.div
                    className="w-5 h-8 rounded-full border-2 border-[#3a2c29]/40 flex justify-center pt-1.5"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <motion.div
                        className="w-1 h-1.5 rounded-full bg-[#3a2c29]/60"
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>
            </motion.div>
        </section>
    )
}

export default Hero