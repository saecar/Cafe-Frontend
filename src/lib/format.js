export function formatRupiah(amount) {
    const number = Number(amount) || 0
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number)
}

export function formatDate(dateString) {
    if (!dateString) return "-"
    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(dateString))
}
