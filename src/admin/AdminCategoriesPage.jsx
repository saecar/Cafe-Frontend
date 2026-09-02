import { useEffect, useState } from "react"
import { adminApi, ApiError } from "./adminApi"

function AdminCategoriesPage() {
    const [categories, setCategories] = useState([])
    const [name, setName] = useState("")
    const [editingId, setEditingId] = useState(null)
    const [error, setError] = useState(null)

    function load() {
        adminApi.getCategories().then((res) => setCategories(res.data ?? []))
    }

    useEffect(() => {
        load()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        try {
            if (editingId) {
                await adminApi.updateCategory(editingId, { name })
            } else {
                await adminApi.createCategory({ name })
            }
            setName("")
            setEditingId(null)
            load()
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Gagal menyimpan")
        }
    }

    async function handleDelete(id) {
        if (!confirm("Hapus kategori ini?")) return
        try {
            await adminApi.deleteCategory(id)
            load()
        } catch (err) {
            alert(err instanceof ApiError ? err.message : "Gagal menghapus")
        }
    }

    return (
        <div>
            <h1 className="font-heading text-2xl font-bold text-[#3a2c29] mb-6">Kategori</h1>

            <form onSubmit={handleSubmit} className="flex gap-2 mb-6 max-w-md">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama kategori"
                    required
                    className="flex-1 border border-[#d4c9ae] px-3 py-2 text-sm focus:outline-none focus:border-[#3b322c]"
                />
                <button className="bg-[#3b322c] text-[#F5EFE3] px-4 py-2 text-sm font-semibold">
                    {editingId ? "Update" : "Tambah"}
                </button>
                {editingId && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingId(null)
                            setName("")
                        }}
                        className="border-2 border-[#1C1410] px-4 py-2 text-sm"
                    >
                        Batal
                    </button>
                )}
            </form>
            {error && <p className="text-xs text-[#5a2a1e] mb-4">{error}</p>}

            <table className="w-full text-sm border-2 border-[#1C1410] bg-white">
                <thead className="bg-[#3b322c] text-[#F5EFE3]">
                    <tr>
                        <th className="text-left p-3">Nama</th>
                        <th className="text-left p-3">Slug</th>
                        <th className="text-right p-3">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((c) => (
                        <tr key={c.id} className="border-t border-[#d4c9ae]">
                            <td className="p-3">{c.name}</td>
                            <td className="p-3 text-[#8a7a6d]">{c.slug}</td>
                            <td className="p-3 text-right">
                                <button
                                    onClick={() => {
                                        setEditingId(c.id)
                                        setName(c.name)
                                    }}
                                    className="text-xs mr-3 underline"
                                >
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(c.id)} className="text-xs text-[#5a2a1e] underline">
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

export default AdminCategoriesPage