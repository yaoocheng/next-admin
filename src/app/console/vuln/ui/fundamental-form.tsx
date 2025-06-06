import { Input, Select, Switch, Form } from "antd";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { vulnTypes } from "../constent";

export default function FundamentalForm() {
    const { control, setValue } = useFormContext();

    // 监听漏洞类型 type
    const cwe = useWatch({ control, name: "cwe" });

    // 根据 type 值联动设置 is_poison
    useEffect(() => {
        if (cwe === "CWE-506") {
            setValue("is_poison", "是");
        } else {
            setValue("is_poison", "否");
        }
    }, [cwe, setValue]);

    // 当前投毒字段是否为"是"
    const isPoisonChecked = useWatch({ control, name: "is_poison" }) === "是";

    return (
        <>
            <div className="text-sm font-medium mb-3">基础信息</div>
            <div className="bg-[#e2e8f057] rounded-md p-4 mb-4">
                <Form layout="vertical">
                    <Form.Item label="漏洞标题" required>
                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: "请输入漏洞标题" }}
                            render={({ field, fieldState }) => (
                                <Input
                                    {...field}
                                    status={fieldState.invalid ? "error" : ""}
                                    placeholder="请输入漏洞标题"
                                />
                            )}
                        />
                    </Form.Item>

                    <Form.Item label="漏洞类型">
                        <Controller
                            name="cwe"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    showSearch
                                    placeholder="搜索选择漏洞类型"
                                    options={vulnTypes}
                                    optionFilterProp="label"
                                />
                            )}
                        />
                    </Form.Item>

                    <Form.Item label="是否为投毒">
                        <Controller
                            name="is_poison"
                            control={control}
                            render={() => (
                                <Switch checked={isPoisonChecked} disabled />
                            )}
                        />
                    </Form.Item>

                    <Form.Item label="漏洞级别" required>
                        <Controller
                            name="level"
                            control={control}
                            rules={{ required: "请选择漏洞级别" }}
                            render={({ field, fieldState }) => (
                                <Select
                                    {...field}
                                    status={fieldState.invalid ? "error" : ""}
                                    placeholder="选择漏洞级别"
                                    options={[
                                        { value: "Critical", label: "严重" },
                                        { value: "High", label: "高危" },
                                        { value: "Medium", label: "中危" },
                                        { value: "Low", label: "低危" },
                                    ]}
                                />
                            )}
                        />
                    </Form.Item>

                    <Form.Item label="漏洞处置等级" required>
                        <Controller
                            name="suggestion"
                            control={control}
                            rules={{ required: "请选择漏洞处置等级" }}
                            render={({ field, fieldState }) => (
                                <Select
                                    {...field}
                                    status={fieldState.invalid ? "error" : ""}
                                    placeholder="选择漏洞处置等级"
                                    options={[
                                        {
                                            label: "强烈建议修复",
                                            value: "StrongRecommend",
                                        },
                                        {
                                            label: "建议修复",
                                            value: "Recommend",
                                        },
                                        {
                                            label: "可选修复",
                                            value: "Optional",
                                        },
                                    ]}
                                />
                            )}
                        />
                    </Form.Item>

                    <Form.Item label="是否POC">
                        <Controller
                            name="poc"
                            control={control}
                            render={({ field }) => (
                                <Switch {...field} checked={field.value} />
                            )}
                        />
                    </Form.Item>

                    <Form.Item label="攻击成本">
                        <Controller
                            name="exploit_requirement_cost"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="选择攻击成本"
                                    options={[
                                        { label: "高", value: "高" },
                                        { label: "中", value: "中" },
                                        { label: "低", value: "低" },
                                    ]}
                                />
                            )}
                        />
                    </Form.Item>

                    <Form.Item label="利用可能性">
                        <Controller
                            name="exploitability"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="选择利用可能性"
                                    options={[
                                        { label: "高", value: "高" },
                                        { label: "中", value: "中" },
                                        { label: "低", value: "低" },
                                    ]}
                                />
                            )}
                        />
                    </Form.Item>

                    <Form.Item label="影响范围">
                        <Controller
                            name="scope_influence"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="影响范围"
                                    options={[
                                        { label: "广", value: "广" },
                                        { label: "一般", value: "一般" },
                                        { label: "小", value: "小" },
                                        { label: "极小", value: "极小" },
                                    ]}
                                />
                            )}
                        />
                    </Form.Item>

                    <Form.Item label="漏洞描述" required>
                        <Controller
                            name="description"
                            control={control}
                            rules={{ required: "请输入漏洞描述" }}
                            render={({ field, fieldState }) => (
                                <Input.TextArea
                                    {...field}
                                    status={fieldState.invalid ? "error" : ""}
                                    rows={4}
                                    placeholder="请输入漏洞描述"
                                />
                            )}
                        />
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}
