import { useEffect, useState } from "react"
import { adminApi, getImageUrl } from "./adminApi"
import { formatRupiah } from "../lib/format"

function AdminDashboardPage() {
    const [summary, setSummary] = useState(null)
    const [bestSeller, setBestSeller] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([adminApi.getDashboard(), adminApi.getBestSeller(7)])
            .then(([dash, best]) => {
                setSummary(dash.data)
                setBestSeller(best.data)
            })
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="text-sm text-[#8a7a6d]">Memuat dashboard...</p>

    const cards = [
        { label: "Total Order", value: summary.total_order },
        { label: "Revenue", value: formatRupiah(summary.total_revenue) },
        { label: "Order Pending", value: summary.order_pending },
        { label: "Contact Baru", value: summary.contact_baru },
        { label: "Produk Aktif", value: summary.total_product },
    ]

    return (
        <div>
            <h1 className="font-heading text-2xl font-bold text-[#3a2c29] mb-6">Dashboard</h1>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                {cards.map((c) => (
                    <div key={c.label} className="border-2 border-[#1C1410] p-4 bg-white">
                        <p className="text-xs text-[#8a7a6d] mb-1">{c.label}</p>
                        <p className="font-heading text-lg font-bold text-[#3a2c29]">{c.value}</p>
                    </div>
                ))}
            </div>

            <h2 className="font-semibold text-base mb-3">Menu Terlaris (7 hari terakhir)</h2>
            <div className="border-2 border-[#1C1410] bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-[#3b322c] text-[#F5EFE3]">
                        <tr>
                            <th className="text-left p-3">Produk</th>
                            <th className="text-right p-3">Terjual</th>
                            <th className="text-right p-3">Omzet</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bestSeller.length === 0 && (
                            <tr>
                                <td colSpan={3} className="p-3 text-center text-[#8a7a6d]">
                                    Belum ada penjualan.
                                </td>
                            </tr>
                        )}
                        {bestSeller.map((row) => (
                            <tr key={row.product_id} className="border-t border-[#d4c9ae]">
                                <td className="p-3 flex items-center gap-2">
                                    <div
                                        className="w-8 h-8 bg-[#6B4832] bg-cover bg-center shrink-0"
                                        style={
                                            row.product?.image
                                                ? { backgroundImage: `url(${getImageUrl(row.product.image)})` }
                                                : undefined
                                        }
                                    />
                                    {row.product?.name ?? "-"}
                                </td>
                                <td className="p-3 text-right">{row.total_terjual}</td>
                                <td className="p-3 text-right">{formatRupiah(row.total_omzet)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminDashboardPage