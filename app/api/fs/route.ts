import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ address: '192.168.64.3', port: 5060 });
}
