"use client";

import type { MenuProps } from "antd";
import {
    SettingOutlined,
    DashboardOutlined,
    TeamOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { Menu } from "antd";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
    {
        key: "0",
        label: "Dashboard",
        icon: <DashboardOutlined />,
        children: [
            {
                key: "/console/dashboard",
                label: "Statistics Dashboard",
            },
            // {
            //     key: "/bus/servestics/index",
            //     label: "Service Status Monitoring",
            // },
        ],
    },
    {
        key: "1",
        label: "Platform User Management",
        icon: <TeamOutlined />,
        children: [{ key: "/console/user", label: "Platform User List" }],
    },
    {
        key: "3",
        label: "Permission Management",
        icon: <SafetyCertificateOutlined />,
        children: [
            { key: "/console/account", label: "Account Management" },
            { key: "/console/role", label: "Platform Role Management" },
        ],
    },
    {
        key: "4",
        label: "System Management",
        icon: <SettingOutlined />,
        children: [
            { key: "/console/function", label: "Function Settings" },
            // {
            //     key: "/console/account-system",
            //     label: "Account System Integration",
            // },
            // { key: "/console/email", label: "Email Configuration" },
            { key: "/console/license", label: "License Management" },
            // {
            //     key: "/console/private",
            //     label: "Private Source Configuration",
            // },
            // { key: "/console/vuln", label: "Custom Vulnerabilities" },
            // { key: "/bus/vuln-lib", label: "Vulnerability Library Update" },
        ],
    },
];

export default function MenuC() {
    const router = useRouter();
    const pathname = usePathname();

    // 根据pathname找到对应的一级菜单key
    const defaultSelectedKeys = [pathname];
    const defaultOpenKeys = items.reduce((keys: string[], item: MenuItem) => {
        if (
            item != null &&
            "children" in item &&
            Array.isArray(item.children)
        ) {
            if (
                item.children.some((child) => child && child.key === pathname)
            ) {
                keys.push(item.key as string);
            }
        }
        return keys;
    }, []);

    const onClick: MenuProps["onClick"] = (e) => {
        router.push(e.key as string);
    };

    return (
        <>
            <div className="h-full">
                <div
                    className="flex items-center pl-6 pt-6 box-border"
                    style={{ borderRight: "1px solid #e8e8e8" }}
                >
                    <Image
                        src="/favicon.png"
                        alt="Your Image Description"
                        width={32} // 必填：图片宽度
                        height={32}
                    />
                    <span className="text-lg font-medium ml-2">
                        Admin Dashboard
                    </span>
                </div>

                <Menu
                    className="h-[calc(100%-60px)] pt-4"
                    defaultSelectedKeys={defaultSelectedKeys}
                    defaultOpenKeys={defaultOpenKeys}
                    onClick={onClick}
                    style={{ width: 256 }}
                    mode="inline"
                    items={items}
                />
            </div>
        </>
    );
}
