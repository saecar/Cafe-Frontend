# Setup Integrasi Frontend ↔ Backend

## Yang ditambahkan
- `src/lib/api.js` — client fetch ke Laravel backend (`Cafe-order-Sistem`)
- `src/context/CartContext.jsx` — keranjang belanja (persist ke localStorage)
- `src/hooks/useMidtransSnap.js` — loader script Midtrans Snap + trigger popup bayar
- `src/lib/orderHistory.js` — simpan salinan invoice di localStorage (lihat catatan di bawah)
- Halaman baru: `/menu` (fetch kategori & produk asli), `/cart`, `/checkout`, `/invoice/:orderNumber`, `/pesanan-saya`
- `Contact.jsx` sekarang beneran POST ke `/api/contact`

## Langkah setup

1. **Copy env**
   ```bash
   cp .env.example .env
   ```
   Isi:
   - `VITE_API_BASE_URL` → URL backend Laravel kamu + `/api` (contoh: `http://localhost:8000/api`)
   - `VITE_MIDTRANS_CLIENT_KEY` → dari dashboard Midtrans (Settings → Access Keys), pakai yang **client key**, bukan server key
   - `VITE_MIDTRANS_IS_PRODUCTION` → `false` selama masih sandbox

2. **Jalankan backend Laravel**
   ```bash
   php artisan serve
   php artisan storage:link   # supaya gambar produk bisa diakses via /storage/...
   ```
   Pastikan juga di `.env` backend sudah diisi `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`, `MIDTRANS_IS_PRODUCTION`.

3. **Jalankan frontend**
   ```bash
   npm install
   npm run dev
   ```

## Catatan penting (ada gap di backend)

- `GET /orders` dan `GET /orders/{id}` di backend kamu **khusus admin** (`auth:sanctum`). Jadi customer nggak bisa "ambil ulang" invoice dari server pakai order ID.
  Solusinya sementara: begitu order dibuat, aku simpan salinan datanya di **localStorage browser** (`src/lib/orderHistory.js`), dan halaman `/invoice/:orderNumber` serta `/pesanan-saya` baca dari situ. Ini jalan, tapi terbatas per-browser/per-device — kalau pelanggan ganti HP/browser, riwayatnya nggak ikut.
  Kalau kamu mau invoice bisa dibuka dari device mana pun, tambahin endpoint publik semacam `GET /orders/track/{order_number}` (cukup validasi pakai kombinasi order_number + email, tanpa perlu login) di backend.
- Notifikasi status pembayaran dari Midtrans (`POST /payments/notification`) itu **webhook server-to-server**, jadi browser nggak pernah menerimanya langsung. Status yang ditampilkan di invoice adalah hasil callback `onSuccess`/`onPending` dari Snap popup — akurat untuk kebanyakan kasus, tapi kalau mau selalu sinkron 100% dengan status asli di database, tetap butuh endpoint publik di atas untuk polling ulang status order.
- Field gambar produk (`product.image`) dari backend berupa path relatif (`products/xxx.jpg`); frontend sudah otomatis rangkai jadi `BASE_URL/storage/products/xxx.jpg` lewat `getImageUrl()`.
