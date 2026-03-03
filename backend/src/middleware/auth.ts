import type { Request, Response, NextFunction } from 'express'
import { admin } from '../firebaseAdmin'
import { findOrCreateUserFromFirebase } from '../db/users'

export interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken
  userId?: string
}

export async function authenticateFirebase(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' })
  }

  const token = authHeader.substring('Bearer '.length)

  try {
    const decoded = await admin.auth().verifyIdToken(token)
    const dbUser = await findOrCreateUserFromFirebase({
      uid: decoded.uid,
      email: decoded.email ?? null,
      name: decoded.name ?? null,
    })

    req.user = decoded
    req.userId = dbUser.id

    return next()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to verify Firebase token or sync user', error)
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

