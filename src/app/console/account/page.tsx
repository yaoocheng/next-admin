"use client";

import { useState, useEffect } from "react";
import { Button, Table, Pagination, Modal, Form, Input } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { clientFetch } from "@/lib/client-fetcher";
import { useGlobalMessage } from "@/contexts/message-provider";

interface AccountList {
    total: number;
    list: DataItem[];
}
interface DataItem {
    id: number;
    realName: string;
    username: string;
}

export default function Account() {
    const [listData, setListData] = useState<DataItem[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [isEdit, setIsEdit] = useState(false);
    const { notifySuccess } = useGlobalMessage();

    const getListData = async (page: number) => {
        setLoading(true);
        try {
            const res = await clientFetch<AccountList>(
                `/api/proxy/admin3/aut/user/page?page=${page}&limit=10`,
                {
                    method: "GET",
                },
            );
            setListData(res.data.list);
            setTotal(res.data.total);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteHandle = async (item: DataItem) => {
        try {
            await clientFetch<AccountList>(`/api/proxy/admin3/aut/user`, {
                method: "DELETE",
                body: JSON.stringify([item.id]),
            });
            getListData(page);
        } catch (error) {
            console.log(error);
        }
    };

    const addAccounthandle = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            if (isEdit) {
                // 编辑用户
                const submitData = {
                    username: values.realName,
                    password: values.password,
                    realName: values.realName,
                    passwordAgain: values.password,
                    roleId: 1,
                    id: values.id,
                };

                await clientFetch("/api/proxy/admin3/aut/user", {
                    method: "PUT",
                    body: JSON.stringify(submitData),
                });
            } else {
                // 新建用户
                const submitData = {
                    username: values.realName,
                    password: values.password,
                    realName: values.realName,
                    roleId: 1,
                };

                await clientFetch("/api/proxy/admin3/aut/user", {
                    method: "POST",
                    body: JSON.stringify(submitData),
                });
            }
            notifySuccess("Operation successful");

            form.resetFields();
            getListData(page);
            setIsModalVisible(false);
            setIsEdit(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const editItemHandle = (record: DataItem) => {
        setIsEdit(true);
        setIsModalVisible(true);
        form.setFieldsValue({
            realName: record.realName,
            username: record.realName,
            id: record.id,
        });
    };

    useEffect(() => {
        getListData(page);
    }, [page]);

    const columns = [
        {
            title: "Nickname",
            dataIndex: "realName",
            key: "realName",
        },
        {
            title: "Role",
            dataIndex: "realName",
            key: "realName",
        },
        {
            title: "Login Account",
            dataIndex: "username",
            key: "username",
        },

        {
            title: "Actions",
            key: "operations",
            width: 100,
            render: (record: DataItem) => (
                <div className="flex gap-2">
                    <Button
                        type="link"
                        size="small"
                        onClick={() => editItemHandle(record)}
                        disabled={record.realName === "超级管理员"}
                        className="p-0 h-auto text-blue-500"
                    >
                        Edit
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        danger
                        onClick={() => deleteHandle(record)}
                        disabled={record.realName === "超级管理员"}
                        className="p-0 h-auto text-red-500"
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="p-6 bg-[#f1f1f1] box-border h-full overflow-auto">
                <div className="bg-white p-4 rounded-md">
                    <div className="flex items-center justify-end mb-4">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            className="flex items-center"
                            onClick={() => setIsModalVisible(true)}
                        >
                            Create
                        </Button>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={listData}
                        pagination={false}
                        loading={loading}
                        size="middle"
                        className="mb-4"
                        rowKey="id"
                        scroll={{ x: 1000 }}
                    />

                    <div className="flex justify-end">
                        <Pagination
                            current={page}
                            total={total}
                            size="small"
                            onChange={(page) => {
                                setPage(page);
                            }}
                            showTotal={(total) => `Total ${total} items`}
                        />
                    </div>
                </div>
            </div>

            <Modal
                title={isEdit ? "Edit Account" : "Add Account"}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            setIsModalVisible(false);
                            form.resetFields();
                        }}
                    >
                        Cancel
                    </Button>,
                    <Button
                        loading={loading}
                        onClick={() => addAccounthandle()}
                        key="submit"
                        type="primary"
                    >
                        {isEdit ? "Confirm" : "Add"}
                    </Button>,
                ]}
                closeIcon={<CloseOutlined />}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        id: -1,
                        username: "",
                        password: "",
                        passwordAgain: "",
                        realName: "",
                        roleId: 1,
                    }}
                >
                    <Form.Item
                        label="Nickname"
                        name="realName"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please enter a nickname between 2-12 characters",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Please enter a nickname between 2-12 characters"
                            maxLength={30}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Login Account"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Please enter login account",
                            },
                        ]}
                    >
                        <Input placeholder="Please enter login account" />
                    </Form.Item>

                    <Form.Item
                        label="Login Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please enter an 8-20 character password with at least one special character",
                            },
                        ]}
                    >
                        <Input.Password placeholder="Please enter an 8-20 character password with at least one special character" />
                    </Form.Item>

                    {isEdit && (
                        <Form.Item
                            label="Confirm Password"
                            name="passwordAgain"
                            rules={[
                                {
                                    required: true,
                                    message: "Please confirm password",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue("password") === value
                                        ) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                "The two passwords entered are inconsistent",
                                            ),
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Please enter password again" />
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </>
    );
}
