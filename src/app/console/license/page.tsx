import { Card, Tag } from "antd";
import { serverFetch } from "@/lib/server-fetcher";
import dayjs from "dayjs";

interface LicenseInfo {
    server_sca: boolean;
    server_vw: boolean;
    server_sast: boolean;
    server_oscgw: boolean;
    server_ccm: boolean;
    sca_count: number;
    user_count: number;
    use_user_count: number;
    count_points: number;
    use_count_points: number;
    expire_time: string;
    detail: {
        AppId: string;
        Type: string;
        IssueTime: string;
        CustomerId: string;
        CompanyId: string;
        CustomerInfo: string;
        NotBeforeTime: string;
        ExpireTime: string;
        OutPutFile: boolean;
        Output: string;
        CountPoints: number;
        ScannerCount: number;
        ClientCount: number;
        SCACount: number;
        UserCount: number;
        AutonomousControlCount: number;
        SASTCount: number;
    };
}

export default async function License() {
    let licenseInfo: LicenseInfo = {};

    try {
        const res = await serverFetch<LicenseInfo>(
            `/platform3/org/system/license/info`,
            {
                method: "GET",
            },
        );
        licenseInfo = res;
    } catch (error) {
        console.log(error);
    }

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format("YYYY-MM-DD HH:mm:ss");
    };

    const getStatusTag = (status: boolean) => {
        return status ? (
            <Tag color="green">Enabled</Tag>
        ) : (
            <Tag color="red">Disabled</Tag>
        );
    };

    return (
        <div className="p-6 bg-[#f1f1f1] box-border h-full overflow-auto">
            <div className="bg-white p-6 rounded-md">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-gray-800 m-0">
                            Sumu - Software Composition Analysis
                        </h2>
                        <Tag color="blue">Activated</Tag>
                    </div>
                    <div className="text-sm text-gray-500">
                        Service expires on {formatDate(licenseInfo.expire_time)}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                            {licenseInfo.sca_count}个
                        </div>
                        <div className="text-gray-600">Detection Engines</div>
                    </Card>

                    <Card className="text-center">
                        <div className="text-2xl font-bold text-green-600 mb-2">
                            {licenseInfo.count_points === -1
                                ? "Unlimited"
                                : licenseInfo.count_points}
                        </div>
                        <div className="text-gray-600">Detection Count</div>
                    </Card>

                    <Card className="text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-2">
                            {licenseInfo.user_count}
                        </div>
                        <div className="text-gray-600">Users</div>
                        <div className="text-xs text-gray-400 mt-1">
                            {licenseInfo.use_user_count} users in use
                        </div>
                    </Card>

                    <Card className="text-center">
                        <div className="text-2xl font-bold text-orange-600 mb-2">
                            {licenseInfo.count_points === -1
                                ? "Unlimited"
                                : licenseInfo.count_points}
                        </div>
                        <div className="text-gray-600">Project Points</div>
                        <div className="text-xs text-gray-400 mt-1">
                            {licenseInfo.use_count_points} project points used
                        </div>
                    </Card>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                        License Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-gray-200 p-3 rounded">
                            <div className="text-sm font-medium text-gray-600 mb-1">
                                App ID
                            </div>
                            <div className="text-gray-800">
                                {licenseInfo.detail?.AppId}
                            </div>
                        </div>
                        <div className="border border-gray-200 p-3 rounded">
                            <div className="text-sm font-medium text-gray-600 mb-1">
                                License Type
                            </div>
                            <div>
                                <Tag color="blue">
                                    {licenseInfo.detail?.Type}
                                </Tag>
                            </div>
                        </div>
                        <div className="border border-gray-200 p-3 rounded">
                            <div className="text-sm font-medium text-gray-600 mb-1">
                                Customer Info
                            </div>
                            <div className="text-gray-800">
                                {licenseInfo.detail?.CustomerInfo}
                            </div>
                        </div>
                        <div className="border border-gray-200 p-3 rounded">
                            <div className="text-sm font-medium text-gray-600 mb-1">
                                Company ID
                            </div>
                            <div className="text-gray-800">
                                {licenseInfo.detail?.CompanyId}
                            </div>
                        </div>
                        <div className="border border-gray-200 p-3 rounded">
                            <div className="text-sm font-medium text-gray-600 mb-1">
                                Issue Time
                            </div>
                            <div className="text-gray-800">
                                {formatDate(licenseInfo.detail?.IssueTime)}
                            </div>
                        </div>
                        <div className="border border-gray-200 p-3 rounded">
                            <div className="text-sm font-medium text-gray-600 mb-1">
                                Effective Time
                            </div>
                            <div className="text-gray-800">
                                {formatDate(licenseInfo.detail?.NotBeforeTime)}
                            </div>
                        </div>
                        <div className="border border-gray-200 p-3 rounded md:col-span-2">
                            <div className="text-sm font-medium text-gray-600 mb-1">
                                Expiry Time
                            </div>
                            <div className="text-red-600 font-medium">
                                {formatDate(licenseInfo.detail?.ExpireTime)}
                            </div>
                        </div>
                    </div>
                </div>

                <Card title="Service Module Status">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span>Software Composition Analysis (SCA)</span>
                            {getStatusTag(licenseInfo.server_sca)}
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span>Vulnerability Scanning (VW)</span>
                            {getStatusTag(licenseInfo.server_vw)}
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span>
                                Static Application Security Testing (SAST)
                            </span>
                            {getStatusTag(licenseInfo.server_sast)}
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span>Open Source Governance (OSCGW)</span>
                            {getStatusTag(licenseInfo.server_oscgw)}
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span>Cloud Configuration Management (CCM)</span>
                            {getStatusTag(licenseInfo.server_ccm)}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
