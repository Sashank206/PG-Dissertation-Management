const StatusBadge = ({ status }) => {
    const styles = {
        pending: "bg-yellow-100 text-yellow-800",
        approved: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
        revision: "bg-orange-100 text-orange-800",
        open: "bg-blue-100 text-blue-800",
        closed: "bg-gray-100 text-gray-800",
        submitted: "bg-indigo-100 text-indigo-800",
        verified: "bg-teal-100 text-teal-800",
        default: "bg-gray-100 text-gray-800"
    };

    const normalizedStatus = status?.toLowerCase() || 'default';
    const className = styles[normalizedStatus] || styles.default;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${className}`}>
            {status || 'Unknown'}
        </span>
    );
};

export default StatusBadge;
