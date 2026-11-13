import { NextResponse } from 'next/server';

import { getArgoStatus } from '@/lib/argocd';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const status = await getArgoStatus();
  return NextResponse.json(status, {
    headers: { 'Cache-Control': 'no-store' }
  });
}
