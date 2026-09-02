import { useEffect, useState } from "react"
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

function AdminProductsPage() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [editingId, setEditingId] = useState(null)
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    function load() {
        adminApi.getProducts().then((res) => setProducts(res.data ?? []))
        adminApi.getCategories().then((res) => setCategories(res.data ?? []))
    }

    useEffect(() => {
        load()
    }, [])

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
    }

    function resetForm() {
        setEditingId(null)
        setForm(emptyForm)
    }

    async function handleSubmit(e) {
        e.preventDefault()
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

    return (
        <div>
            <h1 className="font-heading text-2xl font-bold text-[#3a2c29] mb-6">Produk</h1>

            <form
                onSubmit={handleSubmit}
                className="border-2 border-[#1C1410] p-5 mb-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <div>
                    <label className="block text-xs uppercase tracking-wide mb-1">Kategori</label>
                    <select
                        value={form.category_id}
                        onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                        required
                        className="w-full border border-[#d4c9ae] px-3 py-2 text-sm"
                    >
                        <option value="">Pilih kategori</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wide mb-1">Nama Produk</label>
                    <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="w-full border border-[#d4c9ae] px-3 py-2 text-sm"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide mb-1">Deskripsi</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={2}
                        className="w-full border border-[#d4c9ae] px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wide mb-1">Harga Jual</label>
                    <input
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        required
                        min="0"
                        className="w-full border border-[#d4c9ae] px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wide mb-1">Harga Modal</label>
                    <input
                        type="number"
                        value={form.cost_price}
                        onChange={(e) => setForm({ ...form, cost_price: e.target.value })}
                        min="0"
                        className="w-full border border-[#d4c9ae] px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wide mb-1">Stok</label>
                    <input
                        type="number"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                        required
                        min="0"
                        className="w-full border border-[#d4c9ae] px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wide mb-1">
                        Gambar {editingId && "(kosongkan jika tidak ganti)"}
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                        className="w-full text-sm"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="is_active"
                        checked={form.is_active}
                        onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    />
                    <label htmlFor="is_active" className="text-sm">
                        Aktif / ditampilkan di menu
                    </label>
                </div>

                {error && <p className="md:col-span-2 text-xs text-[#5a2a1e]">{error}</p>}

                <div className="md:col-span-2 flex gap-3">
                    <button
                        disabled={submitting}
                        className="bg-[#3b322c] text-[#F5EFE3] px-5 py-2 text-sm font-semibold disabled:opacity-60"
                    >
                        {submitting ? "Menyimpan..." : editingId ? "Update Produk" : "Tambah Produk"}
                    </button>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="border-2 border-[#1C1410] px-5 py-2 text-sm">
                            Batal Edit
                        </button>
                    )}
                </div>
            </form>

            <table className="w-full text-sm border-2 border-[#1C1410] bg-white">
                <thead className="bg-[#3b322c] text-[#F5EFE3]">
                    <tr>
                        <th className="text-left p-3">Produk</th>
                        <th className="text-left p-3">Kategori</th>
                        <th className="text-right p-3">Harga Jual</th>
                        <th className="text-right p-3">Modal</th>
                        <th className="text-right p-3">Stok</th>
                        <th className="text-center p-3">Status</th>
                        <th className="text-right p-3">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id} className="border-t border-[#d4c9ae]">
                            <td className="p-3 flex items-center gap-2">
                                <div
                                    className="w-8 h-8 bg-[#6B4832] bg-cover bg-center shrink-0"
                                    style={p.image ? { backgroundImage: `url(${getImageUrl(p.image)})` } : undefined}
                                />
                                {p.name}
                            </td>
                            <td className="p-3 text-[#8a7a6d]">{p.category?.name ?? "-"}</td>
                            <td className="p-3 text-right">{formatRupiah(p.price)}</td>
                            <td className="p-3 text-right">{formatRupiah(p.cost_price ?? 0)}</td>
                            <td className={`p-3 text-right ${p.stock <= 5 ? "text-[#5a2a1e] font-semibold" : ""}`}>
                                {p.stock}
                            </td>
                            <td className="p-3 text-center">
                                <span
                                    className={`px-2 py-1 rounded text-xs ${
                                        p.is_active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
                                    }`}
                                >
                                    {p.is_active ? "Aktif" : "Nonaktif"}
                                </span>
                            </td>
                            <td className="p-3 text-right">
                                <button onClick={() => handleEdit(p)} className="text-xs mr-3 underline">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(p.id)} className="text-xs text-[#5a2a1e] underline">
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AdminProductsPage