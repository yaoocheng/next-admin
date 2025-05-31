import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, TreeSelect, Button } from "antd";
import { clientFetch } from "@/lib/client-fetcher";
import { useGlobalMessage } from "@/contexts/message-provider";

interface CreateFormProps {
    visible: boolean;
    roleList: {
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
    editData?: {
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
    };
    onCancel: () => void;
    onSuccess: () => void;
}

interface OrgItem {
    id: number;
    name: string;
    pid: number;
    path: string;
    description: string;
    children: OrgItem[];
}

const CreateForm: React.FC<CreateFormProps> = ({
    visible,
    roleList,
    editData,
    onCancel,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const { notifySuccess } = useGlobalMessage();
    const [loading, setLoading] = useState(false);
    const [treeData, setTreeData] = useState<OrgItem[]>([
        {
            id: 2,
            name: "全公司",
            pid: 1,
            path: "1,2,",
            description: "内置层级，不可删除",
            children: [],
        },
    ]);
    const isEdit = !!editData?.id;

    // 当编辑数据变化时，设置表单初始值
    useEffect(() => {
        if (visible) {
            if (isEdit && editData) {
                const ids = editData.org_ids
                    ?.filter((id: number) => id !== 1)
                    ?.map((id: number) => ({
                        value: id,
                    }));
                form.setFieldsValue({
                    nickname: editData.nickname,
                    role_id: editData.role_id,
                    org_id: ids,
                });

                // 编辑时加载组织数据
                for (const id of ids) {
                    onLoadData({ id: id.value });
                }
            } else {
                form.resetFields();
            }
        }
    }, [editData, isEdit, form, visible]);

    // 获取组织列表
    const onLoadData = async (nodeData: OrgItem) => {
        try {
            const res = await clientFetch<OrgItem[]>(
                `/api/proxy/user/v31/org/list?org_id=${nodeData.id}`,
                {
                    method: "GET",
                },
            );

            // 更新树数据
            const updateTreeData = (list) =>
                list.map((node) => {
                    if (node.id === nodeData.id) {
                        return {
                            ...node,
                            children: res,
                        };
                    }
                    if (node.children) {
                        return {
                            ...node,
                            children: updateTreeData(node.children),
                        };
                    }
                    return node;
                });

            setTreeData((prev) => updateTreeData(prev));
        } catch (error) {
            console.error("Failed to get organization list:", error);
        }
    };

    // 处理邮箱失焦事件，自动设置密码（仅新建时）
    const handleEmailBlur = () => {
        if (!isEdit) {
            const email = form.getFieldValue("email");
            if (email) {
                form.setFieldsValue({ password: email });
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            if (isEdit) {
                // 编辑用户
                const submitData = {
                    user_id: editData.id,
                    nickname: values.nickname,
                    role_id: values.role_id,
                    org_id: values.org_id.map((value) => value.value),
                };

                await clientFetch("/api/proxy/user/v31/manage/user/edit", {
                    method: "POST",
                    body: JSON.stringify(submitData),
                });

                notifySuccess("User updated successfully");
            } else {
                // 新建用户
                const submitData = {
                    user_id: "0",
                    account: values.email,
                    nickname: values.nickname,
                    role_id: values.role_id,
                    password: values.email,
                    password2: values.email,
                    source: "手动添加",
                    org_id: values.org_id.map((value) => value.value),
                };

                await clientFetch("/api/proxy/user/v31/manage/user/add", {
                    method: "POST",
                    body: JSON.stringify(submitData),
                });

                notifySuccess("User created successfully");
            }

            form.resetFields();
            onSuccess();
            onCancel();
        } catch (error) {
            console.error(
                `Failed to ${isEdit ? "update" : "create"} user:`,
                error,
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <>
            <Modal
                title={isEdit ? "Edit User" : "Create User"}
                open={visible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={loading}
                        onClick={handleSubmit}
                    >
                        {isEdit ? "Update" : "Save"}
                    </Button>,
                ]}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        source: "手动添加",
                    }}
                >
                    <Form.Item
                        label="Nickname"
                        name="nickname"
                        rules={[
                            {
                                required: true,
                                message: "Please enter nickname",
                            },
                            {
                                max: 30,
                                message: "Nickname cannot exceed 30 characters",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Please enter nickname"
                            maxLength={30}
                            showCount
                        />
                    </Form.Item>

                    {!isEdit && (
                        <>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter email",
                                    },
                                    {
                                        type: "email",
                                        message:
                                            "Please enter a valid email address",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Please enter email"
                                    onBlur={handleEmailBlur}
                                />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item
                        label="Role"
                        name="role_id"
                        rules={[
                            { required: true, message: "Please select role" },
                        ]}
                    >
                        <Select placeholder="Please select role">
                            {roleList.map((role) => (
                                <Select.Option
                                    key={role.value}
                                    value={role.value}
                                >
                                    {role.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Organization"
                        name="org_id"
                        rules={[
                            {
                                required: true,
                                message: "Please select organization",
                            },
                        ]}
                    >
                        <TreeSelect
                            multiple
                            placeholder="Please select organization"
                            treeData={treeData}
                            loadData={onLoadData}
                            fieldNames={{
                                label: "name",
                                value: "id",
                                children: "children",
                            }}
                            showCheckedStrategy={TreeSelect.SHOW_ALL}
                            treeCheckable
                            treeCheckStrictly
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    {!isEdit && (
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter password",
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder="Default password is registration email"
                                disabled
                            />
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </>
    );
};

export default CreateForm;
