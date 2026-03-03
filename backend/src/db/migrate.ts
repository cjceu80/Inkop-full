import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { pool } from './pool'

async function runMigrations() {
  const migrationsDir = path.resolve(__dirname, '../../db/migrations')
  const files = fs
    .readdirSync(migrationsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
    .map((entry) => entry.name)
    .sort()

  for (const file of files) {
    const fullPath = path.join(migrationsDir, file)
    // eslint-disable-next-line no-console
    console.log(`Running migration ${file}...`)
    const sql = fs.readFileSync(fullPath, 'utf8')
    await pool.query(sql)
  }
}

runMigrations()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Migrations completed successfully')
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Migration failed', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await pool.end()
  })

