import { NextRequest, NextResponse } from 'next/server';

const MODAL_API_URL = process.env.MODAL_API_URL;
const MODAL_API_KEY = process.env.MODAL_API_KEY;

async function handleProxy(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  if (!MODAL_API_URL) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const { path } = await params;
  const pathSegments = path || [];
  let pathString = pathSegments.join('/');

  if (!pathString) {
    pathString = 'projects/';
  }

  if (pathString === 'projects' || pathString === 'avatars') {
    pathString += '/';
  }

  const queryString = request.nextUrl.search;
  const targetEndpoint = `${MODAL_API_URL}/api/v1/${pathString}${queryString}`.replace(/([^:]\/)\/+/g, "$1");

  try {
    const headers = new Headers();
    if (MODAL_API_KEY) {
      headers.set('Authorization', `Bearer ${MODAL_API_KEY}`);
      headers.set('X-API-Key', MODAL_API_KEY);
    }
    headers.set('Accept', 'application/json');

    let body: BodyInit | undefined;
    const contentType = request.headers.get('content-type') || '';

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      if (contentType.includes('multipart/form-data')) {
        const incomingFormData = await request.formData();
        const newFormData = new FormData();
        for (const [key, value] of incomingFormData.entries()) {
          newFormData.append(key, value);
        }
        body = newFormData;
        headers.delete('Content-Type');
      } else {
        const textBody = await request.text();
        if (textBody) {
          body = textBody;
          if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
          }
        }
      }
    }

    const response = await fetch(targetEndpoint, {
      method: request.method,
      headers: headers,
      body: body,
      cache: 'no-store',
      redirect: 'follow'
    });

    const responseContentType = response.headers.get('content-type');
    let data;

    if (responseContentType && responseContentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream Error: ${response.status}`, details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      {
        error: 'Proxy Gateway Error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest, ctx: any) { return handleProxy(req, ctx); }
export async function POST(req: NextRequest, ctx: any) { return handleProxy(req, ctx); }
export async function PUT(req: NextRequest, ctx: any) { return handleProxy(req, ctx); }
export async function DELETE(req: NextRequest, ctx: any) { return handleProxy(req, ctx); }