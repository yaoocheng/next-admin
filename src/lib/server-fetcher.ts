// lib/fetch/serverFetch.ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface ResponseType<T> {
    code: number;
    msg: string;
    data: T;
}

export async function serverFetch<T>(
    url: string,
    options: RequestInit = {},
): Promise<ResponseType<T> | T> {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;

    if (!token) {
        redirect(`/login`);
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${url}`,
        {
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                ...options.headers,
            },
            cache: "no-store", // 避免缓存
            ...options,
        },
    );

    if (res.status === 401) {
        throw new Error("未登录或登录已过期");
    }

    if (!res.ok) {
        throw new Error("请求失败");
    }

    return res.json();
}
