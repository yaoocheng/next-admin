"use client";

import { useRouter, usePathname } from "next/navigation";
import { Avatar, Popover, Divider } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { clientFetch } from "@/lib/client-fetcher";

// 从menu.tsx中提取的路由映射对象
const routeMap = {
    "/console/dashboard": "Statistics Dashboard",
    "/console/user": "Platform User List",
    "/console/account": "Account Management",
    "/console/role": "Platform Role Management",
    "/console/function": "Function Settings",
    "/console/account-system": "Account System Integration",
    "/console/email": "Email Configuration",
    "/console/license": "License Management",
    "/console/private": "Private Source Configuration",
    "/console/vuln": "Custom Vulnerabilities",
};

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const userInfo = JSON.parse(localStorage.getItem("user") as string);

    // 获取当前路径对应的标题
    const currentTitle =
        routeMap[pathname as keyof typeof routeMap] || "Dashboard";

    const logoutHandle = async () => {
        await clientFetch("/api/logout", {
            method: "POST",
        });

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/login");
    };

    // 弹出框内容
    const content = (
        <>
            <div className="w-[250px] p-4">
                <div className="flex items-center">
                    <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
                    <div className="text-sm font-medium ml-2">
                        {userInfo?.username}
                        <div className="text-gray-500 text-xs mt-1">
                            {userInfo?.realName}
                        </div>
                    </div>
                </div>

                <Divider className="mt-4 mb-4" />

                <div
                    className="flex items-center cursor-pointer p-2 rounded-md transition-all duration-200 hover:bg-gray-100 hover:scale-105 group"
                    onClick={logoutHandle}
                >
                    <LogoutOutlined className="mr-2 text-gray-600 group-hover:text-red-500 transition-colors duration-200" />
                    <div className="font-medium text-gray-600 group-hover:text-red-500 transition-colors duration-200">
                        Logout
                    </div>
                </div>
            </div>
        </>
    );
    return (
        <>
            <div className="flex justify-between items-center h-14 px-6 border-b border-gray-200">
                <div className="text-lg font-medium">{currentTitle}</div>
                <div className="cursor-pointer hover:text-blue-500">
                    <Popover content={content}>
                        <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
                    </Popover>
                </div>
            </div>
        </>
    );
}
