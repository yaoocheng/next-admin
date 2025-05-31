import StatisticsCards from "./ui/cards";
import IssueChart from "./ui/issue-chart";
import VulnChart from "./ui/vuln-chart";
import LocalVuln from "./ui/local-vuln";
import Top10 from "./ui/top10";
import { serverFetch } from "@/lib/server-fetcher";

interface DependencyItem {
    assetName: string;
    assetVersion: string;
    count: number;
    ecosystem: string;
    repository: string;
}

export default async function Dashboard() {
    let introComps: DependencyItem[] = [];
    let strongFixComps: DependencyItem[] = [];
    try {
        const [res1, res2] = await Promise.all([
            serverFetch<DependencyItem[]>(
                `/admin3/bus/statistical_diary/compTaskInfo`,
                {
                    method: "GET",
                },
            ),
            serverFetch<DependencyItem[]>(
                `/admin3/bus/statistical_diary/compTaskInfo?highestSuggest=4`,
                {
                    method: "GET",
                },
            ),
        ]);
        introComps = res1?.data || [];
        strongFixComps = res2?.data || [];
    } catch (err) {
        console.error("Failed to fetch statistics data:", err);
    }

    return (
        <div className="p-6 h-full bg-[#f1f1f1] overflow-auto">
            <StatisticsCards />

            <div className="flex items-center gap-6 mb-6">
                <div className="flex-1 h-[386px] p-6 bg-white rounded-md">
                    <h1 className="mb-6 font-medium text-xl">
                        Security Issue Status
                    </h1>
                    <IssueChart />
                </div>
                <div className="flex-1 h-[386px] p-6 bg-white rounded-md">
                    <h1 className="mb-6 font-medium text-xl">
                        Total Vulnerability
                    </h1>
                    <VulnChart />
                </div>
            </div>

            <div className="flex items-center gap-6 mb-6">
                {/* <div className="flex-1 h-[400px] p-6 bg-white rounded-md">
                    <h1 className="mb-6 font-medium text-xl">
                        Component and Vulnerability Trend
                    </h1>
                    <CompVulnChart />
                </div> */}
                <div className="flex-1 h-[460px] p-6 bg-white rounded-md">
                    <h1 className="mb-6 font-medium text-xl">
                        Local Vulnerability Update Record
                    </h1>
                    <LocalVuln />
                </div>
            </div>

            <div className="flex gap-6">
                <Top10
                    dependencies={introComps}
                    title="Introduction Components"
                />
                <Top10
                    dependencies={strongFixComps}
                    title="Strong Recommend Components"
                />
            </div>
        </div>
    );
}
