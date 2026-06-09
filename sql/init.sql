DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS borrows CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'mahasiswa' CHECK (role IN ('mahasiswa', 'dosen', 'staf', 'admin')),
  nim_nip VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  description TEXT,
  stock_total INTEGER NOT NULL DEFAULT 0,
  stock_available INTEGER NOT NULL DEFAULT 0,
  condition VARCHAR(50) NOT NULL DEFAULT 'baik' CHECK (condition IN ('baik', 'rusak_ringan', 'rusak_berat')),
  image_url VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE borrows (
  id SERIAL PRIMARY KEY,
  borrow_code VARCHAR(255) NOT NULL UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1,
  borrow_date DATE NOT NULL,
  return_date DATE NOT NULL,
  actual_return_date DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'disetujui', 'ditolak', 'dipinjam', 'dikembalikan', 'terlambat')),
  purpose TEXT NOT NULL,
  notes TEXT,
  reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  item_condition_on_return VARCHAR(50) CHECK (item_condition_on_return IN ('baik', 'rusak_ringan', 'rusak_berat')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'info' CHECK (type IN ('approved', 'rejected', 'reminder', 'info', 'returned')),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  related_borrow_id INTEGER REFERENCES borrows(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
