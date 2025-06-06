import { Input, Button, Form, Select } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { useState } from "react";
import { clientFetch } from "../../../../lib/client-fetcher";

interface ComponentOption {
    ecosystem: string;
    name: string;
    id: string;
}

const debounce = (func: Function, wait: number) => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return function (...args: string[]) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, wait);
    };
};

export default function EffectForm() {
    const { control, setValue } = useFormContext();
    const [componentOptions, setComponentOptions] = useState<ComponentOption[]>(
        [],
    );

    const { fields, append, remove } = useFieldArray({
        control,
        name: "effects",
    });

    if (fields.length === 0) {
        append({
            name: "",
            ecosystem: "",
            min_fixed_version: "",
            fix_solution: "",
            repository: "",
            version_range_text: "",
        });
    }

    // 搜索组件
    const handleSearchComponent = async (search: string) => {
        if (!search) return;
        try {
            const response = await clientFetch<ComponentOption[]>(
                "/api/proxy/admin3/bus/vuln/componentAutocomplete",
                {
                    method: "POST",
                    body: JSON.stringify({ search }),
                },
            );
            const result = response.data?.map((item) => {
                return {
                    name: item.name,
                    ecosystem: item.ecosystem,
                    id: `${item.name}</--/>${item.ecosystem}`,
                };
            });
            setComponentOptions(result);
        } catch (error) {
            console.error("搜索组件失败:", error);
        }
    };

    return (
        <>
            <div className="text-sm font-medium mb-1 flex items-center justify-between">
                影响范围
                <Button
                    onClick={() =>
                        append({
                            name: "",
                            ecosystem: "",
                            version_range_text: "",
                            min_fixed_version: "",
                            fix_solution: "",
                        })
                    }
                    type="link"
                    icon={<PlusOutlined />}
                >
                    新增
                </Button>
            </div>
            {fields.map((field, index) => (
                <div
                    key={field.id}
                    className="bg-[#e2e8f057] rounded-md mb-4 p-4"
                >
                    <Form layout="vertical">
                        <Form.Item label="组件" required>
                            <Controller
                                control={control}
                                name={`effects.${index}.name`}
                                rules={{ required: "请输入/选择组件" }}
                                render={({ field, fieldState }) => (
                                    <Select
                                        {...field}
                                        showSearch
                                        placeholder="请输入/选择组件"
                                        status={
                                            fieldState.invalid ? "error" : ""
                                        }
                                        filterOption={false}
                                        onSearch={debounce(
                                            handleSearchComponent,
                                            1000,
                                        )}
                                        // options={componentOptions.map(
                                        //     (item) => ({
                                        //         label: `${item.name} (${item.ecosystem})`,
                                        //         value: item.name,
                                        //     }),
                                        // )}
                                        onSelect={(value) => {
                                            // 当选择组件时，自动设置ecosystem字段
                                            const selectedComponent =
                                                componentOptions.find(
                                                    (item) => item.id === value,
                                                );
                                            if (selectedComponent) {
                                                const ecosystemField = `effects.${index}.ecosystem`;
                                                setValue(
                                                    ecosystemField,
                                                    selectedComponent.ecosystem,
                                                );
                                            }
                                            field.onChange(
                                                selectedComponent?.name,
                                            );
                                        }}
                                    >
                                        {componentOptions.map((item) => (
                                            <Select.Option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.name}（{item.ecosystem}）
                                            </Select.Option>
                                        ))}
                                    </Select>
                                )}
                            />
                        </Form.Item>

                        <Form.Item label="包管理器">
                            <Controller
                                control={control}
                                name={`effects.${index}.ecosystem`}
                                rules={{ required: "选择包管理器" }}
                                render={({ field, fieldState }) => (
                                    <Select
                                        {...field}
                                        showSearch
                                        status={
                                            fieldState.invalid ? "error" : ""
                                        }
                                        placeholder="搜索选择包管理器"
                                        optionFilterProp="label"
                                        options={[
                                            { label: "npm", value: "npm" },
                                            { label: "cargo", value: "cargo" },
                                            { label: "pip", value: "pip" },
                                            { label: "maven", value: "maven" },
                                            {
                                                label: "composer",
                                                value: "composer",
                                            },
                                            { label: "nuget", value: "nuget" },
                                        ]}
                                    />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label="受影响版本" required>
                            <Controller
                                control={control}
                                name={`effects.${index}.version_range_text`}
                                rules={{ required: "请输入受影响版本" }}
                                render={({ field, fieldState }) => (
                                    <Input
                                        {...field}
                                        placeholder="请输入受影响版本"
                                        status={
                                            fieldState.invalid ? "error" : ""
                                        }
                                    />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label="最小修复版本">
                            <Controller
                                control={control}
                                name={`effects.${index}.min_fixed_version`}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="请输入最小修复版本"
                                    />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label="修复方案">
                            <Controller
                                control={control}
                                name={`effects.${index}.fix_solution`}
                                render={({ field }) => (
                                    <Input.TextArea
                                        {...field}
                                        placeholder="请输入修复方案"
                                    />
                                )}
                            />
                        </Form.Item>

                        <Button
                            danger
                            className="w-full"
                            type="dashed"
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(index)}
                        >
                            删除
                        </Button>
                    </Form>
                </div>
            ))}
        </>
    );
}
