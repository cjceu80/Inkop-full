import { pool } from './pool'

export type AccountRole = 'owner' | 'admin' | 'member'

export async function getUserRoleForAccount(
  accountId: string,
  userId: string,
): Promise<AccountRole | null> {
  const result = await pool.query<{ role: AccountRole }>(
    `
      SELECT role
      FROM account_members
      WHERE account_id = $1 AND user_id = $2
    `,
    [accountId, userId],
  )

  if (result.rowCount === 0) {
    return null
  }

  return result.rows[0].role
}

export async function assertUserHasAccountRole(
  accountId: string,
  userId: string,
  allowedRoles: AccountRole[] = ['owner', 'admin', 'member'],
): Promise<AccountRole> {
  const role = await getUserRoleForAccount(accountId, userId)

  if (!role || !allowedRoles.includes(role)) {
    throw new Error('Forbidden: user does not have required role for this account')
  }

  return role
}

