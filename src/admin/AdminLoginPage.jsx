import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { adminApi, ApiError } from "./adminApi"

function AdminLoginPage() {
    const [form, setForm] = useState({ username: "", password: "" })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const res = await adminApi.login(form.username, form.password)
            localStorage.setItem("admin_token", res.access_token)
            navigate("/admin")
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Login gagal")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5EFE3] px-4">
            <form onSubmit={handleSubmit} className="w-full max-w-sm border-2 border-[#1C1410] p-8 bg-[#F5EFE3]">
                <h1 className="font-heading text-2xl font-bold text-center mb-6">Login Admin</h1>

                <label className="block text-xs uppercase tracking-wide mb-2">Username</label>
                <input
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                    className="w-full border border-[#d4c9ae] px-3 py-2 mb-4 text-sm focus:outline-none focus:border-[#3b322c]"
                />

                <label className="block text-xs uppercase tracking-wide mb-2">Password</label>
                <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className="w-full border border-[#d4c9ae] px-3 py-2 mb-6 text-sm focus:outline-none focus:border-[#3b322c]"
                />

                {error && (
                    <p className="text-xs text-[#5a2a1e] bg-[#f8e4de] p-3 mb-4 border border-[#1C1410]">{error}</p>
                )}

                <button
                    disabled={loading}
                    className="w-full bg-[#3b322c] text-[#F5EFE3] py-3 font-semibold text-sm disabled:opacity-60"
                >
                    {loading ? "Masuk..." : "Masuk"}
                </button>
            </form>
        </div>
    )
}

export default AdminLoginPage