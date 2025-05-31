"use client";

import {
    Input,
    Button,
    Table,
    Tag,
    Pagination,
    Select,
    Modal,
    Upload,
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    ImportOutlined,
    CloseOutlined,
    UploadOutlined,
    DownloadOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { clientFetch } from "@/lib/client-fetcher";
import { useMessageNotify } from "@/hooks/useMessge";
import type { UploadProps } from "antd";
import CreateForm from "./ui/create-form";

interface User {
    id: string;
    username: string;
    nickname: string;
    email: string;
    role_id: number;
    role_name: string;
    source: string;
    is_deleted: number;
    created_time: string;
    org_ids: number[];
    last_active_time: string;
}

interface ApiResponse {
    list: User[];
    total: number;
}

interface ApiRoleList {
    total: number;
    list: {
        id: number;
        role_name: string;
        description: string;
        sca_menu: string[];
        is_sys: number;
        is_all_menu: number;
        is_default_team: number;
        created_at: string;
        updated_at: string;
        label: string;
        value: number;
    }[];
}

// 格式化时间
const formatTime = (timeStr: string) => {
    if (!timeStr) return "-";
    return new Date(timeStr).toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

export default function User() {
    const { contextHolder, notifySuccess, notifyError } = useMessageNotify();
    const [userList, setUserList] = useState<User[]>([]);
    const [keyword, setkeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [roleList, setRoleList] = useState<ApiRoleList["list"]>([]);
    const [importModalVisible, setImportModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editData, setEditData] = useState<User>();

    // 获取用户列表
    const getUserList = async (page: number = 1, keyword: string) => {
        try {
            setLoading(true);
            const res = await clientFetch<ApiResponse>(
                "/api/proxy/user/v31/manage/user/list",
                {
                    method: "POST",
                    body: JSON.stringify({
                        page,
                        keyword,
                        limit: 10,
                    }),
                },
            );
            setUserList(res.list);
            setTotal(res.total);
        } catch (error) {
            console.error("获取用户列表错误:", error);
        } finally {
            setLoading(false);
        }
    };

    // 获取角色列表
    const getRoleList = async () => {
        try {
            const res = await clientFetch<ApiRoleList>(
                "/api/proxy/user/v31/role/list",
                {
                    method: "POST",
                    body: JSON.stringify({}),
                },
            );
            const role = res.list.map((item) => ({
                value: item.id,
                label: item.role_name,
                ...item,
            }));
            role.push({
                value: 0,
                label: "普通用户",
            });
            setRoleList(role);
        } catch (error) {
            console.error("获取角色列表错误:", error);
        }
    };

    useEffect(() => {
        getRoleList();
        getUserList(currentPage, keyword);
    }, [currentPage, keyword]);

    // 处理角色变更
    const handleRoleChange = async (value: string, record: User) => {
        try {
            await clientFetch("/api/proxy/user/v31/manage/user/set/role", {
                method: "POST",
                body: JSON.stringify({
                    user_id: record.id,
                    role_id: value,
                }),
            });
            getUserList(currentPage, keyword);
        } catch (error) {
            console.log(error);
        }
    };

    // 上传文件配置
    const props: UploadProps = {
        name: "file",
        action: "/api/user/v31/manage/user/import",
        headers: {
            Authorization: localStorage.getItem("token") || "",
        },
        onChange(info) {
            if (info.file.status === "done") {
                if (info.file?.response?.download_url) {
                    notifySuccess("Import successful");
                    setImportModalVisible(false);
                    getUserList(currentPage, keyword);
                } else {
                    notifyError(info.file?.response?.msg);
                }
            }
        },
    };

    const edithandle = (record: User) => {
        setEditData(record);
        setCreateModalVisible(true);
    };

    const columns = [
        {
            title: "Nickname",
            dataIndex: "nickname",
            key: "nickname",
            width: 160,
        },
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
            width: 180,
        },
        {
            title: "Role",
            dataIndex: "role_name",
            key: "role_name",
            width: 140,
            render: (text: string, record: User) => (
                <Select
                    value={text}
                    disabled={record.id === "1"}
                    style={{ width: 120 }}
                    options={roleList}
                    onChange={(value) => handleRoleChange(value, record)}
                    size="small"
                />
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 180,
        },
        {
            title: "Source",
            dataIndex: "source",
            key: "source",
            width: 120,
        },
        {
            title: "Status",
            dataIndex: "is_deleted",
            key: "status",
            width: 100,
            render: (is_deleted: number) => (
                <Tag color={is_deleted === 2 ? "green" : "red"}>
                    {is_deleted === 2 ? "Enabled" : "Disabled"}
                </Tag>
            ),
        },
        {
            title: "Created Time",
            dataIndex: "created_time",
            key: "created_time",
            width: 160,
            render: (text: string) => formatTime(text),
        },
        {
            title: "Last Login",
            dataIndex: "last_active_time",
            key: "last_active_time",
            width: 160,
            render: (text: string) => formatTime(text),
        },
        {
            title: "Actions",
            key: "operations",
            width: 240,
            fixed: "right",
            render: (record: User) => (
                <div className="flex gap-2">
                    <Button
                        type="link"
                        disabled={record.id === "1"}
                        onClick={async () => {
                            if (record.is_deleted === 2) {
                                try {
                                    await clientFetch(
                                        "/api/proxy/user/v31/manage/user/disable",
                                        {
                                            method: "POST",
                                            body: JSON.stringify({
                                                user_id: record.id,
                                            }),
                                        },
                                    );
                                    notifySuccess("Operation successful");
                                    getUserList(currentPage, keyword);
                                } catch (error) {
                                    console.log(error);
                                }
                            } else {
                                try {
                                    await clientFetch(
                                        "/api/proxy/user/v31/manage/user/enable",
                                        {
                                            method: "POST",
                                            body: JSON.stringify({
                                                user_id: record.id,
                                            }),
                                        },
                                    );
                                    notifySuccess("Operation successful");
                                    getUserList(currentPage, keyword);
                                } catch (error) {
                                    console.log(error);
                                }
                            }
                        }}
                        danger={record.is_deleted === 2}
                        size="small"
                        className="`p-0 h-auto`"
                    >
                        {record.is_deleted === 2 ? "Disable" : "Enable"}
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        className="p-0 h-auto text-blue-500"
                        onClick={async () => {
                            try {
                                await clientFetch(
                                    "/api/proxy/user/v31/manage/user/reset/password",
                                    {
                                        method: "POST",
                                        body: JSON.stringify({
                                            user_id: record.id,
                                        }),
                                    },
                                );
                                notifySuccess("Operation successful");
                                getUserList(currentPage, keyword);
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                    >
                        Reset Password
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => edithandle(record)}
                        disabled={record.id === "1"}
                        className="p-0 h-auto text-blue-500"
                    >
                        Edit
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            {contextHolder}
            <div className="p-6 bg-[#f1f1f1] box-border h-full">
                <div className="p-4 rounded-md bg-white mb-4">
                    <div className="flex items-center justify-between">
                        <Input
                            value={keyword}
                            onChange={(e) => setkeyword(e.target.value)}
                            className="w-[240px]"
                            placeholder="Search by nickname or email"
                            prefix={<SearchOutlined />}
                        />
                        <div className="flex items-center gap-2">
                            <Button
                                icon={<ImportOutlined />}
                                className="flex items-center border-[#1677ff] text-[#1677ff] hover:text-[#4096ff] hover:border-[#4096ff]"
                                onClick={() => setImportModalVisible(true)}
                            >
                                Bulk Import
                            </Button>

                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                className="flex items-center"
                                onClick={() => {
                                    setCreateModalVisible(true);
                                }}
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-md">
                    <Table
                        columns={columns}
                        dataSource={userList}
                        pagination={false}
                        size="middle"
                        className="mb-4"
                        loading={loading}
                        rowKey="id"
                        scroll={{ x: 1200 }}
                    />

                    <div className="flex justify-end">
                        <Pagination
                            current={currentPage}
                            total={total}
                            size="small"
                            showTotal={(total) => `共 ${total} 条`}
                            onChange={(page) => {
                                setCurrentPage(page);
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* 批量导入用户弹框 */}
            <Modal
                title={
                    <div className="text-lg font-medium">
                        Bulk import platform users
                    </div>
                }
                open={importModalVisible}
                footer={null}
                onCancel={() => {
                    setImportModalVisible(false);
                }}
                closeIcon={<CloseOutlined />}
                width={520}
                centered
            >
                <div className="py-6">
                    {/* 步骤一 */}
                    <div className="mb-8">
                        <div className="text-base font-medium mb-2">step 1</div>
                        <Button
                            href="/user-template.xlsx"
                            download="用户导入模板.xlsx"
                            icon={<DownloadOutlined />}
                        >
                            Download Template
                        </Button>
                    </div>

                    {/* 步骤二 */}
                    <div>
                        <div className="text-base font-medium mb-2">step 2</div>

                        <Upload {...props}>
                            <Button icon={<UploadOutlined />}>
                                Upload Template
                            </Button>
                        </Upload>
                    </div>
                </div>
            </Modal>

            {/* 新增用户弹框 */}
            <CreateForm
                visible={createModalVisible}
                roleList={roleList}
                editData={editData}
                onCancel={() => {
                    setEditData(undefined);
                    setCreateModalVisible(false);
                }}
                onSuccess={() => {
                    getUserList(currentPage, keyword);
                }}
            />
        </>
    );
}
