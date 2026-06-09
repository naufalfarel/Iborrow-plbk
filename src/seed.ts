import 'dotenv/config'
import bcrypt from 'bcrypt'
import { DateTime } from 'luxon'
import pool from './db.js'

async function seed() {
  console.log('Starting database seed...')
  try {
    // 1. Users
    const passwordHash = await bcrypt.hash('password123', 10)
    
    const usersData = [
      { fullName: 'Admin IBorrow', email: 'admin@iborrow.ac.id', role: 'admin', nimNip: 'ADM-001' },
      { fullName: 'Staf Lab', email: 'staf@iborrow.ac.id', role: 'staf', nimNip: 'STF-001' },
      { fullName: 'Dr. Bayu Pratama', email: 'bayu@iborrow.ac.id', role: 'dosen', nimNip: '198812122015041001' },
      { fullName: 'Aulia Rahman', email: 'aulia@iborrow.ac.id', role: 'mahasiswa', nimNip: '220411100001' },
      { fullName: 'Citra Nuraini', email: 'citra@iborrow.ac.id', role: 'mahasiswa', nimNip: '220411100002' }
    ]

    for (const user of usersData) {
      await pool.query(
        `INSERT INTO users (full_name, email, password, role, nim_nip, is_active) 
         VALUES ($1, $2, $3, $4, $5, true)
         ON CONFLICT (email) DO NOTHING`,
        [user.fullName, user.email, passwordHash, user.role, user.nimNip]
      )
    }

    // 2. Items
    const itemsData = [
      { code: 'I-001', name: 'Laptop Dell Latitude 7420', category: 'Laptop', description: 'Laptop lab untuk praktikum dan presentasi.', stockTotal: 12, stockAvailable: 5, condition: 'baik', imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853' },
      { code: 'I-002', name: 'Proyektor Epson EB-X51', category: 'Proyektor', description: 'Proyektor ruang kelas dan seminar.', stockTotal: 8, stockAvailable: 3, condition: 'baik', imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3' },
      { code: 'I-003', name: 'Kamera Canon EOS M50', category: 'Kamera', description: 'Kamera dokumentasi kegiatan jurusan.', stockTotal: 4, stockAvailable: 0, condition: 'baik', imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32' },
      { code: 'I-004', name: 'Arduino Uno R3 Kit', category: 'Mikrokontroler', description: 'Kit Arduino lengkap untuk praktikum IoT.', stockTotal: 25, stockAvailable: 18, condition: 'baik', imageUrl: 'https://images.unsplash.com/photo-1553406830-ef2513450d76' },
      { code: 'I-005', name: 'Raspberry Pi 4 8GB', category: 'Mikrokontroler', description: 'Single-board computer untuk riset dan praktikum.', stockTotal: 15, stockAvailable: 9, condition: 'baik', imageUrl: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc' },
      { code: 'I-006', name: 'Router Mikrotik hAP ac²', category: 'Jaringan', description: 'Router untuk praktikum jaringan komputer.', stockTotal: 10, stockAvailable: 7, condition: 'baik', imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8' },
      { code: 'I-007', name: 'Sound System JBL EON 615', category: 'Audio', description: 'Speaker aktif untuk seminar dan acara jurusan.', stockTotal: 6, stockAvailable: 3, condition: 'baik', imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d' },
      { code: 'I-008', name: 'Kabel HDMI 2.0 5m', category: 'Kabel', description: 'Kabel HDMI untuk display kelas dan lab.', stockTotal: 30, stockAvailable: 22, condition: 'baik', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64' },
      { code: 'I-009', name: 'Webcam Logitech C920', category: 'Aksesoris', description: 'Webcam untuk kuliah hybrid dan meeting.', stockTotal: 8, stockAvailable: 5, condition: 'baik', imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3' },
      { code: 'I-010', name: 'Headset Logitech H390', category: 'Aksesoris', description: 'Headset USB untuk praktikum multimedia.', stockTotal: 15, stockAvailable: 10, condition: 'baik', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' }
    ]

    for (const item of itemsData) {
      await pool.query(
        `INSERT INTO items (code, name, category, description, stock_total, stock_available, condition, image_url, is_active) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
         ON CONFLICT (code) DO NOTHING`,
        [item.code, item.name, item.category, item.description, item.stockTotal, item.stockAvailable, item.condition, item.imageUrl]
      )
    }

    // Get User IDs
    const usersRes = await pool.query('SELECT id, email FROM users')
    const users = Object.fromEntries(usersRes.rows.map(u => [u.email, u.id]))
    
    // Get Item IDs
    const itemsRes = await pool.query('SELECT id, code FROM items')
    const items = Object.fromEntries(itemsRes.rows.map(i => [i.code, i.id]))

    const adminId = users['admin@iborrow.ac.id']
    const stafId = users['staf@iborrow.ac.id']
    const bayuId = users['bayu@iborrow.ac.id']
    const auliaId = users['aulia@iborrow.ac.id']
    const citraId = users['citra@iborrow.ac.id']

    // 3. Borrows
    const borrowsData = [
      { borrowCode: 'B-1001', userId: auliaId, itemId: items['I-004'], quantity: 2, borrowDate: DateTime.local().minus({ days: 1 }).toSQLDate(), returnDate: DateTime.local().plus({ days: 5 }).toSQLDate(), status: 'menunggu', purpose: 'Praktikum mikrokontroler untuk tugas kelompok IoT.', notes: null, reviewedBy: null, reviewedAt: null, itemConditionOnReturn: null, actualReturnDate: null },
      { borrowCode: 'B-1002', userId: bayuId, itemId: items['I-002'], quantity: 1, borrowDate: DateTime.local().toSQLDate(), returnDate: DateTime.local().plus({ days: 3 }).toSQLDate(), status: 'disetujui', purpose: 'Kebutuhan mengajar mata kuliah Rekayasa Perangkat Lunak.', notes: 'Disetujui untuk jadwal kelas.', reviewedBy: stafId, reviewedAt: DateTime.local().toISO(), itemConditionOnReturn: null, actualReturnDate: null },
      { borrowCode: 'B-1003', userId: citraId, itemId: items['I-001'], quantity: 1, borrowDate: DateTime.local().toSQLDate(), returnDate: DateTime.local().plus({ days: 4 }).toSQLDate(), status: 'disetujui', purpose: 'Pengerjaan final project mata kuliah basis data.', notes: 'Jaga kondisi laptop dan charger.', reviewedBy: adminId, reviewedAt: DateTime.local().toISO(), itemConditionOnReturn: null, actualReturnDate: null },
      { borrowCode: 'B-1004', userId: auliaId, itemId: items['I-006'], quantity: 1, borrowDate: DateTime.local().minus({ days: 10 }).toSQLDate(), returnDate: DateTime.local().minus({ days: 3 }).toSQLDate(), status: 'terlambat', purpose: 'Praktikum jaringan routing dan konfigurasi VLAN.', notes: 'Sudah melewati tanggal kembali.', reviewedBy: stafId, reviewedAt: DateTime.local().minus({ days: 9 }).toISO(), itemConditionOnReturn: null, actualReturnDate: null },
      { borrowCode: 'B-1005', userId: citraId, itemId: items['I-008'], quantity: 2, borrowDate: DateTime.local().minus({ days: 12 }).toSQLDate(), returnDate: DateTime.local().minus({ days: 8 }).toSQLDate(), status: 'dikembalikan', purpose: 'Kebutuhan seminar proposal di ruang lab.', notes: 'Dikembalikan lengkap.', reviewedBy: adminId, reviewedAt: DateTime.local().minus({ days: 11 }).toISO(), itemConditionOnReturn: 'baik', actualReturnDate: DateTime.local().minus({ days: 8 }).toSQLDate() },
      { borrowCode: 'B-1006', userId: bayuId, itemId: items['I-003'], quantity: 1, borrowDate: DateTime.local().minus({ days: 2 }).toSQLDate(), returnDate: DateTime.local().plus({ days: 2 }).toSQLDate(), status: 'ditolak', purpose: 'Dokumentasi kegiatan penelitian mahasiswa.', notes: 'Stok kamera sedang habis.', reviewedBy: stafId, reviewedAt: DateTime.local().minus({ days: 1 }).toISO(), itemConditionOnReturn: null, actualReturnDate: null }
    ]

    for (const borrow of borrowsData) {
      await pool.query(
        `INSERT INTO borrows (borrow_code, user_id, item_id, quantity, borrow_date, return_date, actual_return_date, status, purpose, notes, reviewed_by, reviewed_at, item_condition_on_return) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (borrow_code) DO NOTHING`,
        [borrow.borrowCode, borrow.userId, borrow.itemId, borrow.quantity, borrow.borrowDate, borrow.returnDate, borrow.actualReturnDate, borrow.status, borrow.purpose, borrow.notes, borrow.reviewedBy, borrow.reviewedAt, borrow.itemConditionOnReturn]
      )
    }

    // 4. Notifications
    const notificationsData = [
      { userId: auliaId, title: 'Permintaan diterima', message: 'Pengajuan Arduino Uno R3 Kit sedang menunggu validasi.', type: 'info', isRead: false },
      { userId: bayuId, title: 'Peminjaman disetujui', message: 'Peminjaman Proyektor Epson EB-X51 disetujui.', type: 'approved', isRead: false },
      { userId: auliaId, title: 'Peminjaman terlambat', message: 'Router Mikrotik hAP ac² sudah melewati tanggal kembali.', type: 'reminder', isRead: false },
      { userId: adminId, title: 'Ada permintaan baru', message: 'Aulia Rahman mengajukan peminjaman Arduino Uno R3 Kit.', type: 'info', isRead: false }
    ]

    for (const notif of notificationsData) {
      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type, is_read) 
         VALUES ($1, $2, $3, $4, $5)`,
        [notif.userId, notif.title, notif.message, notif.type, notif.isRead]
      )
    }

    console.log('Seed successful!')
  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

seed()
