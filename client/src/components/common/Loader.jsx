const Loader = ({ className = "" }) => {
    return (
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 ${className}`}></div>
    );
};

export default Loader;
