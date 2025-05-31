// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    const { pathname } = request.nextUrl;

    const isPageProtected = pathname.startsWith("/console");
    const isApiProtected = pathname.startsWith("/api/proxy");

    if ((isPageProtected || isApiProtected) && !token) {
        const loginUrl = new URL("/login", request.url);

        if (isApiProtected) {
            return NextResponse.json(
                {
                    message: "未登录或登录已过期",
                },
                {
                    status: 401,
                },
            );
        }

        return NextResponse.redirect(loginUrl);
    }

    // 允许继续请求
    return NextResponse.next();
}

// 匹配所有请求路径（你可以限制范围）
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
