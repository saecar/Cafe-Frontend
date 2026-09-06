import { useState } from "react"
import { motion } from "framer-motion"
import FAQ from "../components/FAQ"
import { api } from "../lib/api"

const contactCards = [
    { title: "WHATSAPP", value: "+62 812 3456 7890", note: "Pesan langsung ke Bunda", tag: "bg-[#ff6239]" },
    { title: "EMAIL", value: "hello@mrrcoffee.com", note: "Untuk kerja sama", tag: "bg-[#feb47b]" },
    { title: "INSTAGRAM", value: "@mrrcoffee", note: "Ikuti keseharian kami", tag: "bg-[#ffd56b]" },
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
        <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-[#faf8f5] text-[#16120e] min-h-screen overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-10 md:mb-16"
                >
                    <span className="font-mono text-xs font-black uppercase tracking-widest text-[#ff6239] bg-[#16120e] px-2.5 py-1 inline-block shadow-[3px_3px_0px_#16120e] mb-4">
                        HUBUNGI KAMI
                    </span>
                    <h1 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight text-[#16120e] mb-3">
                        Get In Touch
                    </h1>
                    <p className="text-sm md:text-base font-mono text-stone-600">
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
                        className="border-4 border-[#16120e] p-5 md:p-8 bg-[#faf8f5] shadow-[10px_10px_0px_#16120e]"
                    >
                        <h2 className="font-display font-black text-xl md:text-2xl uppercase mb-2 text-[#16120e]">
                            Kirim Pesan
                        </h2>
                        <p className="text-xs md:text-sm font-mono text-stone-600 mb-6">Isi formulir di bawah ini.</p>

                        <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-2 text-stone-600">
                            Nama
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="Nama kamu"
                            className="w-full border-2 border-[#16120e] bg-[#faf8f5] px-3 py-2.5 mb-4 text-sm font-mono focus:border-[#ff6239] focus:outline-none transition-colors"
                        />

                        <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-2 text-stone-600">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="email@kamu.com"
                            className="w-full border-2 border-[#16120e] bg-[#faf8f5] px-3 py-2.5 mb-4 text-sm font-mono focus:border-[#ff6239] focus:outline-none transition-colors"
                        />

                        <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-2 text-stone-600">
                            No. HP (opsional)
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="08xxxxxxxxxx"
                            className="w-full border-2 border-[#16120e] bg-[#faf8f5] px-3 py-2.5 mb-4 text-sm font-mono focus:border-[#ff6239] focus:outline-none transition-colors"
                        />

                        <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-2 text-stone-600">
                            Pesan
                        </label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            placeholder="Tulis pesanmu..."
                            rows="4"
                            className="w-full border-2 border-[#16120e] bg-[#faf8f5] px-3 py-2.5 mb-6 text-sm font-mono focus:border-[#ff6239] focus:outline-none transition-colors"
                        ></textarea>

                        {status === "success" && (
                            <p className="text-xs font-mono text-[#16120e] bg-[#ffd56b] border-2 border-[#16120e] p-3 mb-4 shadow-[3px_3px_0px_#16120e]">
                                Pesan terkirim! Kami akan segera menghubungi kamu.
                            </p>
                        )}
                        {status === "error" && (
                            <p className="text-xs font-mono text-[#16120e] bg-[#ffdad6] border-2 border-[#16120e] p-3 mb-4 shadow-[3px_3px_0px_#16120e]">
                                Gagal mengirim: {errorMessage}
                            </p>
                        )}

                        <motion.button
                            type="submit"
                            disabled={submitting}
                            whileHover={{ scale: submitting ? 1 : 1.02 }}
                            whileTap={{ scale: submitting ? 1 : 0.98 }}
                            className="w-full bg-[#16120e] text-[#faf8f5] py-3.5 font-mono font-black uppercase text-sm border-2 border-[#16120e] shadow-[3px_3px_0px_#16120e] hover:bg-[#ff6239] hover:text-[#16120e] transition-all disabled:opacity-60"
                        >
                            {submitting ? "MENGIRIM..." : "KIRIM PESAN"}
                        </motion.button>
                    </motion.form>

                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="border-4 border-[#16120e] bg-[#16120e] h-64 md:h-auto shadow-[10px_10px_0px_#ff6239] flex items-center justify-center"
                    >
                        <span className="font-mono text-xs text-stone-500 uppercase tracking-widest">Peta / Foto Lokasi</span>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <h2 className="font-display text-2xl md:text-3xl font-black uppercase text-[#16120e]">
                        Hubungi Langsung
                    </h2>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={{
                        show: { transition: { staggerChildren: 0.15 } },
                    }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
                >
                    {contactCards.map((card) => (
                        <motion.div
                            key={card.title}
                            variants={{
                                hidden: { opacity: 0, y: 40 },
                                show: { opacity: 1, y: 0 },
                            }}
                            whileHover={{ y: -6 }}
                            transition={{ duration: 0.5 }}
                            className="border-4 border-[#16120e] p-5 md:p-6 text-center bg-[#faf8f5] shadow-[6px_6px_0px_#16120e]"
                        >
                            <span
                                className={`inline-block ${card.tag} text-[#16120e] font-mono text-[10px] font-black uppercase px-2 py-1 border-2 border-[#16120e] mb-3`}
                            >
                                {card.title}
                            </span>
                            <p className="font-display font-bold text-[#16120e] text-base mb-1">{card.value}</p>
                            <p className="text-xs font-mono text-stone-600">{card.note}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="mt-14 md:mt-20">
                    <FAQ />
                </div>
            </div>
        </section>
    )
}

export default Contact