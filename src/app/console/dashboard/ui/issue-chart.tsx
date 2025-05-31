"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { clientFetch } from "@/lib/client-fetcher";
import { useEffect, useState } from "react";

interface FixInfo {
    fixStatus: number;
    count: number;
}

const getLevelName = (level: number): string => {
    switch (level) {
        case 1:
            return "Pending Fix";
        case 2:
            return "Fixed";
        case 3:
            return "Temporarily Ignored";
        case 4:
            return "Permanently Ignored";
        default:
            return "Unknown";
    }
};

export default function IssueChart() {
    const [data, setData] = useState<FixInfo[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await clientFetch<FixInfo[]>(
                    "/api/proxy/admin3/bus/statistical_diary/securityInfo",
                    {
                        method: "GET",
                    },
                );
                const formattedData = res.data.map((item) => ({
                    ...item,
                    name: getLevelName(item.fixStatus),
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
        <ResponsiveContainer width="100%" height="80%">
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={16}
                    style={{
                        fontSize: "14px",
                    }}
                />
                <YAxis axisLine={false} tickLine={false} stroke="#666" />
                <CartesianGrid stroke="#eee" vertical={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#1677ff" barSize={40} />
            </BarChart>
        </ResponsiveContainer>
    );
}
