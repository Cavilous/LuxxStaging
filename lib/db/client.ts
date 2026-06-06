import 'server-only'
import { db } from '../db'
import { inventory, adminUsers, tourAddOns, tourBookings, tourRoutes } from './schema'
import { eq, and, ilike, desc, asc, inArray } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { isAllowedAdminRole } from '../auth-utils'
import { getDemoAdminUser, isDemoAdminIdentity } from '../demo-admin'

const SESSION_DURATION = 60 * 60 * 24 * 7
const JWT_SECRET_FALLBACK = 'your-secret-key-change-in-production'

function getJWTSecret() {
  return process.env.JWT_SECRET || JWT_SECRET_FALLBACK
}

export function createDbClient() {
  const toCamelKey = (key: string) => key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
  const toSnakeKey = (key: string) => key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
  const resolveColumn = (table: any, column: string) => table[column] || table[toCamelKey(column)]
  const toSnakeRow = (row: any): any => {
    if (!row || typeof row !== 'object' || row instanceof Date) return row
    if (Array.isArray(row)) return row.map(toSnakeRow)

    return Object.fromEntries(
      Object.entries(row).map(([key, value]) => [toSnakeKey(key), toSnakeRow(value)])
    )
  }

  const createQueryBuilder = (table: any) => {
    let query: any = {
      filters: [],
      orderBy: [],
      limitCount: null,
    }

    const builder = {
      select: (columns = "*") => builder,
      
      eq: (column: string, value: any) => {
        query.filters.push({ type: 'eq', column, value })
        return builder
      },
      
      neq: (column: string, value: any) => {
        query.filters.push({ type: 'neq', column, value })
        return builder
      },
      
      ilike: (column: string, pattern: string) => {
        query.filters.push({ type: 'ilike', column, value: pattern })
        return builder
      },
      
      in: (column: string, values: any[]) => {
        query.filters.push({ type: 'in', column, value: values })
        return builder
      },
      
      order: (column: string, options: { ascending?: boolean } = {}) => {
        query.orderBy.push({ column, ascending: options.ascending !== false })
        return builder
      },
      
      limit: (count: number) => {
        query.limitCount = count
        return builder
      },
      
      single: async () => {
        const result = await executeQuery(table, query, true)
        return result
      },
      
      then: (resolve: any, reject: any) => {
        return executeQuery(table, query).then(resolve, reject)
      },
      
      update: (data: any) => ({
        eq: (column: string, value: any) => {
          return executeUpdate(table, data, column, value)
        }
      }),
      
      insert: (data: any) => {
        return {
          select: () => ({
            single: async () => {
              return executeInsert(table, data)
            }
          })
        }
      },
    }

    return builder
  }
  
  const executeInsert = async (table: any, data: any) => {
    try {
      const dbData: any = {}
      Object.keys(data).forEach(key => {
        const tableKey = table[key] ? key : toCamelKey(key)
        dbData[tableKey] = data[key]
      })
      
      const result = await db
        .insert(table)
        .values(dbData)
        .returning()
      
      return { data: toSnakeRow(result[0]) || null, error: null }
    } catch (error) {
      console.error('[DB Insert Error]:', error)
      return { 
        data: null, 
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  }

  const executeUpdate = async (table: any, data: any, column: string, value: any) => {
    try {
      const col = resolveColumn(table, column)
      if (!col) {
        return { data: null, error: { message: `Column ${column} not found` } }
      }
      
      // Convert camelCase keys to snake_case for database
      const dbData: any = {}
      Object.keys(data).forEach(key => {
        const tableKey = table[key] ? key : toCamelKey(key)
        dbData[tableKey] = data[key]
      })
      
      const result = await db
        .update(table)
        .set(dbData)
        .where(eq(col, value))
        .returning()
      
      return { data: toSnakeRow(result[0]) || null, error: null }
    } catch (error) {
      console.error('[DB Update Error]:', error)
      return { 
        data: null, 
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  }

  const executeQuery = async (table: any, query: any, single = false) => {
    try {
      let dbQuery = db.select().from(table)
      
      // Apply filters
      if (query.filters.length > 0) {
        const conditions = query.filters.map((filter: any) => {
          const col = resolveColumn(table, filter.column)
          if (!col) return null
          
          switch (filter.type) {
            case 'eq':
              return eq(col, filter.value)
            case 'neq':
              return sql`${col} != ${filter.value}`
            case 'ilike':
              const pattern = filter.value.replace(/%/g, '')
              return ilike(col, `%${pattern}%`)
            case 'in':
              return inArray(col, filter.value)
            default:
              return null
          }
        }).filter(Boolean)
        
        if (conditions.length > 0) {
          dbQuery = dbQuery.where(and(...conditions)) as any
        }
      }
      
      // Apply ordering
      if (query.orderBy.length > 0) {
        const orderDef = query.orderBy[0]
        const col = resolveColumn(table, orderDef.column)
        if (col) {
          dbQuery = dbQuery.orderBy(orderDef.ascending ? asc(col) : desc(col)) as any
        }
      }
      
      // Apply limit
      if (query.limitCount) {
        dbQuery = dbQuery.limit(query.limitCount) as any
      }
      
      const result = await dbQuery
      
      if (single) {
        return { 
          data: toSnakeRow(result[0]) || null, 
          error: result[0] ? null : { message: 'No data found' }
        }
      }
      
      return { data: toSnakeRow(result), error: null }
    } catch (error) {
      console.error('[DB Query Error]:', error)
      return { 
        data: null, 
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  }

  return {
    from: (tableName: string) => {
      switch (tableName) {
        case 'inventory':
          return createQueryBuilder(inventory)
        case 'admin_users':
          return createQueryBuilder(adminUsers)
        case 'tour_routes':
          return createQueryBuilder(tourRoutes)
        case 'tour_addons':
          return createQueryBuilder(tourAddOns)
        case 'tour_bookings':
          return createQueryBuilder(tourBookings)
        default:
          throw new Error(`Unknown table: ${tableName}`)
      }
    },
    auth: {
      getSession: async () => {
        try {
          const { cookies } = await import('next/headers')
          const cookieStore = await cookies()
          const sessionCookie = cookieStore.get('admin_session')
          
          if (!sessionCookie?.value) {
            return { 
              data: { session: null },
              error: null
            }
          }
          
          const decoded = jwt.verify(sessionCookie.value, getJWTSecret()) as { userId: string, email: string, role: string }

          if (isDemoAdminIdentity(decoded)) {
            const demoUser = getDemoAdminUser()
            return {
              data: {
                session: {
                  user: {
                    id: demoUser.id,
                    email: demoUser.email,
                    role: demoUser.role,
                  },
                },
              },
              error: null,
            }
          }
          
          const user = await db
            .select()
            .from(adminUsers)
            .where(eq(adminUsers.id, decoded.userId))
            .limit(1)
          
          if (!user[0] || !user[0].isActive || !isAllowedAdminRole(user[0].role)) {
            return { 
              data: { session: null },
              error: null
            }
          }
          
          return {
            data: {
              session: {
                user: { 
                  id: user[0].id, 
                  email: user[0].email,
                  role: user[0].role
                }
              }
            },
            error: null
          }
        } catch (error) {
          return { 
            data: { session: null },
            error: null
          }
        }
      },
      signInWithPassword: async (credentials: { email: string; password: string }) => {
        const result = await db
          .select()
          .from(adminUsers)
          .where(eq(adminUsers.email, credentials.email))
          .limit(1)
        
        if (result.length === 0) {
          return { 
            data: { user: null, session: null }, 
            error: { message: 'Invalid credentials' }
          }
        }
        
        const user = result[0]
        
        if (!user.passwordHash) {
          return { 
            data: { user: null, session: null }, 
            error: { message: 'Invalid credentials' }
          }
        }
        
        const passwordValid = await bcrypt.compare(credentials.password, user.passwordHash)
        
        if (!passwordValid) {
          return { 
            data: { user: null, session: null }, 
            error: { message: 'Invalid credentials' }
          }
        }
        
        if (!user.isActive || !isAllowedAdminRole(user.role)) {
          return { 
            data: { user: null, session: null }, 
            error: { message: 'Account access denied' }
          }
        }
        
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        
        const token = jwt.sign(
          { userId: user.id, email: user.email, role: user.role },
          getJWTSecret(),
          { expiresIn: '7d' }
        )
        
        cookieStore.set('admin_session', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: SESSION_DURATION
        })
        
        return {
          data: { 
            user: { id: user.id, email: user.email },
            session: { user: { id: user.id, email: user.email } }
          },
          error: null
        }
      },
      signOut: async () => {
        try {
          const { cookies } = await import('next/headers')
          const cookieStore = await cookies()
          cookieStore.delete('admin_session')
        } catch (error) {
          // Silently fail on sign out errors
        }
        return { error: null }
      }
    }
  }
}
