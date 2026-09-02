import { useState } from "react"
import { motion } from "framer-motion"

const galleryData = {
    Suasana: [
        { caption: "Sore hari di Mr. R", rotate: "rotate-2" },
        { caption: "Sudut favorit pelanggan", rotate: "-rotate-1" },
        { caption: "Meja panjang untuk berbagi cerita", rotate: "rotate-1" },
        { caption: "Malam yang tenang", rotate: "-rotate-2" },
        { caption: "Pagi yang hangat", rotate: "rotate-3" },
        { caption: "Senja di teras", rotate: "-rotate-2" },
    ],
    Proses: [
        { caption: "Meracik matcha premium", rotate: "rotate-1" },
        { caption: "Menyeduh dengan sabar", rotate: "-rotate-2" },
        { caption: "Biji kopi pilihan", rotate: "rotate-2" },
        { caption: "Bunda di balik bar", rotate: "-rotate-1" },
        { caption: "Menyajikan dengan cinta", rotate: "rotate-3" },
        { caption: "Menyeduh teh dengan hati", rotate: "-rotate-2" },
    ],
    Momen: [
        { caption: "Ngobrol sambil ngopi", rotate: "-rotate-1" },
        { caption: "Pelanggan setia", rotate: "rotate-2" },
        { caption: "Cerita di setiap cangkir", rotate: "-rotate-2" },
    ],
}

const categories = Object.keys(galleryData)

function Galery() {
    const [activeCategory, setActiveCategory] = useState("Suasana")

    return (
        <section className="px-6 md:px-8 py-16 md:py-24 bg-[#F5EFE3] min-h-screen overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-center mb-10 md:mb-12"
            >
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#3a2c29] mb-3">
                    Galery
                </h1>
                <p className="text-sm md:text-base text-[#8a7a6d]">
                    Setiap sudut, setiap cangkir, setiap momen di Mr. R Coffee.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-10 md:mb-16"
            >
                <div className="flex justify-center gap-0 w-full">
                    {categories.map((category) => (
                        <motion.button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`px-5 md:px-8 py-3 border-2 border-[#1C1410] font-semibold text-xs md:text-sm whitespace-nowrap ${
                                activeCategory === category
                                    ? "bg-[#3b322c] text-[#F5EFE3]"
                                    : "bg-transparent text-[#3a2c29]"
                            }`}
                        >
                            {category}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            <div className="max-w-6xl mx-auto">
                <motion.div
                    key={activeCategory}
                    initial="hidden"
                    animate="show"
                    variants={{
                        show: { transition: { staggerChildren: 0.1 } }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-16"
                >
                    {galleryData[activeCategory].map((photo) => (
                        <motion.div
                            key={photo.caption}
                            variants={{
                                hidden: { opacity: 0, y: 40, scale: 0.9 },
                                show: { opacity: 1, y: 0, scale: 1 }
                            }}
                            whileHover={{ scale: 1.04, rotate: 0, zIndex: 10 }}
                            transition={{ duration: 0.5 }}
                            className={`bg-white p-3 pb-6 shadow-lg ${photo.rotate}`}
                        >
                            <div className="bg-[#6B4832] h-64 sm:h-56 mb-3"></div>
                            <p className="text-xs uppercase tracking-wide text-[#8a7a6d] mb-1">
                                {activeCategory}
                            </p>
                            <p className="font-heading font-bold text-[#3a2c29] text-sm">
                                {photo.caption}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

export default Galery