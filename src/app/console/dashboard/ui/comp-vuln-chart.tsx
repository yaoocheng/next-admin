"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// 示例动态时间数据
const data = [
    { time: "2024-06-01", value: 120 },
    { time: "2024-06-02", value: 200 },
    { time: "2024-06-03", value: 150 },
    { time: "2024-06-04", value: 300 },
    { time: "2024-06-05", value: 180 },
    { time: "2024-06-06", value: 250 },
    { time: "2024-06-07", value: 220 },
];

export default function CompVulnChart() {
    return (
        <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data}>
                <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: "14px" }}
                    tickMargin={16}
                />
                <YAxis axisLine={false} tickLine={false} stroke="#666" />
                <CartesianGrid stroke="#eee" vertical={false} />
                <Tooltip />
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#1677ff"
                    strokeWidth={3}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
