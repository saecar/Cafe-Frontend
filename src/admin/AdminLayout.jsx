import { Navigate, NavLink, Outlet } from "react-router-dom"
import { LayoutGrid, Package, Tags, Wallet, LogOut, Coffee } from "lucide-react"

function AdminLayout() {
    const token = localStorage.getItem("admin_token")
    if (!token) return <Navigate to="/admin/login" replace />

    function handleLogout() {
        localStorage.removeItem("admin_token")
        window.location.href = "/admin/login"
    }

    const menu = [
        { to: "/admin", label: "Dashboard", end: true, icon: LayoutGrid },
        { to: "/admin/products", label: "Produk", icon: Package },
        { to: "/admin/categories", label: "Kategori", icon: Tags },
        { to: "/admin/profit", label: "Rekap Keuntungan", icon: Wallet },
    ]

    return (
        <div className="min-h-screen flex bg-[#FAF7F2]">
            <aside className="w-56 bg-[#231F1D] text-[#F5EFE3] p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-xl bg-[#A84C20]/20 border border-[#A84C20]/40 flex items-center justify-center text-[#E8935F] flex-shrink-0">
                        <Coffee className="w-4 h-4" />
                    </div>
                    <h1 className="text-lg font-bold tracking-tight">Mr. R Admin</h1>
                </div>

                <nav className="flex flex-col gap-1 flex-1">
                    {menu.map((m) => {
                        const Icon = m.icon
                        return (
                            <NavLink
                                key={m.to}
                                to={m.to}
                                end={m.end}
                                className={({ isActive }) =>
                                    `flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-[#F5EFE3] text-[#231F1D]"
                                            : "text-[#D9CFC4] hover:bg-white/10 hover:text-white"
                                    }`
                                }
                            >
                                <Icon className="w-4 h-4" />
                                {m.label}
                            </NavLink>
                        )
                    })}
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 text-sm text-left px-3 py-2 text-[#D9CFC4] hover:bg-white/10 hover:text-white rounded-xl transition-colors"
                >
                    <LogOut className="w-4 h-4" />
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