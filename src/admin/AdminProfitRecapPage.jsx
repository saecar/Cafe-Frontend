import { useState } from "react"
import * as XLSX from "xlsx"
import { adminApi } from "./adminApi"
import { formatRupiah } from "../lib/format"

function todayStr(offsetDays = 0) {
    const d = new Date()
    d.setDate(d.getDate() + offsetDays)
    return d.toISOString().slice(0, 10)
}

function firstOfMonthStr() {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10)
}

const RANGE_PRESETS = [
    { key: "today", label: "Hari Ini" },
    { key: "7d", label: "7 Hari Terakhir" },
    { key: "month", label: "Bulan Ini" },
    { key: "custom", label: "Custom" },
]

function dayLabel(dateStr) {
    try {
        const d = new Date(dateStr)
        return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
    } catch {
        return dateStr
    }
}

function weekdayLabel(dateStr) {
    try {
        const d = new Date(dateStr)
        return d.toLocaleDateString("id-ID", { weekday: "long" })
    } catch {
        return ""
    }
}

function AdminProfitRecapPage() {
    const [from, setFrom] = useState(todayStr(-6))
    const [to, setTo] = useState(todayStr())
    const [activeRange, setActiveRange] = useState("7d")
    const [rows, setRows] = useState([])
    const [totals, setTotals] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function fetchRange(rangeFrom, rangeTo) {
        setLoading(true)
        setError(null)
        try {
            const res = await adminApi.getProfitRecap(rangeFrom, rangeTo)
            setRows(res.data ?? [])
            setTotals(res.totals ?? null)
        } catch (err) {
            setError(err?.message || "Gagal memuat data rekap keuntungan.")
            setRows([])
            setTotals(null)
        } finally {
            setLoading(false)
        }
    }

    function handleFetch() {
        fetchRange(from, to)
    }

    function handlePreset(key) {
        setActiveRange(key)
        if (key === "custom") return

        let nextFrom = todayStr()
        let nextTo = todayStr()
        if (key === "7d") nextFrom = todayStr(-6)
        if (key === "month") nextFrom = firstOfMonthStr()

        setFrom(nextFrom)
        setTo(nextTo)
        fetchRange(nextFrom, nextTo)
    }

    function handleDateChange(field, value) {
        setActiveRange("custom")
        if (field === "from") setFrom(value)
        else setTo(value)
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

    const revenueNum = Number(totals?.revenue ?? 0)
    const modalNum = Number(totals?.modal ?? 0)
    const profitNum = Number(totals?.profit ?? 0)
    const orderCount = Number(totals?.jumlah_order ?? 0)

    const margin = totals && revenueNum > 0 ? (profitNum / revenueNum) * 100 : null
    const avgOrder = totals && orderCount > 0 ? revenueNum / orderCount : null
    const modalShare = totals && revenueNum > 0 ? Math.min(100, (modalNum / revenueNum) * 100) : 0

    return (
        <div className="bg-[#FAF6F0] min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-5 sm:px-6 sm:py-8 space-y-5 sm:space-y-6">

                {/* TITLE */}
                <div className="space-y-1.5">
                    <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#3a2c29]">Rekap Keuntungan</h1>
                    <p className="text-sm text-[#8a7a6d] leading-relaxed max-w-prose">
                        Pantau margin laba bersih, omzet, dan biaya modal bahan baku secara akurat.
                    </p>
                </div>

                {/* FILTER PERIODE */}
                <section className="bg-white rounded-2xl border border-[#e9e1d3] p-4 sm:p-5 space-y-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-0.5 text-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {RANGE_PRESETS.map((preset) => (
                            <button
                                key={preset.key}
                                type="button"
                                onClick={() => handlePreset(preset.key)}
                                className={
                                    "px-3.5 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors " +
                                    (activeRange === preset.key
                                        ? "bg-[#c9a084] text-white"
                                        : "bg-[#f4ede2] text-[#6b5c50] hover:bg-[#ece1d1]")
                                }
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#efe8db]">
                        <div>
                            <label className="block text-xs font-medium text-[#8a7a6d] mb-1">Dari Tanggal</label>
                            <input
                                type="date"
                                value={from}
                                onChange={(e) => handleDateChange("from", e.target.value)}
                                className="w-full border border-[#e9e1d3] rounded-xl px-3 py-2 text-sm text-[#3a2c29] bg-[#FAF6F0] focus:outline-none focus:ring-2 focus:ring-[#d9c3ac]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[#8a7a6d] mb-1">Sampai Tanggal</label>
                            <input
                                type="date"
                                value={to}
                                onChange={(e) => handleDateChange("to", e.target.value)}
                                className="w-full border border-[#e9e1d3] rounded-xl px-3 py-2 text-sm text-[#3a2c29] bg-[#FAF6F0] focus:outline-none focus:ring-2 focus:ring-[#d9c3ac]"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                        <button
                            onClick={handleFetch}
                            disabled={loading}
                            className="flex-1 sm:flex-none sm:px-6 bg-[#8a6a53] hover:bg-[#7d5f4a] text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60"
                        >
                            {loading ? "Memuat..." : "Tampilkan"}
                        </button>
                        {rows.length > 0 && (
                            <button
                                onClick={handleExportExcel}
                                className="flex-1 sm:flex-none sm:px-6 border border-[#e9e1d3] text-[#3a2c29] rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-[#f4ede2] transition-colors"
                            >
                                Export Excel
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="rounded-xl bg-[#f6e6e2] border border-[#e6c9c1] text-[#8a4a3a] text-sm px-3.5 py-2.5">
                            {error}
                        </div>
                    )}
                </section>

                {/* HERO: NET PROFIT */}
                {totals && (
                    <section className="bg-[#efe3d3] rounded-2xl p-5 sm:p-6 border border-[#e3d3ba]">
                        <div className="flex items-start justify-between gap-3">
                            <span className="text-xs font-medium uppercase tracking-wide text-[#8a6a53]">
                                Total Keuntungan Bersih
                            </span>
                            {margin !== null && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/70 text-[#6b5540] shrink-0">
                                    Margin {margin.toFixed(1)}%
                                </span>
                            )}
                        </div>

                        <div className="mt-2 text-3xl sm:text-4xl font-bold text-[#3a2c29] font-heading">
                            {formatRupiah(profitNum)}
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="bg-white/60 rounded-xl p-3">
                                <p className="text-[11px] uppercase tracking-wide text-[#8a7a6d]">Total Omzet</p>
                                <p className="text-base font-semibold text-[#3a2c29] mt-0.5">{formatRupiah(revenueNum)}</p>
                                <p className="text-[11px] text-[#8a7a6d] mt-0.5">{orderCount} Transaksi</p>
                            </div>
                            <div className="bg-white/60 rounded-xl p-3">
                                <p className="text-[11px] uppercase tracking-wide text-[#8a7a6d]">Biaya Modal</p>
                                <p className="text-base font-semibold text-[#3a2c29] mt-0.5">{formatRupiah(modalNum)}</p>
                                <div className="w-full h-1.5 rounded-full bg-white/70 mt-2 overflow-hidden">
                                    <div className="h-full rounded-full bg-[#c9a084]" style={{ width: `${modalShare}%` }} />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* SECONDARY METRICS */}
                {totals && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="bg-white rounded-xl border border-[#e9e1d3] p-3.5 text-center">
                            <p className="text-[11px] uppercase tracking-wide text-[#8a7a6d]">Total Order</p>
                            <p className="text-base font-semibold text-[#3a2c29] mt-1">{orderCount}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-[#e9e1d3] p-3.5 text-center">
                            <p className="text-[11px] uppercase tracking-wide text-[#8a7a6d]">Rata-rata Order</p>
                            <p className="text-base font-semibold text-[#3a2c29] mt-1">
                                {avgOrder !== null ? formatRupiah(avgOrder) : "-"}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-[#e9e1d3] p-3.5 text-center col-span-2 sm:col-span-1">
                            <p className="text-[11px] uppercase tracking-wide text-[#8a7a6d]">Rentang Periode</p>
                            <p className="text-base font-semibold text-[#3a2c29] mt-1">{rows.length} Hari</p>
                        </div>
                    </div>
                )}

                {/* LOG HARIAN */}
                <section className="space-y-3">
                    <div>
                        <h2 className="text-base font-semibold text-[#3a2c29]">Log Riwayat Harian</h2>
                        <p className="text-xs text-[#8a7a6d]">Rincian harian omzet, modal, dan laba bersih</p>
                    </div>

                    {rows.length === 0 && (
                        <div className="bg-white rounded-2xl border border-[#e9e1d3] p-8 text-center">
                            <p className="text-sm text-[#8a7a6d]">Belum ada data. Pilih tanggal lalu klik Tampilkan.</p>
                        </div>
                    )}

                    {rows.length > 0 && (
                        <>
                            {/* Mobile: stacked cards */}
                            <div className="space-y-2.5 md:hidden">
                                {rows.map((r) => (
                                    <div key={r.tanggal} className="bg-white rounded-xl border border-[#e9e1d3] p-3.5 space-y-2.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="min-w-0">
                                                <span className="text-sm font-semibold text-[#3a2c29]">{dayLabel(r.tanggal)}</span>
                                                <span className="block text-xs text-[#8a7a6d]">{weekdayLabel(r.tanggal)}</span>
                                            </div>
                                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#f4ede2] text-[#6b5c50] shrink-0">
                                                {r.jumlah_order} Order
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#efe8db] text-xs">
                                            <div>
                                                <div className="text-[10px] uppercase text-[#8a7a6d]">Omzet</div>
                                                <div className="font-semibold text-[#3a2c29] mt-0.5">{formatRupiah(r.revenue)}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] uppercase text-[#8a7a6d]">Modal</div>
                                                <div className="font-medium text-[#6b5c50] mt-0.5">{formatRupiah(r.modal)}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] uppercase text-[#6f8a72]">Untung</div>
                                                <div className="font-semibold text-[#5a7a5e] mt-0.5">{formatRupiah(r.profit)}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tablet & up: table */}
                            <div className="hidden md:block bg-white rounded-2xl border border-[#e9e1d3] overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-[#f4ede2] text-[#6b5c50]">
                                            <th className="text-left font-medium px-4 py-3">Tanggal</th>
                                            <th className="text-right font-medium px-4 py-3">Order</th>
                                            <th className="text-right font-medium px-4 py-3">Omzet</th>
                                            <th className="text-right font-medium px-4 py-3">Modal</th>
                                            <th className="text-right font-medium px-4 py-3">Keuntungan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((r) => (
                                            <tr key={r.tanggal} className="border-t border-[#efe8db]">
                                                <td className="px-4 py-3 text-[#3a2c29]">
                                                    {dayLabel(r.tanggal)}
                                                    <span className="block text-xs text-[#8a7a6d]">{weekdayLabel(r.tanggal)}</span>
                                                </td>
                                                <td className="px-4 py-3 text-right text-[#3a2c29]">{r.jumlah_order}</td>
                                                <td className="px-4 py-3 text-right text-[#3a2c29]">{formatRupiah(r.revenue)}</td>
                                                <td className="px-4 py-3 text-right text-[#6b5c50]">{formatRupiah(r.modal)}</td>
                                                <td className="px-4 py-3 text-right font-semibold text-[#5a7a5e]">{formatRupiah(r.profit)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    {totals && (
                                        <tfoot>
                                            <tr className="border-t border-[#e9e1d3] bg-[#faf6ef] font-semibold">
                                                <td className="px-4 py-3 text-[#3a2c29]">TOTAL</td>
                                                <td className="px-4 py-3 text-right text-[#3a2c29]">{orderCount}</td>
                                                <td className="px-4 py-3 text-right text-[#3a2c29]">{formatRupiah(revenueNum)}</td>
                                                <td className="px-4 py-3 text-right text-[#6b5c50]">{formatRupiah(modalNum)}</td>
                                                <td className="px-4 py-3 text-right text-[#5a7a5e]">{formatRupiah(profitNum)}</td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </>
                    )}
                </section>

            </div>
        </div>
    )
}

export default AdminProfitRecapPage