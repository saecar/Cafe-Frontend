import { useState } from "react"
import { motion } from "framer-motion"
import FAQ from '../components/FAQ'
import { api } from "../lib/api"

const contactCards = [
    { title: "WHATSAPP", value: "+62 812 3456 7890", note: "Pesan langsung ke Bunda" },
    { title: "EMAIL", value: "hello@mrrcoffee.com", note: "Untuk kerja sama" },
    { title: "INSTAGRAM", value: "@mrrcoffee", note: "Ikuti keseharian kami" },
]

const initialForm = { name: "", email: "", phone: "", message: "" }

function Contact() {
    const [form, setForm] = useState(initialForm)
    const [submitting, setSubmitting] = useState(false)
    const [status, setStatus] = useState(null) // "success" | "error" | null
    const [errorMessage, setErrorMessage] = useState(null)

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitting(true)
        setStatus(null)
        setErrorMessage(null)

        try {
            await api.submitContact(form)
            setStatus("success")
            setForm(initialForm)
        } catch (err) {
            setStatus("error")
            setErrorMessage(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="px-6 md:px-8 py-16 md:py-24 bg-[#F5EFE3] min-h-screen overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-center mb-10 md:mb-16"
            >
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#3a2c29] mb-3">
                    Get In Touch
                </h1>
                <p className="text-sm md:text-base text-[#8a7a6d]">
                    Punya pertanyaan atau masukan? Kami senang mendengarnya.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-20">
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="border-2 border-[#1C1410] p-5 md:p-8"
                >
                    <h2 className="font-semibold text-base md:text-lg mb-2">Kirim Pesan</h2>
                    <p className="text-xs md:text-sm text-[#8a7a6d] mb-6">
                        Isi formulir di bawah ini.
                    </p>

                    <label className="block text-xs uppercase tracking-wide mb-2">
                        Nama
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Nama kamu"
                        className="w-full border border-[#d4c9ae] px-3 py-2 mb-4 text-sm focus:border-[#3b322c] focus:outline-none transition-colors"
                    />

                    <label className="block text-xs uppercase tracking-wide mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="email@kamu.com"
                        className="w-full border border-[#d4c9ae] px-3 py-2 mb-4 text-sm focus:border-[#3b322c] focus:outline-none transition-colors"
                    />

                    <label className="block text-xs uppercase tracking-wide mb-2">
                        No. HP (opsional)
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="08xxxxxxxxxx"
                        className="w-full border border-[#d4c9ae] px-3 py-2 mb-4 text-sm focus:border-[#3b322c] focus:outline-none transition-colors"
                    />

                    <label className="block text-xs uppercase tracking-wide mb-2">
                        Pesan
                    </label>
                    <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        placeholder="Tulis pesanmu..."
                        rows="4"
                        className="w-full border border-[#d4c9ae] px-3 py-2 mb-6 text-sm focus:border-[#3b322c] focus:outline-none transition-colors"
                    ></textarea>

                    {status === "success" && (
                        <p className="text-xs text-[#2d4a2b] bg-[#e2ecdf] border border-[#1C1410] p-3 mb-4">
                            Pesan terkirim! Kami akan segera menghubungi kamu.
                        </p>
                    )}
                    {status === "error" && (
                        <p className="text-xs text-[#5a2a1e] bg-[#f8e4de] border border-[#1C1410] p-3 mb-4">
                            Gagal mengirim: {errorMessage}
                        </p>
                    )}

                    <motion.button
                        type="submit"
                        disabled={submitting}
                        whileHover={{ scale: submitting ? 1 : 1.02 }}
                        whileTap={{ scale: submitting ? 1 : 0.98 }}
                        className="w-full bg-[#3b322c] text-[#F5EFE3] py-3 font-semibold text-sm disabled:opacity-60"
                    >
                        {submitting ? "MENGIRIM..." : "KIRIM PESAN"}
                    </motion.button>
                </motion.form>

                <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="bg-[#6B4832] rounded h-64 md:h-auto"
                ></motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
            >
                <h2 className="font-heading text-xl md:text-2xl font-bold text-[#3a2c29]">
                    Hubungi Langsung
                </h2>
            </motion.div>

            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{
                    show: { transition: { staggerChildren: 0.15 } }
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
            >
                {contactCards.map((card) => (
                    <motion.div
                        key={card.title}
                        variants={{
                            hidden: { opacity: 0, y: 40 },
                            show: { opacity: 1, y: 0 }
                        }}
                        whileHover={{ y: -8 }}
                        transition={{ duration: 0.5 }}
                        className="border-2 border-[#1C1410] p-5 md:p-6 text-center bg-[#F5EFE3]"
                    >
                        <h3 className="font-semibold mb-2 tracking-wide text-sm md:text-base">{card.title}</h3>
                        <p className="text-sm mb-1">{card.value}</p>
                        <p className="text-xs text-[#8a7a6d]">{card.note}</p>
                    </motion.div>
                ))}
            </motion.div>

            <div className="mt-14 md:mt-20">
                <FAQ />
            </div>
        </section>
    )
}

export default Contact
