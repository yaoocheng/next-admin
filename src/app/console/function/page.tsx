"use client";

import { useState, useEffect } from "react";
import { Switch } from "antd";
import { useGlobalMessage } from "@/contexts/message-provider";
import { clientFetch } from "@/lib/client-fetcher";

interface ParamItem {
    id: number;
    paramName: string;
    paramKey: string;
    paramValue: string;
    remark: string;
    loading?: boolean;
}

interface UserConfig {
    is_enable_org: boolean;
    is_enable_oauth: boolean;
    is_allow_register: boolean;
    is_ad_or_ldap: boolean;
    is_open_team_ext: boolean;
    can_register: boolean;
    can_forgot_password: boolean;
    is_private_team_open: boolean;
    config_default_login_type: string;
    login_options: Array<{
        key: string;
        value: boolean;
    }>;
    loading?: boolean;
}

export default function FunctionPage() {
    const [params, setParams] = useState<ParamItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [userConfig, setUserConfig] = useState<UserConfig | null>(null);
    const [configLoading, setConfigLoading] = useState<boolean>(true);
    const { notifySuccess } = useGlobalMessage();

    useEffect(() => {
        fetchParams();
        fetchUserConfig();
    }, []);

    const fetchParams = async () => {
        try {
            setLoading(true);
            const res = await clientFetch<{ data: ParamItem[] }>(
                "/api/proxy/admin3/bus/params/list",
                {
                    method: "GET",
                },
            );
            setParams(res.data || []);
        } catch (error) {
            console.error("Failed to fetch parameter list", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserConfig = async () => {
        try {
            setConfigLoading(true);
            const res = await clientFetch<UserConfig>(
                "/api/proxy/user/v31/config",
                {
                    method: "GET",
                },
            );
            setUserConfig(res);
        } catch (error) {
            console.error("Failed to fetch user config", error);
        } finally {
            setConfigLoading(false);
        }
    };

    const handleConfigSwitchChange = async (checked: boolean, key: string) => {
        if (!userConfig) return;

        try {
            // Set loading state
            setUserConfig((prev) => (prev ? { ...prev, loading: true } : null));

            // Call API to update config
            await clientFetch(`/api/proxy/user/v31/config/update`, {
                method: "PUT",
                body: JSON.stringify({
                    key: key,
                    value: checked ? "1" : "0",
                }),
            });

            // Update local state
            setUserConfig((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    [key]: checked,
                    loading: false,
                };
            });

            notifySuccess("配置更新成功");
        } catch (error) {
            console.error("更新配置失败", error);
            // Restore original state
            setUserConfig((prev) =>
                prev ? { ...prev, loading: false } : null,
            );
            fetchUserConfig();
        }
    };

    const handleSwitchChange = async (
        checked: boolean,
        paramKey: string,
        id: number,
    ) => {
        try {
            // Set loading state for the corresponding parameter
            setParams((prevParams) =>
                prevParams.map((param) =>
                    param.id === id ? { ...param, loading: true } : param,
                ),
            );

            // Call API to update parameter using PUT method
            await clientFetch(`/api/proxy/admin3/bus/params`, {
                method: "PUT",
                body: JSON.stringify({
                    paramKey: paramKey,
                    paramValue: checked.toString(),
                }),
            });

            // Update local state
            setParams((prevParams) =>
                prevParams.map((param) =>
                    param.id === id
                        ? {
                              ...param,
                              paramValue: checked.toString(),
                              loading: false,
                          }
                        : param,
                ),
            );

            notifySuccess("Parameter updated successfully");
        } catch (error) {
            console.error("Failed to update parameter", error);
            // Restore original state and clear loading state
            setParams((prevParams) =>
                prevParams.map((param) =>
                    param.id === id ? { ...param, loading: false } : param,
                ),
            );
            fetchParams();
        }
    };

    return (
        <div className="p-6 bg-[#f1f1f1] box-border h-full overflow-auto">
            <div className="bg-white p-6 rounded-md mb-6">
                <div className="space-y-4">
                    {params.map((param) => (
                        <div
                            key={param.id}
                            className="flex justify-between items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                            <div>
                                <div className="text-sm font-medium text-gray-800">
                                    {param.paramName}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {param.remark}
                                </p>
                            </div>
                            <Switch
                                checked={param.paramValue === "true"}
                                onChange={(checked) =>
                                    handleSwitchChange(
                                        checked,
                                        param.paramKey,
                                        param.id,
                                    )
                                }
                                loading={param.loading}
                                disabled={loading}
                            />
                        </div>
                    ))}
                </div>

                {/* User Config Section */}
                <div className="space-y-4">
                    {/* Personal Space */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <div>
                            <div className="text-sm font-medium text-gray-800">
                                个人空间
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                开启后，单个账号都能认证有个人空间，可在个人空间中进行搜索等操作；关闭后，所有用户无法进入个人空间，需加入团队才可进行搜索
                            </p>
                        </div>
                        <Switch
                            checked={userConfig?.is_private_team_open || false}
                            onChange={(checked) =>
                                handleConfigSwitchChange(
                                    checked,
                                    "is_private_team_open",
                                )
                            }
                            loading={userConfig?.loading}
                            disabled={configLoading || !userConfig}
                        />
                    </div>

                    {/* Platform Registration */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <div>
                            <div className="text-sm font-medium text-gray-800">
                                平台注册功能
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                关闭平台注册功能后，平台用户将无法自行注册账号都需要注册
                            </p>
                        </div>
                        <Switch
                            checked={userConfig?.can_register || false}
                            onChange={(checked) =>
                                handleConfigSwitchChange(
                                    checked,
                                    "can_register",
                                )
                            }
                            loading={userConfig?.loading}
                            disabled={configLoading || !userConfig}
                        />
                    </div>

                    {/* Password Recovery */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <div>
                            <div className="text-sm font-medium text-gray-800">
                                平台忘记密码功能
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                关闭平台忘记密码功能后，平台用户将无法通过忘记密码找回密码，只可以让超级管理员合管理员合重置密码
                            </p>
                        </div>
                        <Switch
                            checked={userConfig?.can_forgot_password || false}
                            onChange={(checked) =>
                                handleConfigSwitchChange(
                                    checked,
                                    "can_forgot_password",
                                )
                            }
                            loading={userConfig?.loading}
                            disabled={configLoading || !userConfig}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
