import { motion } from "framer-motion"

function Tentang() {
    return (
        <section
            id="tentang"
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 px-6 md:px-8 py-16 md:py-24 items-center bg-[#F5EFE3]"
        >
            <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="bg-[#6B4832] h-56 md:h-80 rounded"
            ></motion.div>

            <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
            >
                <p className="text-xs uppercase tracking-wide text-[#8a7a6d] mb-3">
                    Our Story
                </p>
                <p className="font-elegant text-sm md:text-base text-[#3a2c29] mb-6">
                    Mr. R was born from a simple belief: that every cup of coffee and every bite of food has the power to make your day better.
                </p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#3b322c] text-[#ccc5b9] px-6 py-3 rounded font-semibold text-sm"
                >
                    Learn More
                </motion.button>
            </motion.div>
        </section>
    )
}

export default Tentang