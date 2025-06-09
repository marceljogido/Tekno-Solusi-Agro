
# 🌱 Farm Management App untuk Tekno Solusi Agro di Subang

Sebuah aplikasi manajemen pertanian berbasis web yang membantu petani atau pengelola lahan dalam merencanakan tanaman, memprediksi hasil panen, dan mengelola informasi lahan secara efisien.

## 🔍 Fitur Utama
- **Dashboard**: Ringkasan informasi terkait lahan dan tanaman.
- **My Crops**: Daftar tanaman yang sedang dikelola oleh pengguna.
- **Media Management**: Pengelolaan media tanam pada lahan milik pengguna.
- **Crop Planning**: Perencanaan penanaman berdasarkan luas lahan dengan prediksi jumlah tanaman, keuntungan, dan waktu panen.
- **Crop Tracking**: Pelacakan perkembangan tanaman secara real-time.

> ⚠️ Catatan: Proyek ini masih dalam tahap pengembangan. 

---

## 🛠 Teknologi yang Digunakan

- **Frontend**: [Next.js](https://nextjs.org/)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **External APIs**:
  - [OpenWeatherMap](https://openweathermap.org/api)
  - [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/overview)

---

## 📦 Requirements

Pastikan Anda sudah menginstal dan mengkonfigurasi hal-hal berikut di mesin Anda:

- Node.js (atau Bun runtime seperti yang digunakan di sini)
- PostgreSQL
- Git

---

## 🧪 Langkah-langkah Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/marceljogido/Tekno-Solusi-Agro.git
   cd tekno-solusi-agro
   ```

2. **Instal dependensi**
   ```bash
   bun install
   # atau jika tidak menggunakan bun:
   npm install
   ```

3. **Siapkan environment variables**
   Buat file `.env` di direktori root dengan konten berikut:
   ```env
   # Konfigurasi database
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/farm_management

   # OpenWeather API
   OPENWEATHER_API_KEY=qwertyuiop123456789

   # Maps API
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=asdfghjkl123
   ```

   Catatan: Ganti API keys dan konfigurasi Database dengan milik Anda.

4. **Siapkan database**
   ```bash
   bunx drizzle-kit push
   # atau jika tidak menggunakan bun:
   npx drizzle-kit push
   ```

5. **Jalankan server development**
   ```bash
   bun run dev
   # atau:
   npm run dev
   ```

6. **Akses aplikasi**
   Buka browser dan akses:
   ```
   http://localhost:3000
   ```

7. **Register & Login**
   - Buat akun baru atau gunakan akun yang telah dibuat sebelumnya.
   - Setelah login, Anda dapat mulai menggunakan aplikasi.

---

## 🧩 API Keys Configuration

Aplikasi ini membutuhkan beberapa API keys yang harus ditambahkan ke file `.env`. Contoh konfigurasi:

```env
# Database Connection
DATABASE_URL=postgres://postgres:postgres@localhost:5432/farm_management_team_main

Penjelasan struktur koneksi database:
- `postgres://` : Protokol koneksi ke database PostgreSQL
- **`postgres` (pertama)** : Username untuk mengakses database
  - Default username PostgreSQL biasanya "postgres"
- **`postgres` (kedua)** : Password untuk user tersebut
  - Ini adalah password default (disarankan diubah di production)
- **`localhost`** : Host dimana database berjalan
  - Jika database di server terpisah, ganti dengan IP/domain
- **`5432`** : Port default PostgreSQL
- **`farm_management`** : Nama database yang digunakan
  - Database utama untuk menyimpan semua data aplikasi

# OpenWeatherMap API Key
OPENWEATHER_API_KEY=(ubah API key disini)

# Google Maps JavaScript API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=(ubah API key disini)
```

---

## 📝 Notes for Developers

- Hanya menu berikut yang tersedia dan dapat digunakan:
  - Dashboard
  - My Crops
  - Media Management
  - Crop Planning
  - Crop Tracking

- Menu lainnya belum dikembangkan dan tidak akan berfungsi jika diakses.

---

## 🤝 Kontribusi

Kami menerima kontribusi dari komunitas! Kontribusi sangat diterima! Silakan fork repository dan buat pull request dengan perubahan Anda.

---

Untuk dukungan atau pertanyaan, silakan hubungi maintainer proyek.