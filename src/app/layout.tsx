import "@ant-design/v5-patch-for-react-19";
import { ConfigProvider } from "antd";
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { MessageProvider } from "@/contexts/message-provider";

// const geistSans = Geist({
//     variable: "--font-geist-sans",
//     subsets: ["latin"],
// });

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Admin Dashboard",
    description: "Admin Dashboard",
    icons: {
        icon: "/favicon.png",
        apple: "/favicon.png",
        shortcut: "/favicon.png",
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistMono.className} antialiased`}>
                <ConfigProvider
                    theme={{
                        token: {
                            colorText: "#171717", // 修改字体颜色
                        },
                    }}
                >
                    <MessageProvider>{children}</MessageProvider>
                </ConfigProvider>
            </body>
        </html>
    );
}
