"use client";

import React, { createContext, useContext } from "react";
import { useMessageNotify } from "@/hooks/useMessge";

const MessageContext = createContext(null);

export const useGlobalMessage = () => {
    const ctx = useContext(MessageContext);
    if (!ctx)
        throw new Error(
            "useGlobalMessage must be used within <MessageProvider>",
        );
    return ctx;
};

export const MessageProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const { notifySuccess, notifyError, contextHolder } = useMessageNotify();

    return (
        <MessageContext.Provider value={{ notifySuccess, notifyError }}>
            {contextHolder}
            {children}
        </MessageContext.Provider>
    );
};
