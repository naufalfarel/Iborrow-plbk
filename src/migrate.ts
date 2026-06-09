import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import pool from './db.js'

async function migrate() {
  console.log('Starting database migration...')
  try {
    const sqlPath = path.join(process.cwd(), 'sql', 'init.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    await pool.query(sql)
    console.log('Migration successful!')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

migrate()
