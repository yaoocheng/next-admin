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
import { clientFetch } from "@/lib/client-fetcher";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

interface RecordInfo {
    time: string;
    records: number;
}

interface VulnInfo {
    total_vulns: number;
    total_vulns_last_update_at: string;
    vuln_cloud_count: number;
    vuln_cloud_count_last_update_at: string;
    vuln_last_update_at: string;
}

export default function CompVulnChart() {
    const [data, setData] = useState<RecordInfo[]>([]);
    const [vulnData, setVulnData] = useState<VulnInfo | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [recordRes, vulnRes] = await Promise.all([
                    clientFetch<RecordInfo[]>(
                        "/api/proxy/admin3/bus/vuln/dataUpdate",
                        { method: "GET" },
                    ),
                    clientFetch<VulnInfo>(
                        "/api/proxy/admin3/bus/vuln/vulnCount",
                        { method: "GET" },
                    ),
                ]);

                // 格式化数据
                const formatted = recordRes.data.map((item) => ({
                    ...item,
                    value: item.records,
                    time: dayjs(item.time).format("YYYY-MM-DD HH:mm:ss"),
                }));

                setData(formatted);
                setVulnData(vulnRes.data);
            } catch (error) {
                console.error("数据获取失败：", error);
            }
        };

        fetchAll();
    }, []);

    // 自定义X轴刻度，只显示首部、中间和尾部三个时间点
    const customTickFormatter = (value: string, index: number) => {
        if (data.length < 3) return value;

        // 只在首部、中间和尾部显示时间
        if (
            index === 0 ||
            index === Math.floor(data.length / 2) ||
            index === data.length - 1
        ) {
            return value;
        }
        return "";
    };

    return (
        <>
            <ResponsiveContainer width="100%" height="65%">
                <LineChart
                    data={data}
                    margin={{ top: 0, right: 80, left: 30, bottom: 10 }}
                >
                    <XAxis
                        dataKey="time"
                        axisLine={false}
                        tickLine={false}
                        style={{ fontSize: "14px" }}
                        tickMargin={20}
                        tickFormatter={customTickFormatter}
                        interval={0}
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

            <div className="flex gap-6 w-full mt-4">
                <div
                    style={{ backgroundColor: "#f7f8fb" }}
                    className="flex-1 p-4 rounded-md"
                >
                    <p className="text-xs mb-1">
                        Cloud Vulnerability Count{" "}
                        {vulnData?.vuln_cloud_count_last_update_at
                            ? dayjs(
                                  vulnData.vuln_cloud_count_last_update_at,
                              ).format("YYYY-MM-DD HH:mm:ss")
                            : ""}
                    </p>
                    <h1 className="font-medium text-lg">
                        {vulnData?.vuln_cloud_count || "--"}
                    </h1>
                </div>
                <div
                    className="flex-1 p-4 rounded-md"
                    style={{ backgroundColor: "#f7f8fb" }}
                >
                    <p className="text-xs mb-1">
                        Local Vulnerability Count{" "}
                        {vulnData?.total_vulns_last_update_at
                            ? dayjs(vulnData.total_vulns_last_update_at).format(
                                  "YYYY-MM-DD HH:mm:ss",
                              )
                            : ""}
                    </p>
                    <h1 className="font-medium text-lg">
                        {vulnData?.total_vulns || "--"}
                    </h1>
                </div>
            </div>
        </>
    );
}
