import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathStr = path.join("/");
  const url = `${BACKEND}/${pathStr}`;
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 502 }
    );
  }
}
