import { useCallback } from "react"

let snapLoadPromise = null

function loadSnapScript() {
    if (window.snap) return Promise.resolve(window.snap)
    if (snapLoadPromise) return snapLoadPromise

    snapLoadPromise = new Promise((resolve, reject) => {
        const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY
        const isProduction = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === "true"
        const snapSrc = isProduction
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js"

        if (!clientKey) {
            reject(new Error("VITE_MIDTRANS_CLIENT_KEY belum diisi di file .env"))
            return
        }

        const script = document.createElement("script")
        script.src = snapSrc
        script.setAttribute("data-client-key", clientKey)
        script.onload = () => resolve(window.snap)
        script.onerror = () => reject(new Error("Gagal memuat script Midtrans Snap"))
        document.body.appendChild(script)
    })

    return snapLoadPromise
}

// Pakai: const { pay } = useMidtransSnap()
// pay(snapToken, { onSuccess, onPending, onError, onClose })
//
// Pakai: const { embed } = useMidtransSnap()
// embed(snapToken, "id-div-container", { onSuccess, onPending, onError })
// Bedanya sama pay: embed nampilin form pembayaran LANGSUNG NEMPEL di halaman
// (di dalam <div id="id-div-container">), bukan popup yang bisa ke-close gak sengaja.
export function useMidtransSnap() {
    const pay = useCallback(async (snapToken, callbacks = {}) => {
        const snap = await loadSnapScript()
        snap.pay(snapToken, callbacks)
    }, [])

    const embed = useCallback(async (snapToken, embedId, callbacks = {}) => {
        const snap = await loadSnapScript()
        snap.embed(snapToken, {
            embedId,
            ...callbacks,
        })
    }, [])

    return { pay, embed }
}