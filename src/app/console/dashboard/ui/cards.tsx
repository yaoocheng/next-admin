import {
    UserOutlined,
    FileTextOutlined,
    SafetyOutlined,
    AppstoreOutlined,
    BugOutlined,
} from "@ant-design/icons";
import { serverFetch } from "@/lib/server-fetcher";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
}

interface CountInfo {
    userCount: number;
    taskCount: number;
    securityCount: number;
    compCount: number;
    triggersCompCount: number;
}

const StatCard = ({ title, value, icon }: StatCardProps) => {
    return (
        <div className="bg-white rounded-md shadow-sm p-4 flex items-start justify-between">
            <div className="min-w-0 flex-1 mr-4">
                <div className="text-sm mb-1 truncate">{title}</div>
                <div className="text-2xl font-bold">{value}</div>
            </div>
            <div className="text-2xl text-gray-500">{icon}</div>
        </div>
    );
};

export default async function StatisticsCards() {
    let countInfo = {
        userCount: 0,
        taskCount: 0,
        securityCount: 0,
        compCount: 0,
        triggersCompCount: 0,
    };

    try {
        const res = await serverFetch<CountInfo[]>(
            `/admin3/bus/statistical_diary/countInfo`,
            {
                method: "GET",
            },
        );
        countInfo = res.data?.[0] || countInfo;
    } catch (err) {
        console.error("Failed to fetch statistics data:", err);
    }

    const stats = [
        {
            title: "Active Users",
            key: "userCount",
            icon: <UserOutlined />,
        },
        {
            title: "Detection Projects",
            key: "taskCount",
            icon: <FileTextOutlined />,
        },
        {
            title: "Security Issues",
            key: "securityCount",
            icon: <SafetyOutlined />,
        },
        {
            title: "Components",
            key: "compCount",
            icon: <AppstoreOutlined />,
        },
        {
            title: "Vulnerable Components",
            key: "triggersCompCount",
            icon: <BugOutlined />,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    value={countInfo[stat.key as keyof typeof countInfo]}
                    icon={stat.icon}
                />
            ))}
        </div>
    );
}
