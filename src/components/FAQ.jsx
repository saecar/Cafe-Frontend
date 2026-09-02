import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const faqs = [
    {
        question: "Apa yang bikin matcha di sini berbeda?",
        answer: "Kami memilih matcha berkualitas premium, sehingga rasanya tetap enak bahkan tanpa tambahan gula atau susu kental manis.",
    },
    {
        question: "Apakah bisa pesan untuk acara atau event?",
        answer: "Bisa. Hubungi kami lewat WhatsApp untuk mendiskusikan kebutuhan dan jumlah pesanan.",
    },
    {
        question: "Ada opsi minuman tanpa gula?",
        answer: "Tentu. Semua minuman bisa disesuaikan tingkat kemanisannya, termasuk tanpa gula sama sekali.",
    },
    {
        question: "Apakah menerima pesan antar?",
        answer: "Untuk area sekitar, kami melayani pengantaran langsung. Pesan lewat WhatsApp agar lebih cepat.",
    },
]

function FAQ() {
    const [openIndex, setOpenIndex] = useState(null)

    function toggleFAQ(index) {
        if (openIndex === index) {
            setOpenIndex(null)
        } else {
            setOpenIndex(index)
        }
    }

    return (
        <div className="max-w-3xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10"
            >
                <h2 className="font-heading text-2xl font-bold text-[#3a2c29] mb-2">
                    Pertanyaan yang Sering Ditanya
                </h2>
                <p className="text-sm text-[#8a7a6d]">
                    Mungkin jawabannya sudah ada di sini.
                </p>
            </motion.div>

            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{
                    show: { transition: { staggerChildren: 0.1 } }
                }}
            >
                {faqs.map((faq, index) => (
                    <motion.div
                        key={faq.question}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            show: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.4 }}
                        className="border-2 border-[#1C1410] mb-3"
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full text-left px-6 py-4 font-semibold text-sm flex justify-between items-center"
                        >
                            {faq.question}
                            <motion.span
                                animate={{ rotate: openIndex === index ? 45 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-xl leading-none"
                            >
                                +
                            </motion.span>
                        </button>

                        <AnimatePresence>
                            {openIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-4 text-sm text-[#8a7a6d]">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}

export default FAQ