"use client";

import { Button, Input } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMessageNotify } from "@/hooks/useMessge";
import { z } from "zod";
import { aes } from "@/lib/utils";
import { clientFetch } from "@/lib/client-fetcher";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";

const loginSchema = z.object({
    username: z.string().min(1, "用户名不能为空"),
    password: z.string().min(1, "密码不能为空"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
    const router = useRouter();
    const { contextHolder, notifyError } = useMessageNotify();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<LoginForm>({
        username: "",
        password: "",
    });

    const handleLogin = async () => {
        try {
            // 校验表单数据
            const validatedData = loginSchema.parse(formData);
            setLoading(true);

            // 加密密码
            validatedData.password = aes(validatedData.password);

            const loginRes = await clientFetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(validatedData),
            });

            localStorage.setItem("token", loginRes.data.access_token);

            // 获取用户信息 node转发
            const res = await clientFetch("/api/proxy/admin3/aut/user/info", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            localStorage.setItem("user", JSON.stringify(res.data));
            router.push("/console/dashboard");
        } catch (error) {
            // zod校验格式错误
            if (error instanceof z.ZodError) {
                notifyError(error.errors.map((e) => e.message).join(", "));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !loading) {
            handleLogin();
        }
    };

    return (
        <>
            {contextHolder}
            <div className="w-full h-full flex justify-center items-center">
                <div className="w-[400px] shadow-md rounded-lg p-8">
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold tracking-wide bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent drop-shadow-sm">
                            Admin Dashboard
                        </h1>
                    </div>
                    <div className="space-y-6" onKeyDown={handleKeyDown}>
                        <Input
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="input username"
                        />
                        <Input.Password
                            name="password"
                            placeholder="input password"
                            value={formData.password}
                            onChange={handleChange}
                            iconRender={(visible) =>
                                visible ? (
                                    <EyeTwoTone />
                                ) : (
                                    <EyeInvisibleOutlined />
                                )
                            }
                        />
                        <Button
                            onClick={handleLogin}
                            type="primary"
                            loading={loading}
                            className="w-full"
                        >
                            login
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
