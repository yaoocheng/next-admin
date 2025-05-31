import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({}, { status: 200 });

    // 清除 token（设置为空，立即过期）
    response.cookies.set("token", "", {
        path: "/",
        maxAge: 0,
    });

    return response;
}
