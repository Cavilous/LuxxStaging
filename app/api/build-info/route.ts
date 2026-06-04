import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'

export async function GET() {
  let buildId = 'development'
  
  try {
    const buildIdPath = join(process.cwd(), '.next', 'BUILD_ID')
    buildId = readFileSync(buildIdPath, 'utf-8').trim()
  } catch {
    buildId = 'dev-' + Date.now()
  }

  return NextResponse.json({
    buildId,
    nextVersion: '14.2.16',
    reactVersion: '18.2.0',
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
}
