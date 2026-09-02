import { motion } from "framer-motion"

function Hero() {
    return (
        <section id="home" className="relative min-h-screen flex items-center px-6 md:px-8 py-20 bg-[#F5EFE3]">
            <div className="relative z-10 max-w-xl">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#3a2c29] leading-tight mb-4"
                >
                    Every cup, Every bite, Every moment matters.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-sm md:text-base text-[#3a2c29] mb-8"
                >
                    Good Coffee, Good Food, Great Moment.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#3b322c] text-[#ccc5b9] px-6 py-3 rounded font-semibold text-sm md:text-base"
                    >
                        Order Now
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="border border-[#3a2c29] text-[#3a2c29] px-6 py-3 rounded font-semibold text-sm md:text-base"
                    >
                        View Menu
                    </motion.button>
                </motion.div>
            </div>
        </section>
    )
}

export default Hero