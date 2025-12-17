import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_AVATAR_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Pastikan export functions ada di dalam file ini
export async function GET(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  return handleRequest(request, await params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  return handleRequest(request, await params);
}

async function handleRequest(request: NextRequest, params: { path?: string[] }) {
  const path = params.path?.join('/') ?? ''; 
  const query = request.nextUrl.search;
  
  const targetUrl = `${API_URL}/api/v1/projects/${path}${query}`;

  console.log(`🔀 Proxying to: ${targetUrl}`);

  const body = request.method !== 'GET' ? await request.json() : undefined;

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY || '',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    } else {
        data = { message: 'Non-JSON response from upstream', status: response.status };
    }

    return NextResponse.json(data, {
      status: response.status,
    });

  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
      { message: 'Proxy Internal Error', detail: String(error) },
      { status: 500 }
    );
  }
}