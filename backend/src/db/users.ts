import { pool } from './pool'

export interface UserRow {
  id: string
  firebase_uid: string
  email: string | null
  display_name: string | null
}

interface FirebaseUserPayload {
  uid: string
  email?: string | null
  name?: string | null
}

export async function findOrCreateUserFromFirebase(
  payload: FirebaseUserPayload,
): Promise<UserRow> {
  const email = payload.email ?? null
  const displayName = payload.name ?? null

  const result = await pool.query<UserRow>(
    `
      INSERT INTO users (firebase_uid, email, display_name)
      VALUES ($1, $2, $3)
      ON CONFLICT (firebase_uid) DO UPDATE
        SET
          email = COALESCE(EXCLUDED.email, users.email),
          display_name = COALESCE(EXCLUDED.display_name, users.display_name)
      RETURNING id, firebase_uid, email, display_name
    `,
    [payload.uid, email, displayName],
  )

  return result.rows[0]
}

