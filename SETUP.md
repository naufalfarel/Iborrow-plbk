# IBorrow — Panduan Setup Lokal

## Prasyarat
- Node.js v20.x (WAJIB — gunakan NVM)
- PostgreSQL v14+
- npm v9+

## Langkah Setup

### 1. Install Node.js v20 via NVM
```bash
nvm install 20
nvm use 20
node -v   # harus v20.x.x
```

### 2. Install dependencies
```bash
npm install
```

### 3. Buat database PostgreSQL
```bash
psql -U postgres
CREATE DATABASE iborrow;
\q
```

### 4. Konfigurasi .env
Edit file `.env`:
```env
APP_KEY=          # generate dengan: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
DB_PASSWORD=      # password PostgreSQL kamu
```

### 5. Migrasi database
```bash
node ace migration:run
```

### 6. Isi data awal
```bash
node ace db:seed
```

### 7. Jalankan aplikasi
```bash
node ace serve --watch
```

Buka: http://localhost:3333

## Akun Default
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@iborrow.ac.id | password123 |
| Staf | staf@iborrow.ac.id | password123 |
| Mahasiswa | aulia@iborrow.ac.id | password123 |
