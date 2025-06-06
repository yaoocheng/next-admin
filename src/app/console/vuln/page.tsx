"use client";

import { Input, Button, Table, Tag, Pagination, Tooltip } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useState, useEffect, useCallback } from "react";
import { clientFetch } from "@/lib/client-fetcher";
import VulnModal from "./ui/modal";
import { useGlobalMessage } from "@/contexts/message-provider";
import dayjs from "dayjs";

// Define vulnerability data interface
interface VulnItem {
    last_changed_at: string;
    last_editor: number;
    level: string;
    mps_id: string;
    source: string;
    title: string;
    last_editor_name: string;
}

// API response data interface
interface ApiResponse {
    list: VulnItem[];
    total: number;
}

// Format time
const formatTime = (timeStr: string) => {
    if (!timeStr) return "-";
    return dayjs(timeStr).format("YYYY-MM-DD HH:mm:ss");
};

export default function VulnPage() {
    const [vulnList, setVulnList] = useState<VulnItem[]>([]);
    const [keyword, setKeyword] = useState<string | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const { notifySuccess } = useGlobalMessage();

    // Get vulnerability list
    const getVulnList = useCallback(async () => {
        try {
            setLoading(true);
            const res = await clientFetch<ApiResponse>(
                "/api/proxy/admin3/bus/vuln/list",
                {
                    method: "POST",
                    body: JSON.stringify({
                        mps_id: keyword === "" ? undefined : keyword,
                        page_index: currentPage,
                        page_size: 10,
                    }),
                },
            );

            setVulnList(res.data.list);
            setTotal(res.data.total);
        } catch (error) {
            console.error("Error fetching vulnerability list:", error);
        } finally {
            setLoading(false);
        }
    }, [keyword, currentPage]);

    useEffect(() => {
        getVulnList();
    }, [currentPage, getVulnList]);

    // Handle key press event, trigger search on Enter key
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setCurrentPage(1); // Reset to first page when searching
            getVulnList();
        }
    };

    // Delete vulnerability
    const handleDelete = async (mpsId: string) => {
        try {
            await clientFetch("/api/proxy/admin3/bus/vuln/delete", {
                method: "POST",
                body: JSON.stringify({
                    mps_id: mpsId,
                }),
            });
            notifySuccess("Vulnerability deleted successfully");
            getVulnList(); // Refresh list
        } catch (error) {
            console.error("Error deleting vulnerability:", error);
        }
    };

    // Table column definitions
    const columns = [
        {
            title: "Vulnerability Name",
            dataIndex: "title",
            key: "title",
            ellipsis: {
                showTitle: false,
            },
            render: (address: string) => {
                return (
                    <Tooltip placement="top" title={address}>
                        {address}
                    </Tooltip>
                );
            },
        },
        {
            title: "ID",
            dataIndex: "mps_id",
            key: "mps_id",
            width: 150,
        },
        {
            title: "Severity Level",
            dataIndex: "level",
            key: "level",
            width: 120,
            render: (level: string) => {
                let color = "";
                switch (level) {
                    case "Critical":
                        color = "red";
                        break;
                    case "High":
                        color = "orange";
                        break;
                    case "Medium":
                        color = "yellow";
                        break;
                    case "Low":
                        color = "green";
                        break;
                    default:
                        color = "blue";
                }
                return <Tag color={color}>{level}</Tag>;
            },
        },
        {
            title: "Source",
            dataIndex: "source",
            key: "source",
            width: 150,
        },
        {
            title: "Last Editor",
            dataIndex: "last_editor_name",
            key: "last_editor_name",
            width: 150,
        },
        {
            title: "Last Modified",
            dataIndex: "last_changed_at",
            key: "last_changed_at",
            width: 180,
            render: (text: string) => formatTime(text),
        },
        {
            title: "Actions",
            key: "operations",
            width: 120,
            render: (_, record: VulnItem) => (
                <div className="flex gap-2">
                    {/* <Button
                        onClick={() => editVulnHandler(record)}
                        type="link"
                        size="small"
                        className="p-0 h-auto text-blue-500"
                    >
                        Edit
                    </Button> */}
                    <Button
                        type="link"
                        size="small"
                        danger
                        className="p-0 h-auto"
                        onClick={() => handleDelete(record.mps_id)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="p-6 bg-[#f1f1f1] box-border h-full">
                <div className="p-4 rounded-md bg-white mb-4">
                    <div className="flex items-center justify-between">
                        <Input
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="w-[320px]"
                            placeholder="Enter CVE/MPS/VUL ID to search"
                            prefix={<SearchOutlined />}
                        />
                        <Button
                            onClick={() => setModalVisible(true)}
                            icon={<PlusOutlined />}
                            type="primary"
                        >
                            Create
                        </Button>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-md">
                    <Table
                        columns={columns}
                        dataSource={vulnList}
                        pagination={false}
                        size="middle"
                        className="mb-4"
                        loading={loading}
                        rowKey="mps_id"
                        scroll={{ x: 1000 }}
                        locale={{ emptyText: "No Data" }}
                    />

                    <div className="flex justify-end">
                        <Pagination
                            current={currentPage}
                            total={total}
                            pageSize={10}
                            size="small"
                            showTotal={(total) => `Total ${total} items`}
                            onChange={(page) => {
                                setCurrentPage(page);
                            }}
                        />
                    </div>
                </div>
            </div>

            <VulnModal
                modalVisible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onSubmit={() => {
                    setModalVisible(false);
                    getVulnList();
                }}
            />
        </>
    );
}
