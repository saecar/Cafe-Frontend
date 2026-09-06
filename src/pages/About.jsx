import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

/**
 * About / "Tentang" page — new page, not previously in the project.
 *
 * Note: the source design also included its own top ticker and a bottom
 * mobile tab bar. Both were left out because the site's shared <Navbar />
 * already renders a ticker + nav on every page. Everything from the
 * editorial header down is included, restyled with the site's own accent
 * colors (#16120e / #ff6239 / #feb47b / #ffd56b) instead of the design's
 * original terracotta palette, to stay consistent with the rest of the app.
 */

const pillars = [
    {
        icon: "🌱",
        title: "Direct-Trade Micro-Lot",
        desc: "Biji kopi diperoleh langsung tanpa perantara tengkulak dari mitra pekebun di Gayo, Ciwidey, dan Toraja Sapan.",
    },
    {
        icon: "🥐",
        title: "Panggang Subuh & Mentega Murni",
        desc: "Ragi alami fermentasi 36 jam, dipanggang segar setiap pukul 06:00 pagi tanpa pengawet sintesis sedikitpun.",
    },
    {
        icon: "🔬",
        title: "Presisi Ekstraksi Ilmiah",
        desc: "Air mineral tersertifikasi dengan TDS seimbang (130 PPM) demi membuka spektrum rasa buah tropis optimal.",
    },
]

const roastProfiles = [
    {
        name: "Gayo Wine Micro-Lot (Anaerobic)",
        tag: "Light-Medium",
        width: 85,
        notes: "Notes: Fermented Berries, Dark Honey",
        elevation: "Elevation: 1,650 MASL",
    },
    {
        name: "Ciwidey Natural Kamojang",
        tag: "Light Roast",
        width: 65,
        notes: "Notes: Sweet Peach, Jasmine, Citrus",
        elevation: "Elevation: 1,500 MASL",
    },
    {
        name: "Toraja Sapan Washed Reserve",
        tag: "Medium Roast",
        width: 78,
        notes: "Notes: Cacao Nibs, Nutmeg, Herbal Clean",
        elevation: "Elevation: 1,800 MASL",
    },
]

const team = [
    {
        role: "HEAD ROASTER",
        name: "Reza Ardiansyah",
        quote: "\"Roasting biji kopi bukan sekadar memanaskan; kami mencari titik manis rahasia tanaman nusantara.\"",
        credential: "9 Tahun Riset Kopi Khusus",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBxYc5TYRmcfOjjSNukKk2tU6IuSKX0tCN3h71zThT0Mz7jGGfA4UKcvffQZRxSwiJFeplY3F-gHHhpZ64KVe6PzeVcbodjRvsOxAhrlJhX7zHNl68d5vc34mcFkycV_gnUzsdGVqO3HNp7FmpU_XYdpsQuD90b-Fm_PQ8kpw_IFET2arhChrMA3-iod6xDRX7WX8Nv1F4QNPrA_ZumL1Jyg6b_GGoOMyTx3pHtvz92-9mCylsQ4YK0",
    },
    {
        role: "EXECUTIVE BAKER",
        name: "Clara Natasya",
        quote: "\"Sourdough kami hidup dari ragi liar lokal. Waktu dan fermentasi lambat tidak pernah bisa dibohongi.\"",
        credential: "Le Cordon Bleu Alum",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDtCpvnejio5rGPwV4xU8NeYeMMtxtKGsZlVol_4uodh6QxrC3NWDJshVDUmYCNeXXbS-Ou4Yei74ly8QdCkAOtqAe8aCnm4nrUUfZ5FKL42JVBsXp0n-4cmhQPDaHvACkcRUa-tfNfguTH1uJhOlV2iq3sf55xrJKDdCSfI7k3wxA-_X40Os5Fz85LJ3SNVOPAtQRCym57AyJI_Svh7r5WJFMlQD6GBkQPMqSkPs7NlXD7jgRWEvUZ",
    },
    {
        role: "HEAD BARISTA",
        name: "Dimas Prasetyo",
        quote: "\"Bar kami rendah sengaja agar Anda bisa berbincang, menyaksikan seduhan, dan merasa di rumah.\"",
        credential: "Juara Brewers Cup Regional",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBCLGzx8CkW5ikgQ_MCYfQ9SLKrBSg_NiC9sUXO-UIos0ZAtcFzYiMr2I3V7bvfBQ6c2AixZiWEU460HxR3HJd7762eXYXv51LfqA1rJsJwjhYHtzugF47OgoAH-Zv4ZTgU-sxKD6VbWjF7Zs2p728BhnCZjEvlUXPDhARDg5xsYqpikBgRoJYZzVMCsVzxmutKJFqebTYxOFLMhzpgc54cmEeVaKEMe4h6OH4EIIsU0d1DwkxagUYh",
    },
]

const areas = [
    { label: "AREA 01", title: "Open Brew Bar", desc: "Tasting langsung & diskusi seduh bersama barista." },
    { label: "AREA 02", title: "Courtyard Garden", desc: "Sirkulasi udara terbuka, ramah hewani (pet-friendly)." },
    { label: "AREA 03", title: "Mezzanine Focus Pods", desc: "Colokan di setiap meja & Wi-Fi serat optik 100 Mbps." },
    { label: "AREA 04", title: "Roasting Lab", desc: "Ruang kaca kurasi cupping & pengemasan harian." },
]

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
}

function About() {
    const navigate = useNavigate()

    return (
        <section className="min-h-screen bg-[#faf8f5] text-[#16120e]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-12 flex flex-col gap-8">
                {/* Editorial header */}
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-[#ffd56b] text-[#16120e] px-2 py-0.5 rounded font-mono text-[11px] tracking-wider uppercase font-bold">
                            EDISI VOL. 02
                        </span>
                        <span className="text-stone-500 font-mono text-[11px] tracking-widest uppercase">
                            TENTANG MR. R ARCHIVE
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-[1.05] text-[#16120e]">
                        Kisah di Balik <br />
                        <span className="text-[#ff6239] italic font-light">Setiap Tetes &amp; Gigitan.</span>
                    </h1>
                    <p className="text-sm md:text-base text-stone-600 max-w-xl">
                        Manifesto tentang dedikasi rasa, keberlanjutan petani Nusantara, dan ruang temu hangat di
                        jantung Senopati.
                    </p>
                </motion.div>

                {/* Hero visual */}
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
                    <div className="relative w-full rounded-2xl overflow-hidden bg-[#16120e] shadow-md">
                        <div
                            className="bg-cover bg-center w-full h-72 md:h-96 flex flex-col justify-between p-4 md:p-6 relative"
                            style={{
                                backgroundImage:
                                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBh_b0XqTkgSNi4FuUJH2njPIRv7X45HhB9EEs7nYQFCQeplmj47YJz7gSvT3asZzPiOp6wHer9WxhHlNi1r8gz_FBvbLnc2LygO7hlJJIDlvFuIi-6lo_B6pKt2YaQrbzRXfhGAbEH8z_dOUenV-B9paSzZUKSF16FkIWCrWmhs2MDITiZaqSKjzXc6mq0dGYC_ZT_-kiQ3O1b4K410Bc9IL6h5xcWL82m1vnXnkVSfDITtKb1UqSR')",
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-[#16120e]/90 via-[#16120e]/30 to-transparent" />
                            <div className="relative z-10 flex justify-between items-start gap-2">
                                <span className="bg-[#faf8f5]/90 backdrop-blur-md text-[#16120e] font-mono text-[11px] uppercase px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6239]" />
                                    MANUAL BREW BAR &amp; ROASTERY
                                </span>
                                <span className="bg-[#16120e]/80 backdrop-blur-md text-[#faf8f5] font-mono text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap">
                                    ★ 4.9 (2,400+ REVIEWS)
                                </span>
                            </div>
                            <div className="relative z-10 flex flex-col gap-1 text-[#faf8f5]">
                                <p className="text-lg md:text-xl italic text-[#feb47b] font-light leading-snug">
                                    "Setiap cangkir, setiap gigitan, setiap detik berarti."
                                </p>
                                <div className="flex items-center gap-2 mt-1 font-mono text-[11px] uppercase tracking-wider text-stone-300">
                                    <span>ORIGIN ARCHIVE • SENOPATI BATCH</span>
                                    <span className="text-[#feb47b]">•</span>
                                    <span className="text-[#feb47b]">JAKARTA SELATAN</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick metrics */}
                        <div className="bg-[#f3ede5] px-4 py-4 flex items-center justify-around text-center">
                            <div>
                                <span className="block text-lg md:text-xl font-black text-[#16120e]">100%</span>
                                <span className="font-mono text-[10px] text-stone-500 uppercase">Arabika Nusantara</span>
                            </div>
                            <div className="w-px h-8 bg-stone-300" />
                            <div>
                                <span className="block text-lg md:text-xl font-black text-[#16120e]">130 PPM</span>
                                <span className="font-mono text-[10px] text-stone-500 uppercase">Water Chemistry</span>
                            </div>
                            <div className="w-px h-8 bg-stone-300" />
                            <div>
                                <span className="block text-lg md:text-xl font-black text-[#ff6239]">06:00</span>
                                <span className="font-mono text-[10px] text-stone-500 uppercase">Daily Bakehouse</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Philosophy card */}
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="bg-white rounded-2xl p-5 md:p-8 shadow-sm flex flex-col gap-4"
                >
                    <span className="self-start bg-[#ff6239] text-[#16120e] px-2 py-0.5 rounded font-mono text-[11px] uppercase tracking-wider font-bold">
                        01 / FILOSOFI KAMI
                    </span>
                    <h2 className="text-xl md:text-2xl font-black leading-tight text-[#16120e]">
                        BUKAN SEKADAR KEDAI KOPI BIASA, TAPI SEBUAH{" "}
                        <span className="text-[#ff6239] underline decoration-[#feb47b] underline-offset-4">RUMAH IDE</span>.
                    </h2>
                    <p className="text-sm md:text-base text-stone-600 leading-relaxed">
                        Mr. R Coffee &amp; Eatery didirikan sebagai antitesis terhadap kopi seragam instan yang
                        terburu-buru. Kami memperlakukan kopi sebagai medium bercerita: menjembatani keringat petani
                        di lereng pegunungan Indonesia dengan obrolan hangat kaum urban di sudut Senopati.
                    </p>
                    <div className="flex flex-col gap-3 mt-1">
                        {pillars.map((p) => (
                            <div key={p.title} className="bg-[#faf8f5] rounded-xl p-3 flex items-start gap-3 shadow-sm">
                                <div className="w-10 h-10 rounded-full bg-[#ffd56b] flex items-center justify-center text-lg shrink-0">
                                    {p.icon}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-[#16120e]">{p.title}</h3>
                                    <p className="text-xs text-stone-600 mt-0.5">{p.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Roasting & science */}
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="bg-[#16120e] text-[#faf8f5] rounded-2xl p-5 md:p-8 shadow-lg flex flex-col gap-4"
                >
                    <div className="flex justify-between items-start gap-2">
                        <div>
                            <span className="text-[#feb47b] font-mono text-[11px] tracking-widest uppercase block mb-1">
                                02 / SANGRAI &amp; PRESISI
                            </span>
                            <h2 className="text-xl md:text-2xl font-black">PROFIL SEDUHAN KURASI</h2>
                        </div>
                        <span className="text-[#ff6239] text-2xl">🔥</span>
                    </div>
                    <p className="text-sm text-stone-300 leading-relaxed">
                        Setiap batch disangrai menggunakan mesin drum buatan tangan dengan temperatur terprogram
                        secara mikro untuk mempertahankan sweetness dan karakter asam buah alami.
                    </p>
                    <div className="flex flex-col gap-2.5">
                        {roastProfiles.map((r) => (
                            <div key={r.name} className="bg-[#231812] p-3 rounded-xl flex flex-col gap-1.5">
                                <div className="flex justify-between items-center gap-2">
                                    <span className="text-sm font-semibold text-[#faf8f5]">{r.name}</span>
                                    <span className="bg-[#ff6239] text-[#16120e] px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap">
                                        {r.tag}
                                    </span>
                                </div>
                                <div className="w-full bg-stone-700 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-[#ffd56b] h-full rounded-full" style={{ width: `${r.width}%` }} />
                                </div>
                                <div className="flex items-center justify-between text-stone-400 text-[11px] flex-wrap gap-1">
                                    <span>{r.notes}</span>
                                    <span>{r.elevation}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Team */}
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                            <span className="text-[#ff6239] font-mono text-[11px] uppercase tracking-wider block">
                                03 / DEDIKASI MANUSIA
                            </span>
                            <h2 className="text-xl md:text-2xl font-black text-[#16120e]">ORANG-ORANG DI BALIK MEJA</h2>
                        </div>
                        <span className="font-mono text-[11px] text-stone-500">3 DARI 14 ARTISAN</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {team.map((person) => (
                            <div key={person.name} className="bg-[#f3ede5] rounded-2xl p-3 flex items-center gap-4 shadow-sm">
                                <div
                                    className="bg-cover bg-center w-24 h-28 rounded-xl shrink-0"
                                    style={{ backgroundImage: `url('${person.image}')` }}
                                />
                                <div className="flex flex-col min-w-0">
                                    <span className="font-mono text-[11px] text-[#ff6239] font-bold uppercase">{person.role}</span>
                                    <h3 className="text-base font-bold text-[#16120e] truncate">{person.name}</h3>
                                    <p className="text-xs text-stone-600 italic mt-1 line-clamp-2">{person.quote}</p>
                                    <span className="text-[11px] text-stone-500 mt-1.5 font-medium">{person.credential}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Architecture */}
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="bg-[#ede7dd] rounded-2xl p-5 md:p-8 shadow-sm flex flex-col gap-3"
                >
                    <span className="self-start bg-[#16120e] text-[#faf8f5] px-2 py-0.5 rounded font-mono text-[11px] uppercase tracking-wider font-bold">
                        04 / ARSITEKTUR RUANG
                    </span>
                    <h2 className="text-xl md:text-2xl font-black text-[#16120e]">
                        WARM BRUTALISM &amp; RUANG TEMU INDOOR GARDEN.
                    </h2>
                    <p className="text-sm text-stone-600">
                        Memadukan material beton ekspos, kayu jati daur ulang yang hangat, skylight alami, serta
                        courtyard tanaman pakis yang menenangkan di tengah kesibukan Jakarta Selatan.
                    </p>
                    <div
                        className="w-full h-52 rounded-xl shadow-md relative overflow-hidden flex items-end p-3 bg-cover bg-center"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBPRi8jCxsGxjAk_lMw-REuRb8nrzXecrlCpKQ1q5ATJOD8k_Qzxx7K1DRSTe2vnqWrmJYOjOs0MguJcF0TsPsXvvJfDSR1GaeMN4OerEtAbDmp30kj7mHNYGnvZtnZgJI_M0mrJQU2FjyS8GTlnMAPyWtng8Yz4PN_Ngi8kpkHRPb7dbtiSF46LkS6yql2cT25OPHet1Nm2FUbo8AsJ2HV9keFTtcqbwqOZ2aFuD1NllpK8rbaBElT')",
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-[#16120e]/70 via-transparent to-transparent" />
                        <span className="relative z-10 font-mono text-[11px] text-[#faf8f5] uppercase tracking-wider bg-[#16120e]/70 backdrop-blur-sm px-2.5 py-1 rounded">
                            SENOPATI FLAGSHIP STOREFRONT &amp; COURTYARD
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                        {areas.map((area) => (
                            <div key={area.label} className="bg-white p-3 rounded-xl">
                                <span className="font-mono text-[10px] text-[#ff6239] font-bold block">{area.label}</span>
                                <span className="text-sm font-semibold text-[#16120e] block">{area.title}</span>
                                <p className="text-xs text-stone-500 mt-0.5">{area.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Ethics & map */}
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="bg-[#f3ede5] rounded-2xl p-5 md:p-6 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-[#16120e]">Etika Petani &amp; Bumi</h3>
                        <span className="text-[#ff6239] text-xl">🌿</span>
                    </div>
                    <p className="text-sm text-stone-600 mb-3">
                        Kami membayar 35% di atas standar harga komoditas pasar langsung ke rekening koperasi petani
                        kecil di Takengon dan Pangalengan demi kesinambungan bibit warisan.
                    </p>
                    <div
                        className="w-full h-40 rounded-xl relative flex items-end p-2 overflow-hidden bg-cover bg-center bg-[#ede7dd]"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBNvdGLwXBr4OxEKNYCltihgf3eBf6M-1vqj8Zn2z6glVn5ZzsQ_YoWxa3qOMPrUEoSjr9HIM5j-Brwxdre_kYbfYFyKL7gIQCeueLWyCJaEi4RNVKRUcWHMB7NJzg1CpGBzUC-pC15FRZX0KHN4hr8Sj9qAaaq2dt8e5UpxVclquXTVZqMlU6-BEW_HVRqlxij2JuXIGGR0QeS54KHqs0FSRVwWFlG3BggAgNB281JKfAGsYnfwXer')",
                        }}
                    >
                        <div className="absolute inset-0 bg-[#16120e]/20 backdrop-blur-[1px]" />
                        <div className="relative z-10 bg-[#faf8f5]/95 backdrop-blur-md rounded-lg p-2 flex items-center gap-2 shadow-sm w-full">
                            <span className="text-[#ff6239] text-lg">📍</span>
                            <div className="min-w-0 flex-1">
                                <span className="block text-xs text-[#16120e] font-bold truncate">
                                    Mr. R Flagship &amp; Roastery
                                </span>
                                <span className="block text-[11px] text-stone-500 truncate">
                                    Jl. Senopati Raya No. 42, Kebayoran Baru
                                </span>
                            </div>
                            <a
                                href="https://maps.google.com"
                                target="_blank"
                                rel="noreferrer"
                                className="bg-[#16120e] text-[#faf8f5] px-2.5 py-1 rounded text-[11px] font-semibold shrink-0"
                            >
                                Peta
                            </a>
                        </div>
                    </div>
                </motion.div>

                {/* Big statement */}
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="py-6 text-center flex flex-col items-center gap-2"
                >
                    <span className="w-10 h-0.5 bg-[#ff6239] mb-1" />
                    <p className="text-2xl md:text-4xl font-black text-[#16120e] uppercase tracking-tight leading-none">
                        EVERY CUP. EVERY BITE.
                        <br />
                        <span className="text-[#ff6239] italic font-light">EVERY MOMENT MATTERS.</span>
                    </p>
                    <p className="text-sm text-stone-600 max-w-xs mt-1">
                        Datanglah untuk kopi pagimu, tinggallah untuk percakapan senjamu. Pintu kami selalu terbuka.
                    </p>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="bg-[#ff6239] text-[#16120e] rounded-3xl p-5 md:p-8 shadow-xl relative overflow-hidden flex flex-col gap-4"
                >
                    <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-[#feb47b]/40 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col gap-1">
                        <span className="font-mono text-[11px] uppercase tracking-widest text-[#16120e]/70">
                            SIAP UNTUK CANGKIR BERIKUTNYA?
                        </span>
                        <h2 className="text-xl md:text-2xl font-black">Singgah ke Bar Kami atau Pesan Online</h2>
                        <p className="text-sm text-[#16120e]/80 mt-1">
                            Koleksi biji kopi freshly roasted dan sajian roti hangat pagi ini telah siap disajikan
                            untukmu.
                        </p>
                    </div>
                    <div className="relative z-10 flex flex-col gap-2.5">
                        <button
                            onClick={() => navigate("/menu")}
                            className="w-full h-12 bg-[#16120e] text-[#faf8f5] rounded-2xl font-mono text-sm font-bold uppercase flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
                        >
                            🍽️ Eksplorasi Sajian Menu Kami
                        </button>
                        <a
                            href="https://wa.me/6281317381863?text=Halo%20Mr.%20R%20Coffee%2C%20saya%20ingin%20reservasi%20meja%20di%20Senopati."
                            target="_blank"
                            rel="noreferrer"
                            className="w-full h-12 bg-[#faf8f5] text-[#16120e] rounded-2xl font-mono text-sm font-bold uppercase flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform text-center"
                        >
                            💬 Hubungi Concierge WhatsApp
                        </a>
                    </div>
                    <div className="relative z-10 pt-1 flex items-center justify-between text-[#16120e]/80 font-mono text-[11px] flex-wrap gap-1">
                        <span>Senin - Jumat: 10:00 - 00:00 WIB</span>
                        <span>Sabtu - Minggu: 08:00 - 23:00 WIB</span>
                    </div>
                </motion.div>

                {/* Footer note */}
                <div className="pb-4 text-center flex flex-col items-center gap-1 text-stone-500 font-mono text-[11px]">
                    <div className="flex items-center gap-1 text-[#16120e] font-bold">
                        ☕ MR. R ARTISAN COLLECTIVE
                    </div>
                    <span>Senopati Batch #042 • Hak Cipta © {new Date().getFullYear()}</span>
                    <span className="text-[10px] text-stone-400 mt-1 tracking-wider uppercase">
                        Designed with Radical Warm Editorial Attitude
                    </span>
                </div>
            </div>
        </section>
    )
}

export default About