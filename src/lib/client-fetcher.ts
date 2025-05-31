// lib/fetcher.ts
import { message } from "antd";

interface ResponseType<T> {
    code: number;
    msg: string;
    data: T;
}

export async function clientFetch<T>(
    input: RequestInfo,
    options: RequestInit = {},
): Promise<ResponseType<T> | T> {
    const res = await fetch(input, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        credentials: "include",
    });

    // 无权限
    if (res.status === 401) {
        if (typeof window !== "undefined") {
            const current = encodeURIComponent(window.location.pathname);
            window.location.href = `/login?returnTo=${current}`;
        }
        message.error("未登录或登录已过期");
        throw new Error("未登录或登录已过期");
    }

    // 其他错误
    if (!res.ok) {
        message.error("请求失败");
        throw new Error("请求失败");
    }

    return res.json();
}
