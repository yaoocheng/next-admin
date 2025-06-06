import { Modal, Button } from "antd";
import { useState } from "react";
import FundamentalForm from "./fundamental-form";
import EffectForm from "./effect-form";
import { useForm, FormProvider } from "react-hook-form";
import UrlForm from "./url-form";
import { clientFetch } from "@/lib/client-fetcher";
import { useGlobalMessage } from "@/contexts/message-provider";

interface VulnModalProps {
    modalVisible: boolean;
    onCancel: () => void;
    onSubmit: () => void;
}

export default function VulnModal({
    modalVisible,
    onCancel,
    onSubmit,
}: VulnModalProps) {
    const [loading, setLoading] = useState(false);
    const { notifySuccess, notifyError } = useGlobalMessage();
    const methods = useForm({
        defaultValues: {
            cnvd_id: "",
            cve_id: "",
            mps_id: "",
            last_editor: JSON.parse(localStorage.getItem("user") as string).id,
        },
    });

    // 关闭
    const handleCancel = () => {
        onCancel();
        methods.reset();
        console.log("Cancel");
    };
    // 提交
    const handleSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await clientFetch("/api/proxy/admin3/bus/vuln/save", {
                method: "POST",
                body: JSON.stringify(data),
            });
            if (res.code === 0) {
                notifySuccess("新增成功");
                methods.reset();
                onSubmit();
            } else {
                notifyError("新增失败");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal
                title="新增漏洞"
                width={800}
                centered
                open={modalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={loading}
                        onClick={methods.handleSubmit(handleSubmit)}
                    >
                        Save
                    </Button>,
                ]}
            >
                <div className="h-[600px] overflow-auto">
                    <FormProvider {...methods}>
                        <FundamentalForm />
                        <EffectForm />
                        <UrlForm />
                    </FormProvider>
                </div>
            </Modal>
        </>
    );
}
