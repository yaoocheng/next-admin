import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function buildTargetUrl(req: NextRequest, path: string[]) {
    const targetPath = path.join("/");
    const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/${targetPath}`;
    const search = req.nextUrl.searchParams.toString();
    return search ? `${baseUrl}?${search}` : baseUrl;
}

async function forwardRequest(
    req: NextRequest,
    method: "GET" | "POST" | "DELETE" | "PUT",
    path: string[],
) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const url = buildTargetUrl(req, path);
    const headers = new Headers(req.headers); // 复制原 headers
    const contentType = req.headers.get("content-type") || "";

    if (token) {
        headers.set("Authorization", token);
    }

    const options: RequestInit = {
        method,
        headers,
    };

    if (method !== "GET" && contentType.includes("application/json")) {
        const body = await req.text();
        options.body = body;
    }

    try {
        const res = await fetch(url, options);
        const data = await res.json();

        return res.ok
            ? NextResponse.json(data)
            : NextResponse.json({}, { status: res.status });
    } catch {
        return NextResponse.json({}, { status: 500 });
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: { path: string[] } },
) {
    return forwardRequest(req, "GET", params.path);
}

export async function POST(
    req: NextRequest,
    { params }: { params: { path: string[] } },
) {
    return forwardRequest(req, "POST", params.path);
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { path: string[] } },
) {
    return forwardRequest(req, "DELETE", params.path);
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { path: string[] } },
) {
    return forwardRequest(req, "PUT", params.path);
}
