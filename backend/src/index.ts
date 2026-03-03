import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import type { AuthenticatedRequest } from './middleware/auth'
import { authenticateFirebase } from './middleware/auth'
import { pool } from './db/pool'

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000

async function testDbConnection() {
  try {
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    // eslint-disable-next-line no-console
    console.log('Connected to Postgres')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to connect to Postgres at startup:', error)
  }
}

const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  }),
)
app.use(express.json())

app.get('/api/health', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as now')
    res.json({
      status: 'ok',
      message: `Backend is running. DB time: ${result.rows[0].now}`,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Health check failed:', error)
    res.status(500).json({ status: 'error', message: 'Database not reachable' })
  }
})

app.get('/api/protected', authenticateFirebase, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(500).json({ message: 'User missing after auth middleware' })
  }

  res.json({
    message: `Hello from protected route, uid=${req.user.uid}`,
  })
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${PORT}`)
  void testDbConnection()
})

