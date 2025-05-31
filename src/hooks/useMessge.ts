// hooks/useMessageNotify.ts
import { message } from "antd";

type MessageType = "success" | "error" | "info" | "warning" | "loading";

export const useMessageNotify = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const notify = (type: MessageType, content: string) => {
        messageApi.open({ type, content });
    };

    return {
        contextHolder, // 要插入到 JSX 中
        notifySuccess: (msg: string) => notify("success", msg),
        notifyError: (msg: string) => notify("error", msg),
        notifyInfo: (msg: string) => notify("info", msg),
        notifyWarning: (msg: string) => notify("warning", msg),
        notifyLoading: (msg: string) => notify("loading", msg),
    };
};
