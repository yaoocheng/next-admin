"use client";

import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { clientFetch } from "@/lib/client-fetcher";
import { useGlobalMessage } from "@/contexts/message-provider";

interface RoleItem {
    id: number;
    role_name: string;
    description: string;
    sca_menu: string[];
    is_sys: number;
    is_all_menu: number;
    is_default_team: number;
    created_at: string;
    updated_at: string;
}

export default function Role() {
    const [listData, setListData] = useState<RoleItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
    const { notifySuccess, notifyError } = useGlobalMessage();

    const getListData = async () => {
        setLoading(true);
        try {
            const res = await clientFetch<RoleItem[]>(
                `/api/proxy/user/v31/role/list`,
                {
                    method: "POST",
                    body: JSON.stringify({}),
                },
            );
            setListData(res.list || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getListData();
    }, []);

    const menuOptions = [
        { label: "Security Issues", value: "/platform/issue" },
        { label: "Project Management", value: "/project/list" },
        { label: "Knowledge Base", value: "/knowledge" },
        { label: "Asset Management", value: "/asset" },
        { label: "Risk Management", value: "/risk" },
        { label: "Export Management", value: "/export" },
        { label: "Operation Log", value: "/operate" },
        { label: "Settings", value: "/set" },
    ];

    const handleSaveRole = async (values) => {
        setSubmitting(true);
        try {
            await clientFetch("/api/proxy/user/v31/role/save", {
                method: "POST",
                body: JSON.stringify({
                    id: editingRole ? editingRole.id : 0,
                    is_default_team: 1,
                    role_name: values.role_name,
                    description: values.description,
                    sca_menu: values.sca_menu || [],
                }),
            });
            notifySuccess(
                editingRole
                    ? "Role updated successfully"
                    : "Role created successfully",
            );
            setIsModalVisible(false);
            form.resetFields();
            setEditingRole(null);
            getListData();
        } catch (error) {
            console.log(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setEditingRole(null);
    };

    const handleEdit = (record: RoleItem) => {
        setEditingRole(record);
        form.setFieldsValue({
            role_name: record.role_name,
            description: record.description,
            sca_menu: record.sca_menu,
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (record: RoleItem) => {
        try {
            await clientFetch("/api/proxy/user/v31/role/del", {
                method: "POST",
                body: JSON.stringify({
                    id: record.id,
                }),
            });
            notifySuccess("Role deleted successfully");
            getListData();
        } catch (error) {
            console.log(error);
            notifyError("Failed to delete role");
        }
    };

    const columns = [
        {
            title: "Role Name",
            dataIndex: "role_name",
            key: "role_name",
        },
        {
            title: "Role Type",
            dataIndex: "is_sys",
            key: "is_sys",
            render: (is_sys: number) => (
                <span>{is_sys === 1 ? "System Role" : "Custom Role"}</span>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Created Time",
            dataIndex: "created_at",
            key: "created_at",
            render: (created_at: string) => (
                <span>{new Date(created_at).toLocaleString()}</span>
            ),
        },
        {
            title: "Actions",
            key: "operations",
            width: 150,
            render: (record: RoleItem) => (
                <div className="flex">
                    <Button
                        type="link"
                        disabled={record.is_sys === 1}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="link"
                        danger
                        disabled={record.is_sys === 1}
                        onClick={() => handleDelete(record)}
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
                    />

                    <Modal
                        title={editingRole ? "Edit Role" : "Create Role"}
                        open={isModalVisible}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="cancel" onClick={handleCancel}>
                                Cancel
                            </Button>,
                            <Button
                                key="submit"
                                type="primary"
                                loading={submitting}
                                onClick={() => form.submit()}
                            >
                                Save
                            </Button>,
                        ]}
                        width={600}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSaveRole}
                            initialValues={{
                                role_name: "",
                                description: "",
                                sca_menu: [],
                            }}
                        >
                            <Form.Item
                                label="Role Name"
                                name="role_name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter role name",
                                    },
                                    {
                                        max: 30,
                                        message:
                                            "Role name cannot exceed 30 characters",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Please enter role name"
                                    maxLength={30}
                                    showCount
                                />
                            </Form.Item>

                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[
                                    {
                                        max: 200,
                                        message:
                                            "Description cannot exceed 200 characters",
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    placeholder="Please enter description"
                                    maxLength={200}
                                    showCount
                                    rows={4}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Role Permissions"
                                name="sca_menu"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please select role permissions",
                                    },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select role permissions"
                                    options={menuOptions}
                                    allowClear
                                />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </>
    );
}
