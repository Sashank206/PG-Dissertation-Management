

const StatCard = ({ title, value, icon: Icon, color = "indigo", trend }) => {
    const colorClasses = {
        indigo: "bg-indigo-100 text-indigo-600",
        green: "bg-green-100 text-green-600",
        red: "bg-red-100 text-red-600",
        yellow: "bg-yellow-100 text-yellow-600",
        blue: "bg-blue-100 text-blue-600"
    };

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className={`rounded-md p-3 ${colorClasses[color] || colorClasses.indigo}`}>
                            {Icon && <Icon className="h-6 w-6" />}
                        </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                            <dd className="flex flex-col">
                                <div className="text-2xl font-bold text-gray-900">{value}</div>
                                {trend && (
                                    <div className="mt-1 text-xs font-semibold text-gray-400">
                                        {trend}
                                    </div>
                                )}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
