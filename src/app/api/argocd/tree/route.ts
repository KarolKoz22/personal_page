import { NextResponse, type NextRequest } from 'next/server';

import { getResourceTree } from '@/lib/argocd';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const app = request.nextUrl.searchParams.get('app') ?? '';
  if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(app)) {
    return NextResponse.json({ error: 'Invalid application name' }, { status: 400 });
  }

  try {
    const tree = await getResourceTree(app);
    return NextResponse.json(tree, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unavailable';
    const status = message === 'Unknown application' ? 404 : 503;
    return NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
  }
}
