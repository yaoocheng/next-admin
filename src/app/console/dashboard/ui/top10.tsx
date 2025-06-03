interface DependencyItem {
    assetName: string;
    assetVersion: string;
    count: number;
    ecosystem: string;
    repository: string;
}

export default function Top10({
    dependencies = [],
    title = "",
}: {
    dependencies: DependencyItem[];
    title: string;
}) {
    return (
        <>
            <div className="flex-1 p-4 bg-white rounded-md">
                <div className="text-xl font-semibold text-[#1677ff] italic">
                    TOP 10
                </div>
                <div className="text-base font-medium text-171717 mb-4">
                    {title}
                </div>

                <div className="space-y-3">
                    {dependencies.length > 0 ? (
                        dependencies.map((item, index) => (
                            <div
                                key={index}
                                className="bg-[#f7f8fb] p-4 rounded-md shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="text-sm font-medium text-gray-900 mb-2">
                                    {item.assetName}
                                </div>
                                <div className="flex flex-wrap gap-x-6 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <span className="text-gray-500 text-xs">
                                            Version
                                        </span>
                                        <span className="font-medium">
                                            {item.assetVersion || "-"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-gray-500 text-xs">
                                            Repo Type
                                        </span>
                                        <span className="font-medium">
                                            {item.ecosystem || "-"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-gray-500 text-xs">
                                            Projects
                                        </span>
                                        <span className="font-medium">
                                            {item.count}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 italic">No data</div>
                    )}
                </div>
            </div>
        </>
    );
}
