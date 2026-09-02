import { useState } from "react"
import * as XLSX from "xlsx"
import { adminApi } from "./adminApi"
import { formatRupiah } from "../lib/format"

function todayStr(offsetDays = 0) {
    const d = new Date()
    d.setDate(d.getDate() + offsetDays)
    return d.toISOString().slice(0, 10)
}

function AdminProfitRecapPage() {
    const [from, setFrom] = useState(todayStr(-6))
    const [to, setTo] = useState(todayStr())
    const [rows, setRows] = useState([])
    const [totals, setTotals] = useState(null)
    const [loading, setLoading] = useState(false)

    async function handleFetch() {
        setLoading(true)
        try {
            const res = await adminApi.getProfitRecap(from, to)
            setRows(res.data ?? [])
            setTotals(res.totals ?? null)
        } finally {
            setLoading(false)
        }
    }

    function handleExportExcel() {
        const sheetData = rows.map((r) => ({
            Tanggal: r.tanggal,
            "Jumlah Order": r.jumlah_order,
            Omzet: Number(r.revenue),
            Modal: Number(r.modal),
            Keuntungan: Number(r.profit),
        }))

        sheetData.push({
            Tanggal: "TOTAL",
            "Jumlah Order": totals?.jumlah_order ?? 0,
            Omzet: Number(totals?.revenue ?? 0),
            Modal: Number(totals?.modal ?? 0),
            Keuntungan: Number(totals?.profit ?? 0),
        })

        const ws = XLSX.utils.json_to_sheet(sheetData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Rekap Keuntungan")
        XLSX.writeFile(wb, `rekap-keuntungan_${from}_${to}.xlsx`)
    }

    return (
        <div>
            <h1 className="font-heading text-2xl font-bold text-[#3a2c29] mb-6">Rekap Keuntungan</h1>

            <div className="flex flex-wrap items-end gap-3 mb-6">
                <div>
                    <label className="block text-xs uppercase tracking-wide mb-1">Dari</label>
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="border border-[#d4c9ae] px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wide mb-1">Sampai</label>
                    <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="border border-[#d4c9ae] px-3 py-2 text-sm"
                    />
                </div>
                <button
                    onClick={handleFetch}
                    disabled={loading}
                    className="bg-[#3b322c] text-[#F5EFE3] px-5 py-2 text-sm font-semibold disabled:opacity-60"
                >
                    {loading ? "Memuat..." : "Tampilkan"}
                </button>
                {rows.length > 0 && (
                    <button onClick={handleExportExcel} className="border-2 border-[#1C1410] px-5 py-2 text-sm font-semibold">
                        Export Excel
                    </button>
                )}
            </div>

            {totals && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="border-2 border-[#1C1410] p-4 bg-white">
                        <p className="text-xs text-[#8a7a6d]">Total Order</p>
                        <p className="font-bold text-lg">{totals.jumlah_order}</p>
                    </div>
                    <div className="border-2 border-[#1C1410] p-4 bg-white">
                        <p className="text-xs text-[#8a7a6d]">Omzet</p>
                        <p className="font-bold text-lg">{formatRupiah(totals.revenue)}</p>
                    </div>
                    <div className="border-2 border-[#1C1410] p-4 bg-white">
                        <p className="text-xs text-[#8a7a6d]">Modal</p>
                        <p className="font-bold text-lg">{formatRupiah(totals.modal)}</p>
                    </div>
                    <div className="border-2 border-[#1C1410] p-4 bg-white">
                        <p className="text-xs text-[#8a7a6d]">Keuntungan</p>
                        <p className="font-bold text-lg text-green-700">{formatRupiah(totals.profit)}</p>
                    </div>
                </div>
            )}

            <table className="w-full text-sm border-2 border-[#1C1410] bg-white">
                <thead className="bg-[#3b322c] text-[#F5EFE3]">
                    <tr>
                        <th className="text-left p-3">Tanggal</th>
                        <th className="text-right p-3">Order</th>
                        <th className="text-right p-3">Omzet</th>
                        <th className="text-right p-3">Modal</th>
                        <th className="text-right p-3">Keuntungan</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-4 text-center text-[#8a7a6d]">
                                Belum ada data. Pilih tanggal lalu klik Tampilkan.
                            </td>
                        </tr>
                    )}
                    {rows.map((r) => (
                        <tr key={r.tanggal} className="border-t border-[#d4c9ae]">
                            <td className="p-3">{r.tanggal}</td>
                            <td className="p-3 text-right">{r.jumlah_order}</td>
                            <td className="p-3 text-right">{formatRupiah(r.revenue)}</td>
                            <td className="p-3 text-right">{formatRupiah(r.modal)}</td>
                            <td className="p-3 text-right font-semibold text-green-700">{formatRupiah(r.profit)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AdminProfitRecapPage