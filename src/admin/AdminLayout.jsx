import { Navigate, NavLink, Outlet } from "react-router-dom"

function AdminLayout() {
    const token = localStorage.getItem("admin_token")
    if (!token) return <Navigate to="/admin/login" replace />

    function handleLogout() {
        localStorage.removeItem("admin_token")
        window.location.href = "/admin/login"
    }

    const menu = [
        { to: "/admin", label: "Dashboard", end: true },
        { to: "/admin/products", label: "Produk" },
        { to: "/admin/categories", label: "Kategori" },
        { to: "/admin/profit", label: "Rekap Keuntungan" },
    ]

    return (
        <div className="min-h-screen flex bg-[#F5EFE3]">
            <aside className="w-56 bg-[#3b322c] text-[#F5EFE3] p-5 flex flex-col">
                <h1 className="font-heading text-xl font-bold mb-8">Mr. R Admin</h1>
                <nav className="flex flex-col gap-2 flex-1">
                    {menu.map((m) => (
                        <NavLink
                            key={m.to}
                            to={m.to}
                            end={m.end}
                            className={({ isActive }) =>
                                `px-3 py-2 rounded text-sm font-medium ${
                                    isActive ? "bg-[#F5EFE3] text-[#1C1410]" : "hover:bg-[#4a3f38]"
                                }`
                            }
                        >
                            {m.label}
                        </NavLink>
                    ))}
                </nav>
                <button onClick={handleLogout} className="text-sm text-left px-3 py-2 hover:bg-[#4a3f38] rounded">
                    Keluar
                </button>
            </aside>
            <main className="flex-1 p-6 md:p-8 overflow-auto">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout