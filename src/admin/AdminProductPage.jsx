import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { adminApi, getImageUrl, ApiError } from "./adminApi"
import { formatRupiah } from "../lib/format"

const emptyForm = {
    category_id: "",
    name: "",
    description: "",
    price: "",
    cost_price: "",
    stock: "",
    is_active: true,
    image: null,
}

const SPRING_GENTLE = { type: "spring", stiffness: 260, damping: 24 }

function AdminProductsPage() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [editingId, setEditingId] = useState(null)
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [existingImageUrl, setExistingImageUrl] = useState(null)
    const [newImagePreview, setNewImagePreview] = useState(null)
    const [categoryTouched, setCategoryTouched] = useState(false)
    const fileInputRef = useRef(null)
    const formTopRef = useRef(null)

    function load() {
        adminApi.getProducts().then((res) => setProducts(res.data ?? []))
        adminApi.getCategories().then((res) => setCategories(res.data ?? []))
    }

    useEffect(() => {
        load()
    }, [])

    // Preview lokal file gambar yang baru dipilih (belum diupload) — dilepas kalau ganti/ganti lagi
    useEffect(() => {
        if (!form.image) {
            setNewImagePreview(null)
            return
        }
        const url = URL.createObjectURL(form.image)
        setNewImagePreview(url)
        return () => URL.revokeObjectURL(url)
    }, [form.image])

    const marginInfo = useMemo(() => {
        const price = Number(form.price)
        const cost = Number(form.cost_price)
        if (!price || price <= 0 || !form.cost_price) return null
        const margin = price - cost
        const pct = Math.round((margin / price) * 100)
        return { margin, pct }
    }, [form.price, form.cost_price])

    const selectedCategoryName = useMemo(
        () => categories.find((c) => String(c.id) === String(form.category_id))?.name ?? null,
        [categories, form.category_id]
    )

    function handleEdit(p) {
        setEditingId(p.id)
        setForm({
            category_id: p.category_id,
            name: p.name,
            description: p.description ?? "",
            price: p.price,
            cost_price: p.cost_price ?? "",
            stock: p.stock,
            is_active: !!p.is_active,
            image: null,
        })
        setExistingImageUrl(p.image ? getImageUrl(p.image) : null)
        setCategoryTouched(false)
        formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    function resetForm() {
        setEditingId(null)
        setForm(emptyForm)
        setExistingImageUrl(null)
        setCategoryTouched(false)
    }

    function adjustStock(delta) {
        setForm((prev) => {
            const current = Number(prev.stock) || 0
            const next = Math.max(0, current + delta)
            return { ...prev, stock: String(next) }
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setCategoryTouched(true)
        if (!form.category_id) {
            formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            return
        }

        setSubmitting(true)
        setError(null)

        const fd = new FormData()
        fd.append("category_id", form.category_id)
        fd.append("name", form.name)
        fd.append("description", form.description)
        fd.append("price", form.price)
        fd.append("cost_price", form.cost_price || 0)
        fd.append("stock", form.stock)
        fd.append("is_active", form.is_active ? 1 : 0)
        if (form.image) fd.append("image", form.image)

        try {
            if (editingId) {
                await adminApi.updateProduct(editingId, fd)
            } else {
                await adminApi.createProduct(fd)
            }
            resetForm()
            load()
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Gagal menyimpan produk")
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDelete(id) {
        if (!confirm("Hapus produk ini?")) return
        try {
            await adminApi.deleteProduct(id)
            load()
        } catch (err) {
            alert(err instanceof ApiError ? err.message : "Gagal menghapus")
        }
    }

    const previewImage = newImagePreview ?? existingImageUrl

    return (
        <div className="bg-[#FDFBF7] text-[#231B17] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 min-h-full">
            <div ref={formTopRef} className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F9F3EB] border border-[#E6DDD2] text-[#C86D44] font-mono text-[11px] font-bold tracking-wider uppercase mb-3">
                        Katalog Admin
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17120F] tracking-tight mb-1.5">
                        {editingId ? "Ubah Menu" : "Tambah Menu Baru"}
                    </h1>
                    <p className="text-sm text-[#342822]/70">
                        Lengkapi formulir untuk {editingId ? "memperbarui" : "menerbitkan"} item ke menu pesanan
                        kasir &amp; storefront pelanggan.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 mb-10">
                    {/* Foto produk */}
                    <motion.section
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={SPRING_GENTLE}
                        className="bg-white rounded-2xl border border-[#E6DDD2] p-5 sm:p-6 shadow-[0_10px_30px_-8px_rgba(35,27,23,0.06)]"
                    >
                        <div className="flex items-start justify-between gap-3 mb-4">
                            <div>
                                <h2 className="font-bold text-[#17120F] mb-0.5">Foto &amp; Visual Produk</h2>
                                <p className="text-xs text-[#342822]/60">
                                    Tampilan utama pada kasir POS &amp; storefront pelanggan
                                </p>
                            </div>
                            <span className="shrink-0 text-[10px] font-mono px-2 py-1 rounded bg-[#F1E7DA] text-[#342822]/70 whitespace-nowrap">
                                JPG / PNG
                            </span>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => setForm({ ...form, image: e.target.files[0] ?? null })}
                            className="hidden"
                        />

                        {previewImage ? (
                            <div className="relative rounded-xl overflow-hidden border border-[#E6DDD2] aspect-[4/3] bg-[#F1E7DA]">
                                <img src={previewImage} alt="Pratinjau produk" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/95 backdrop-blur-sm text-xs font-semibold text-[#231B17] shadow-sm hover:bg-white transition-colors"
                                >
                                    <ImageIcon />
                                    Ganti Foto
                                </button>
                                {editingId && !form.image && (
                                    <span className="absolute top-3 left-3 px-2 py-1 rounded bg-[#17120F]/70 text-white text-[10px] font-mono">
                                        Foto tersimpan
                                    </span>
                                )}
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#E4D5C1] bg-[#F9F3EB]/60 py-10 hover:bg-[#F9F3EB] transition-colors"
                            >
                                <span className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#C86D44] shadow-sm">
                                    <ImageIcon />
                                </span>
                                <span className="text-sm font-semibold text-[#231B17]">Pilih Foto Menu</span>
                                <span className="text-xs text-[#342822]/60">Rasio 4:3 direkomendasikan</span>
                            </button>
                        )}
                    </motion.section>

                    {/* Informasi dasar */}
                    <motion.section
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...SPRING_GENTLE, delay: 0.05 }}
                        className="bg-white rounded-2xl border border-[#E6DDD2] p-5 sm:p-6 shadow-[0_10px_30px_-8px_rgba(35,27,23,0.06)] space-y-4"
                    >
                        <h2 className="font-bold text-[#17120F]">Informasi Dasar Menu</h2>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-[#342822]/70">
                                Nama Menu / Produk <span className="text-[#C86D44]">*</span>
                            </label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                                placeholder="mis. Cold Drip Senopati Reserve"
                                className="w-full rounded-xl border border-[#E6DDD2] bg-[#FDFBF7] px-4 py-3 text-sm focus:outline-none focus:border-[#C86D44] focus:ring-2 focus:ring-[#C86D44]/15 transition-shadow"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wide text-[#342822]/70">
                                    Kategori Menu <span className="text-[#C86D44]">*</span>
                                </label>
                                {categoryTouched && !form.category_id && (
                                    <span className="text-[11px] text-[#934825] font-semibold">Pilih salah satu</span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((c) => {
                                    const selected = String(form.category_id) === String(c.id)
                                    return (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => {
                                                setForm({ ...form, category_id: c.id })
                                                setCategoryTouched(true)
                                            }}
                                            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
                                                selected
                                                    ? "bg-[#17120F] border-[#17120F] text-white"
                                                    : `bg-white text-[#342822] hover:bg-[#F9F3EB] ${
                                                          categoryTouched && !form.category_id
                                                              ? "border-[#934825]/40"
                                                              : "border-[#E6DDD2]"
                                                      }`
                                            }`}
                                        >
                                            {c.name}
                                        </button>
                                    )
                                })}
                                {categories.length === 0 && (
                                    <span className="text-xs text-[#342822]/50 italic">
                                        Belum ada kategori — buat dulu di halaman Kategori.
                                    </span>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-[#342822]/70">
                                Deskripsi Singkat
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={3}
                                placeholder="Cerita singkat rasa, bahan, atau cara penyajian"
                                className="w-full rounded-xl border border-[#E6DDD2] bg-[#FDFBF7] px-4 py-3 text-sm focus:outline-none focus:border-[#C86D44] focus:ring-2 focus:ring-[#C86D44]/15 transition-shadow resize-none"
                            />
                            <span className="block text-right text-[11px] text-[#342822]/40 mt-1">
                                {form.description.length} karakter
                            </span>
                        </div>
                    </motion.section>

                    {/* Finansial & inventaris */}
                    <motion.section
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...SPRING_GENTLE, delay: 0.1 }}
                        className="bg-white rounded-2xl border border-[#E6DDD2] p-5 sm:p-6 shadow-[0_10px_30px_-8px_rgba(35,27,23,0.06)] space-y-4"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="font-bold text-[#17120F]">Finansial &amp; Inventaris</h2>
                            {marginInfo && (
                                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#F8ECE6] text-[#934825] font-semibold whitespace-nowrap">
                                    Margin {marginInfo.pct}% ({formatRupiah(marginInfo.margin)})
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-[#342822]/70">
                                    Harga Jual (Rp) <span className="text-[#C86D44]">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    required
                                    min="0"
                                    placeholder="45000"
                                    className="w-full rounded-xl border border-[#E6DDD2] bg-[#FDFBF7] px-4 py-3 text-sm focus:outline-none focus:border-[#C86D44] focus:ring-2 focus:ring-[#C86D44]/15 transition-shadow"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-[#342822]/70">
                                    Harga Modal / HPP (Rp)
                                </label>
                                <input
                                    type="number"
                                    value={form.cost_price}
                                    onChange={(e) => setForm({ ...form, cost_price: e.target.value })}
                                    min="0"
                                    placeholder="18000"
                                    className="w-full rounded-xl border border-[#E6DDD2] bg-[#FDFBF7] px-4 py-3 text-sm focus:outline-none focus:border-[#C86D44] focus:ring-2 focus:ring-[#C86D44]/15 transition-shadow"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-[#342822]/70">
                                Stok <span className="text-[#C86D44]">*</span>
                            </label>
                            <div className="inline-flex items-center gap-3 bg-[#F9F3EB] rounded-xl p-1.5">
                                <button
                                    type="button"
                                    onClick={() => adjustStock(-1)}
                                    className="w-10 h-10 rounded-lg bg-white border border-[#E6DDD2] flex items-center justify-center text-[#342822] hover:bg-[#F1E7DA] transition-colors shrink-0"
                                    aria-label="Kurangi stok"
                                >
                                    −
                                </button>
                                <input
                                    type="number"
                                    value={form.stock}
                                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                    required
                                    min="0"
                                    className="w-16 text-center bg-transparent text-sm font-semibold focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => adjustStock(1)}
                                    className="w-10 h-10 rounded-lg bg-white border border-[#E6DDD2] flex items-center justify-center text-[#342822] hover:bg-[#F1E7DA] transition-colors shrink-0"
                                    aria-label="Tambah stok"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <label className="flex items-center gap-3 pt-2 cursor-pointer">
                            <span className="relative inline-flex h-6 w-11 items-center shrink-0">
                                <input
                                    type="checkbox"
                                    checked={form.is_active}
                                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                    className="peer sr-only"
                                />
                                <span className="absolute inset-0 rounded-full bg-[#E6DDD2] peer-checked:bg-[#C86D44] transition-colors" />
                                <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                            </span>
                            <span className="text-sm text-[#231B17]">
                                Tampilkan di menu &amp; POS kasir
                                <span className="block text-xs text-[#342822]/60">
                                    Nonaktifkan untuk menyembunyikan sementara tanpa menghapus data
                                </span>
                            </span>
                        </label>
                    </motion.section>

                    {/* Live preview — dari state form asli, bukan dummy */}
                    {(form.name || previewImage) && (
                        <motion.section
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...SPRING_GENTLE, delay: 0.15 }}
                            className="bg-[#F9F3EB] rounded-2xl border border-[#E6DDD2] p-5 sm:p-6"
                        >
                            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#342822]/50 mb-3">
                                Pratinjau Tampilan Pelanggan
                            </h2>
                            <div className="flex items-center gap-3 bg-white rounded-xl border border-[#E6DDD2] p-3">
                                <div className="w-16 h-16 rounded-lg bg-[#F1E7DA] overflow-hidden shrink-0">
                                    {previewImage && (
                                        <img src={previewImage} alt="" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    {selectedCategoryName && (
                                        <span className="text-[10px] font-mono uppercase text-[#C86D44] font-bold">
                                            {selectedCategoryName}
                                        </span>
                                    )}
                                    <h3 className="font-bold text-sm text-[#17120F] truncate">
                                        {form.name || "Nama menu..."}
                                    </h3>
                                    <span className="font-mono font-bold text-sm text-[#17120F]">
                                        {form.price ? formatRupiah(form.price) : "Rp 0"}
                                    </span>
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {error && (
                        <p className="text-xs text-[#934825] bg-[#F8ECE6] border border-[#E6DDD2] rounded-xl p-3">
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 sticky bottom-4">
                        <motion.button
                            type="submit"
                            disabled={submitting}
                            whileTap={{ scale: submitting ? 1 : 0.98 }}
                            transition={SPRING_GENTLE}
                            className="flex-1 py-3.5 rounded-xl bg-[#C86D44] hover:bg-[#B55E36] text-white text-sm font-bold uppercase tracking-wider transition-colors shadow-[0_10px_24px_-6px_rgba(200,109,68,0.4)] disabled:opacity-60"
                        >
                            {submitting ? "Menyimpan..." : editingId ? "Update Produk" : "Simpan & Terbitkan Menu"}
                        </motion.button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="py-3.5 px-6 rounded-xl border border-[#E6DDD2] bg-white text-[#342822] text-sm font-semibold hover:bg-[#F9F3EB] transition-colors"
                            >
                                Batal Edit
                            </button>
                        )}
                    </div>
                </form>

                {/* Daftar produk */}
                <div className="mb-4">
                    <h2 className="text-lg font-bold text-[#17120F]">Daftar Produk</h2>
                    <p className="text-xs text-[#342822]/60">{products.length} produk terdaftar</p>
                </div>

                {/* Mobile & tablet: card list */}
                <div className="flex flex-col gap-3 lg:hidden mb-10">
                    <AnimatePresence>
                        {products.map((p) => (
                            <motion.div
                                key={p.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-white rounded-2xl border border-[#E6DDD2] p-4 shadow-[0_10px_30px_-8px_rgba(35,27,23,0.06)] flex gap-3"
                            >
                                <div className="w-14 h-14 rounded-lg bg-[#F1E7DA] overflow-hidden shrink-0">
                                    {p.image && (
                                        <img src={getImageUrl(p.image)} alt="" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-sm text-[#17120F] truncate">{p.name}</h3>
                                            <span className="text-xs text-[#342822]/60">{p.category?.name ?? "-"}</span>
                                        </div>
                                        <span
                                            className={`shrink-0 text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                                                p.is_active ? "bg-[#E7F3EA] text-emerald-700" : "bg-[#F1E7DA] text-[#342822]/60"
                                            }`}
                                        >
                                            {p.is_active ? "Aktif" : "Nonaktif"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="font-mono font-bold text-sm text-[#17120F]">
                                            {formatRupiah(p.price)}
                                        </span>
                                        <span
                                            className={`text-xs font-mono ${
                                                p.stock <= 5 ? "text-[#934825] font-bold" : "text-[#342822]/60"
                                            }`}
                                        >
                                            Stok {p.stock}
                                        </span>
                                    </div>
                                    <div className="flex gap-4 mt-2.5 pt-2.5 border-t border-[#E6DDD2]">
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="text-xs font-semibold text-[#C86D44]"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="text-xs font-semibold text-[#934825]"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {products.length === 0 && (
                        <p className="text-center text-sm text-[#342822]/60 py-8">Belum ada produk.</p>
                    )}
                </div>

                {/* Desktop: table */}
                <div className="hidden lg:block bg-white rounded-2xl border border-[#E6DDD2] shadow-[0_10px_30px_-8px_rgba(35,27,23,0.06)] overflow-hidden mb-10">
                    <table className="w-full text-sm">
                        <thead className="bg-[#F9F3EB] text-[#342822]">
                            <tr>
                                <th className="text-left p-4 font-semibold text-xs uppercase tracking-wide">Produk</th>
                                <th className="text-left p-4 font-semibold text-xs uppercase tracking-wide">Kategori</th>
                                <th className="text-right p-4 font-semibold text-xs uppercase tracking-wide">Harga Jual</th>
                                <th className="text-right p-4 font-semibold text-xs uppercase tracking-wide">Modal</th>
                                <th className="text-right p-4 font-semibold text-xs uppercase tracking-wide">Stok</th>
                                <th className="text-center p-4 font-semibold text-xs uppercase tracking-wide">Status</th>
                                <th className="text-right p-4 font-semibold text-xs uppercase tracking-wide">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id} className="border-t border-[#E6DDD2] hover:bg-[#FDFBF7] transition-colors">
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-[#F1E7DA] overflow-hidden shrink-0">
                                            {p.image && (
                                                <img src={getImageUrl(p.image)} alt="" className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <span className="font-medium text-[#17120F]">{p.name}</span>
                                    </td>
                                    <td className="p-4 text-[#342822]/70">{p.category?.name ?? "-"}</td>
                                    <td className="p-4 text-right font-mono">{formatRupiah(p.price)}</td>
                                    <td className="p-4 text-right font-mono text-[#342822]/70">
                                        {formatRupiah(p.cost_price ?? 0)}
                                    </td>
                                    <td className={`p-4 text-right font-mono ${p.stock <= 5 ? "text-[#934825] font-bold" : ""}`}>
                                        {p.stock}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                p.is_active ? "bg-[#E7F3EA] text-emerald-700" : "bg-[#F1E7DA] text-[#342822]/60"
                                            }`}
                                        >
                                            {p.is_active ? "Aktif" : "Nonaktif"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right whitespace-nowrap">
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="text-xs font-semibold text-[#C86D44] mr-4 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="text-xs font-semibold text-[#934825] hover:underline"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-[#342822]/60">
                                        Belum ada produk.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function ImageIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
        </svg>
    )
}

export default AdminProductsPage