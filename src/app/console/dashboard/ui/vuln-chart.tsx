"use client";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { clientFetch } from "@/lib/client-fetcher";
import { useEffect, useState } from "react";

interface VulnInfo {
    count: number;
    level: number;
}

const COLORS = ["#ff4d4f", "#ff7a45", "#ffc53d", "#bae0ff"];

// 将 level 映射到对应的名称
const getLevelName = (level: number): string => {
    switch (level) {
        case 5:
            return "Critical";
        case 4:
            return "High";
        case 3:
            return "Medium";
        case 2:
            return "Low";
        default:
            return "Unknown";
    }
};

export default function VulnChart() {
    const [data, setData] = useState<VulnInfo[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await clientFetch<VulnInfo[]>(
                    "/api/proxy/admin3/bus/statistical_diary/vulnInfo",
                    {
                        method: "GET",
                    },
                );
                // 转换 API 返回的数据，添加 name 属性
                const formattedData = res.data.map((item) => ({
                    ...item,
                    name: getLevelName(item.level),
                    value: item.count,
                }));
                setData(formattedData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <ResponsiveContainer width="100%" height="78%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={0}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
                <Tooltip />
                <Legend
                    verticalAlign="top"
                    align="center"
                    iconType="circle"
                    iconSize={10}
                    height={36}
                    wrapperStyle={{
                        fontSize: "14px",
                        marginTop: "-10px",
                    }}
                />
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: "14px", fill: "#666" }}
                >
                    Total
                </text>
                <text
                    x="50%"
                    y="50%"
                    dy={25}
                    textAnchor="middle"
                    style={{ fontSize: "24px", fill: "#000" }}
                >
                    {data.reduce((sum, item) => sum + item.count, 0)}
                </text>
            </PieChart>
        </ResponsiveContainer>
    );
}
