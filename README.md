# IBorrow — Sistem Peminjaman Alat Laboratorium
 Link Deploy Iborrow https://iborrow-plbk.onrender.com/
## Deskripsi
IBorrow adalah aplikasi web untuk mengelola peminjaman alat laboratorium di Jurusan Informatika. Sistem ini membantu pengguna mengajukan peminjaman, staf/admin memvalidasi permintaan, dan admin memantau inventaris, notifikasi, serta laporan aktivitas secara terstruktur.

## Fitur Utama
- Autentikasi multi-role: Mahasiswa, Dosen, Admin
- Pengajuan, persetujuan, penolakan, perpanjangan, dan pengembalian peminjaman
- Manajemen inventaris alat laboratorium
- Monitoring status peminjaman dan stok alat
- Notifikasi sistem untuk approval, rejection, reminder, dan return
- Laporan dashboard dan export CSV
- Scheduler harian untuk cek keterlambatan otomatis

## Teknologi
- **Backend**:  Node.js + Express.js
- **Frontend**: React.js + Vite 
- **Styling**: Tailwind CSS v3
- **Database**: PostgreSQL
- **Scheduler**: node-cron 

## Struktur Aplikasi
```text
iborrow/
├── app/
│   ├── controllers/          # Controller auth, item, borrow, user, report, notification
│   ├── middleware/           # Auth, role, dan inertia shared props
│   ├── models/               # Lucid model: User, Item, Borrow, Notification
│   ├── validators/           # VineJS validator untuk auth, item, borrow
│   ├── constants/            # Enum status, role, kategori, kondisi
│   └── commands/             # Scheduler command: iborrow:check-overdue
├── database/
│   ├── migrations/           # Schema PostgreSQL lengkap
│   └── seeders/              # Data dummy user, item, borrow, notification
├── inertia/
│   ├── app/app.tsx           # Entry point React + Inertia
│   ├── components/           # Reusable components
│   ├── css/app.css           # Tailwind base styles
│   └── pages/                # Halaman public, user, admin
├── resources/views/          # Root view Inertia
├── start/                    # routes, kernel, scheduler preload
├── config/                   # Konfigurasi app, database, auth, session, inertia, mail
├── .env.example
└── README.md
```

## Instalasi

### Prasyarat
- Node.js >= 20.x
- PostgreSQL >= 14
- npm >= 9.x

### Langkah Instalasi
```bash
# 1. Masuk ke folder project
cd iborrow

# 2. Install dependencies
npm install

# 3. Salin file environment
cp .env.example .env

# 4. Generate APP_KEY
node ace generate:key

# 5. Edit .env sesuai database PostgreSQL kamu
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_DATABASE=iborrow

# 6. Buat database
createdb iborrow

# 7. Jalankan migrasi
node ace migration:run

# 8. Jalankan seeder
node ace db:seed

# 9. Jalankan aplikasi
node ace serve --watch
```

Buka aplikasi di:
```text
http://localhost:3333
```

## Akun Default Setelah Seeder
| Role | Email | Password |
|---|---|---|
| Admin | admin@iborrow.ac.id | password123 |
| Staf | staf@iborrow.ac.id | password123 |
| Dosen | bayu@iborrow.ac.id | password123 |
| Mahasiswa | aulia@iborrow.ac.id | password123 |
| Mahasiswa | citra@iborrow.ac.id | password123 |

## Alur Testing Cepat
1. Login sebagai mahasiswa: `aulia@iborrow.ac.id / password123`.
2. Buka menu **Alat**, pilih alat yang stoknya tersedia, lalu klik **Pinjam**.
3. Isi jumlah, tanggal pinjam, tanggal kembali, dan tujuan peminjaman.
4. Logout, lalu login sebagai staf/admin.
5. Buka **Admin > Peminjaman**, pilih pengajuan status `menunggu`.
6. Klik **Setujui** atau **Tolak**.
7. Cek notifikasi di akun peminjam.
8. Saat alat dikembalikan, admin/staf dapat klik **Konfirmasi Pengembalian**.
9. Buka **Admin > Laporan** untuk melihat ringkasan dan export CSV.

## Scheduler Keterlambatan
Project sudah menyediakan command:
```bash
node ace iborrow:check-overdue
```

Secara default command ini juga dijadwalkan melalui `start/scheduler.ts` setiap hari pukul `00:05` menggunakan `node-cron`. Untuk production multi-instance, aktifkan scheduler hanya pada satu instance server agar update tidak berjalan ganda.

## Catatan Production
- Pastikan `APP_KEY` sudah dibuat dengan `node ace generate:key`.
- Gunakan PostgreSQL production yang aman dan lakukan backup berkala.
- Set `NODE_ENV=production` di server.
- Jalankan build sebelum deploy:
```bash
npm run build
npm run start
```
- Untuk deploy server Node.js, gunakan PM2 atau container Docker.
- Jika ingin deploy di Vercel, pisahkan frontend static/edge dari server Adonis atau gunakan platform Node server seperti Railway, Render, VPS, atau Fly.io untuk backend AdonisJS.

## Screenshot
Tambahkan screenshot setelah aplikasi dijalankan dan halaman berhasil diakses.
