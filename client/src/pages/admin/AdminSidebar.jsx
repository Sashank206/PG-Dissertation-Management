import {
    Activity,
    Server,
    Database,
    Clock,
    Bell
} from 'lucide-react';

const AdminRightPanel = () => {
    return (
        <aside className="w-80 p-6 space-y-6 bg-gray-50">

            {/* SYSTEM HEALTH */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-6">
                    <Activity className="h-5 w-5 text-indigo-600" />
                    System Health
                </h3>

                <div className="space-y-5 text-sm">
                    <HealthRow
                        icon={Server}
                        label="API Status"
                        value="Operational"
                        color="green"
                    />
                    <HealthRow
                        icon={Database}
                        label="Database"
                        value="Connected"
                        color="green"
                    />
                    <HealthRow
                        icon={Clock}
                        label="Response Time"
                        value="120 ms"
                        color="blue"
                    />
                </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-6">
                    <Bell className="h-5 w-5 text-indigo-600" />
                    Recent Activity
                </h3>

                <div className="space-y-5 text-sm">
                    <ActivityRow title="New student registered" time="2 mins ago" />
                    <ActivityRow title="Dissertation approved" time="10 mins ago" />
                    <ActivityRow title="Supervisor assigned" time="1 hour ago" />
                </div>
            </div>
        </aside>
    );
};

/* ---------- Sub Components ---------- */

const HealthRow = ({ icon: Icon, label, value, color }) => {
    const badgeColors = {
        green: 'bg-green-100 text-green-700',
        blue: 'bg-blue-100 text-blue-700',
        red: 'bg-red-100 text-red-700'
    };

    return (
        <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-3 text-gray-600">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
            </div>

            {/* Right */}
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColors[color]}`}
            >
                {value}
            </span>
        </div>
    );
};

const ActivityRow = ({ title, time }) => (
    <div className="flex items-center justify-between">
        <span className="text-gray-700">{title}</span>
        <span className="text-xs text-gray-400">{time}</span>
    </div>
);

export default AdminRightPanel;
