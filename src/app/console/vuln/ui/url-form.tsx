import { Input, Button, Form } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";

export default function UrlForm() {
    const { control } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "reference_url",
    });

    if (fields.length === 0) {
        append({
            url: "",
        });
    }

    return (
        <>
            <div className="text-sm font-medium mb-1 items-center flex justify-between">
                参考链接
                <Button
                    onClick={() =>
                        append({
                            url: "",
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
                        <Form.Item label="参考链接">
                            <Controller
                                control={control}
                                name={`reference_url.${index}.url`}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="请输入参考链接"
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
