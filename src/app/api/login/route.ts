import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { username, password } = body;

    try {
        // node层调用后端服务进行认证
        const loginRes = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin3/sys/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            },
        );

        const data = await loginRes.json();

        if (loginRes.ok) {
            if (data.data?.access_token) {
                const response = NextResponse.json(data);

                response.cookies.set("token", data.data.access_token, {
                    httpOnly: true,
                    path: "/",
                    maxAge: 60 * 60 * 24, // 1 天
                });
                return response;
            }
        }
        return NextResponse.json(
            {},
            {
                status: loginRes.status,
            },
        );
    } catch {
        return NextResponse.json(
            {},
            {
                status: 500,
            },
        );
    }
}
