import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { PlusCircle, Receipt, UtensilsCrossed, TrendingUp, Clock, CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react"
import { adminApi, getImageUrl, ApiError } from "./adminApi"
import { api } from "../lib/api"
import { formatRupiah } from "../lib/format"

const STATUS_STYLE = {
    pending: { label: "Menunggu Pembayaran", className: "bg-amber-50 text-amber-700 border-amber-200" },
    processing: { label: "Dibayar / Diproses", className: "bg-sky-50 text-sky-700 border-sky-200" },
    completed: { label: "Selesai", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    cancelled: { label: "Dibatalkan", className: "bg-red-50 text-red-700 border-red-200" },
}

function StatusBadge({ status }) {
    const s = STATUS_STYLE[status] ?? { label: status, className: "bg-stone-100 text-stone-600 border-stone-200" }
    return (
        <span className={`text-[11px] font-bold border px-2.5 py-0.5 rounded-full ${s.className}`}>{s.label}</span>
    )
}

function timeAgo(dateStr) {
    if (!dateStr) return ""
    const diffMs = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diffMs / 60000)
    if (mins < 1) return "Baru saja"
    if (mins < 60) return `${mins} mnt lalu`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs} jam lalu`
    return `${Math.floor(hrs / 24)} hari lalu`
}

function AdminDashboardPage() {
    const [summary, setSummary] = useState(null)
    const [bestSeller, setBestSeller] = useState([])
    const [activeOrders, setActiveOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState(null)
    const [orderError, setOrderError] = useState("")

    useEffect(() => {
        loadAll()
    }, [])

    function loadAll() {
        setLoading(true)
        return Promise.all([
            adminApi.getDashboard(),
            adminApi.getBestSeller(7),
            adminApi.getOrders({ status: "pending" }),
            adminApi.getOrders({ status: "processing" }),
        ])
            .then(([dash, best, pending, processing]) => {
                setSummary(dash.data)
                setBestSeller(best.data)
                const merged = [...(pending.orders?.data ?? []), ...(processing.orders?.data ?? [])].sort(
                    (a, b) => new Date(a.created_at) - new Date(b.created_at),
                )
                setActiveOrders(merged)
            })
            .finally(() => setLoading(false))
    }

    // Selesai / Batalkan — aksi manual yang SAH buat admin (bukan soal verifikasi
    // pembayaran, tapi soal alur dapur/penyajian & keputusan bisnis).
    async function handleStatusChange(order, newStatus) {
        setUpdatingId(order.id)
        setOrderError("")
        try {
            const updated = await adminApi.updateOrderStatus(order.id, newStatus)
            if (newStatus === "completed" || newStatus === "cancelled") {
                setActiveOrders((prev) => prev.filter((o) => o.id !== order.id))
            } else {
                setActiveOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: updated.status } : o)))
            }
        } catch (err) {
            setOrderError(err instanceof ApiError ? err.message : "Gagal mengubah status order")
        } finally {
            setUpdatingId(null)
        }
    }

    // Cek Status Pembayaran — BUKAN nge-fake status "sudah dibayar" secara manual.
    // Ini cuma minta backend nge-recheck status transaksi INI ke Midtrans langsung
    // (endpoint publik yang sama dipakai di halaman invoice customer buat polling).
    // Berguna kalau webhook Midtrans belum sempat/nggak bisa nembus (misal masih
    // testing di localhost yang nggak bisa diakses dari luar).
    async function handleCheckPayment(order) {
        setUpdatingId(order.id)
        setOrderError("")
        try {
            const res = await api.checkOrderStatus(order.order_number)
            if (res?.status && res.status !== order.status) {
                if (res.status === "completed" || res.status === "cancelled") {
                    setActiveOrders((prev) => prev.filter((o) => o.id !== order.id))
                } else {
                    setActiveOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: res.status } : o)))
                }
            } else {
                setOrderError("Belum ada perubahan — pembayaran memang belum terkonfirmasi di Midtrans.")
            }
        } catch (err) {
            setOrderError(err instanceof ApiError ? err.message : "Gagal mengecek status pembayaran")
        } finally {
            setUpdatingId(null)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-sm text-[#6E6862]">Memuat dashboard...</p>
            </div>
        )
    }

    // Data-backed metric cards (mapped straight from adminApi.getDashboard()).
    const metrics = [
        {
            label: "Total Order",
            value: summary.total_order,
            footer: (
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Order hari ini
                </span>
            ),
        },
        {
            label: "Order Pending",
            value: summary.order_pending,
            badge: summary.order_pending > 0 ? "Urgent" : null,
            footer: (
                <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Menunggu Bayar
                </span>
            ),
        },
        {
            label: "Kontak Baru",
            value: summary.contact_baru,
            footer: <span className="text-[11px] text-[#6E6862]">Tanya Meja / RSVN</span>,
        },
        {
            label: "Produk Aktif",
            value: summary.total_product,
            footer: <span className="text-[11px] text-[#6E6862]">Produk Live</span>,
        },
    ]

    return (
        <div>
            {/* Page heading */}
            <div className="mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6862] block">
                    Rekap Status Hari Ini
                </span>
                <h1 className="text-2xl font-bold text-[#231F1D] tracking-tight mt-0.5">Dashboard</h1>
            </div>

            {/* Quick actions — wire these up to your routes/handlers */}
            <div className="grid grid-cols-3 gap-3 my-6">
                <Link
                    to="/admin/products"
                    className="flex flex-col items-center justify-center p-3.5 bg-[#A84C20] text-white rounded-2xl shadow-[0_2px_8px_rgba(168,76,32,0.25)] hover:bg-[#8C3C17] active:scale-[0.98] transition-all text-center gap-1.5"
                >
                    <PlusCircle className="w-5 h-5" />
                    <span className="font-semibold text-xs tracking-tight">+ Menu Baru</span>
                </Link>
                <Link
                    to="/admin/profit"
                    className="flex flex-col items-center justify-center p-3.5 bg-white text-[#231F1D] border border-[#E7E1D8] rounded-2xl shadow-sm hover:bg-[#F3EFEA] active:scale-[0.98] transition-all text-center gap-1.5"
                >
                    <Receipt className="w-5 h-5 text-[#A84C20]" />
                    <span className="font-semibold text-xs tracking-tight">Rekap Kasir</span>
                </Link>
                <button className="flex flex-col items-center justify-center p-3.5 bg-[#231F1D] text-white rounded-2xl shadow-sm hover:bg-[#3a332f] active:scale-[0.98] transition-all text-center gap-1.5">
                    <UtensilsCrossed className="w-5 h-5 text-amber-200" />
                    <span className="font-semibold text-xs tracking-tight">Meja &amp; POS</span>
                </button>
            </div>

            {/* Hero revenue card */}
            <div className="bg-gradient-to-br from-[#231F1D] to-[#2E2825] text-white p-5 rounded-2xl shadow-md relative overflow-hidden mb-4">
                <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-stone-300">Revenue / Omzet Kedai</span>
                    <span className="text-[11px] font-semibold bg-[#A84C20]/90 text-white px-2.5 py-1 rounded-full">
                        Live
                    </span>
                </div>
                <div className="mt-2 text-3xl font-extrabold tracking-tight text-white">
                    {formatRupiah(summary.total_revenue)}
                </div>
            </div>

            {/* Secondary metrics grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                {metrics.map((m) => (
                    <div
                        key={m.label}
                        className="bg-white p-4 rounded-2xl border border-[#E7E1D8] shadow-sm flex flex-col justify-between relative"
                    >
                        {m.badge && (
                            <span className="absolute top-3.5 right-3.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                {m.badge}
                            </span>
                        )}
                        <div>
                            <div className="text-xs text-[#6E6862] uppercase font-medium">{m.label}</div>
                            <div className="text-2xl font-bold text-[#231F1D] mt-1.5">{m.value}</div>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-[#E7E1D8]">{m.footer}</div>
                    </div>
                ))}
            </div>

            {/* Pesanan Masuk — pending & processing orders. Pembayaran diverifikasi
                OTOMATIS oleh webhook Midtrans di backend; admin cuma menangani
                alur dapur/penyajian (Selesai) dan pembatalan manual (Batalkan). */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6862] block">
                            Antrean Order
                        </span>
                        <h2 className="text-base font-bold text-[#231F1D] tracking-tight mt-0.5">Pesanan Masuk</h2>
                    </div>
                    <span className="text-xs font-semibold text-[#A84C20] bg-[#FBEFE8] px-2.5 py-1 rounded-full">
                        {activeOrders.length} aktif
                    </span>
                </div>

                {orderError && (
                    <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                        {orderError}
                    </div>
                )}

                <div className="space-y-3">
                    {activeOrders.length === 0 && (
                        <div className="bg-white border border-[#E7E1D8] rounded-2xl p-4 text-center text-sm text-[#6E6862] shadow-sm">
                            Tidak ada pesanan yang butuh diproses saat ini.
                        </div>
                    )}
                    {activeOrders.map((order) => {
                        const isUpdating = updatingId === order.id
                        return (
                            <div
                                key={order.id}
                                className="bg-white border border-[#E7E1D8] rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between pb-2.5 border-b border-[#E7E1D8]">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-xs font-bold bg-[#231F1D] text-white px-2 py-0.5 rounded-md flex-shrink-0">
                                            {order.order_number}
                                        </span>
                                        <span className="text-xs text-[#231F1D] font-medium truncate">
                                            {order.customer_name}
                                        </span>
                                    </div>
                                    <StatusBadge status={order.status} />
                                </div>

                                <div className="mt-3 flex justify-between items-start gap-2">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-[#231F1D]">
                                            {formatRupiah(order.total_amount)}
                                        </p>
                                        <p className="text-xs text-[#6E6862] mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {timeAgo(order.created_at)}
                                            {order.phone ? ` • ${order.phone}` : ""}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-[#E7E1D8] flex items-center gap-2">
                                    {isUpdating ? (
                                        <span className="text-xs text-[#6E6862] flex items-center gap-1.5 py-1.5">
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            Memperbarui...
                                        </span>
                                    ) : (
                                        <>
                                            {order.status === "pending" && (
                                                <button
                                                    onClick={() => handleCheckPayment(order)}
                                                    title="Minta backend cek ulang status transaksi ini langsung ke Midtrans — bukan menandai lunas secara manual"
                                                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#A84C20] bg-[#FBEFE8] hover:bg-[#F3E0D2] rounded-xl py-1.5 transition-colors"
                                                >
                                                    <RefreshCw className="w-3.5 h-3.5" />
                                                    Cek Status Pembayaran
                                                </button>
                                            )}
                                            {order.status === "processing" && (
                                                <button
                                                    onClick={() => handleStatusChange(order, "completed")}
                                                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl py-1.5 transition-colors"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Selesai
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleStatusChange(order, "cancelled")}
                                                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl py-1.5 transition-colors"
                                            >
                                                <XCircle className="w-3.5 h-3.5" />
                                                Batalkan
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Menu Terlaris — dynamic, from adminApi.getBestSeller(7) */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6862] block">
                            Performa Produk
                        </span>
                        <h2 className="text-base font-bold text-[#231F1D] tracking-tight mt-0.5">
                            Menu Terlaris (7 Hari)
                        </h2>
                    </div>
                </div>

                <div className="space-y-3">
                    {bestSeller.length === 0 && (
                        <div className="bg-white border border-[#E7E1D8] rounded-2xl p-4 text-center text-sm text-[#6E6862] shadow-sm">
                            Belum ada penjualan.
                        </div>
                    )}
                    {bestSeller.map((row, idx) => (
                        <div
                            key={row.product_id}
                            className="bg-white border border-[#E7E1D8] rounded-2xl p-3.5 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="w-16 h-16 relative flex-shrink-0 rounded-xl overflow-hidden bg-[#F3EFEA] border border-[#E7E1D8]">
                                {row.product?.image && (
                                    <img
                                        className="w-full h-full object-cover"
                                        src={getImageUrl(row.product.image)}
                                        alt={row.product?.name ?? ""}
                                    />
                                )}
                                <span
                                    className={`absolute top-1 left-1 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                        idx === 0 ? "bg-[#A84C20]" : "bg-[#231F1D]"
                                    }`}
                                >
                                    #{idx + 1}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-end">
                                    <span className="text-xs font-bold text-[#A84C20]">
                                        {row.total_terjual} Terjual
                                    </span>
                                </div>
                                <h3 className="text-sm font-semibold text-[#231F1D] truncate mt-0.5">
                                    {row.product?.name ?? "-"}
                                </h3>
                                <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-[#E7E1D8] text-xs">
                                    <span className="text-[#9B948C] text-[11px]">Omzet Produk:</span>
                                    <span className="font-bold text-[#231F1D]">{formatRupiah(row.total_omzet)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboardPage