import { useState, useEffect } from 'react';
import queryService from '../../services/queryService';
import userService from '../../services/userService';
import { useNotification } from '../../context/NotificationContext';
import Loader from '../../components/common/Loader';
import { MessageSquare, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const Queries = () => {
    const { showNotification } = useNotification();

    const [queries, setQueries] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        supervisorId: '',
        subject: '',
        question: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    /* ================= FETCH DATA ================= */
    const fetchData = async () => {
    try {
        setLoading(true);

        const queriesData = await queryService.getQueries();
        setQueries(queriesData);

        const usersRes = await userService.getAllUsers();
        const users = Array.isArray(usersRes)
            ? usersRes
            : usersRes.data || [];

        setSupervisors(users.filter(u => u.role === 'supervisor'));

    } catch (error) {
        console.error("Error fetching queries", error);
        showNotification('error', 'Failed to load queries');
    } finally {
        setLoading(false);
    }
};


    /* ================= SUBMIT QUERY ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await queryService.createQuery(formData);

            showNotification('success', 'Query submitted successfully');
            setShowModal(false);
            setFormData({ supervisorId: '', subject: '', question: '' });

            fetchData();
        } catch (error) {
            console.error(error);
            showNotification('error', 'Failed to submit query');
        } finally {
            setSubmitting(false);
        }
    };

    /* ================= STATUS ICON ================= */
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Open':
                return <AlertCircle className="h-5 w-5 text-blue-500" />;
            case 'Pending':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'Closed':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">

            {/* HEADER */}
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Queries</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage and track your questions to supervisors
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    New Query
                </button>
            </div>

            {/* QUERIES LIST */}
            <div className="grid grid-cols-1 gap-6">
                {queries.length > 0 ? (
                    queries.map((q) => (
                        <div
                            key={q._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-indigo-50 p-2 rounded-lg">
                                            <MessageSquare className="h-6 w-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {q.subject}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                To: {q.supervisorId?.name || 'Supervisor'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200">
                                        {getStatusIcon(q.status)}
                                        <span className="text-sm font-medium text-gray-700">
                                            {q.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <p className="font-medium text-gray-700">Question:</p>
                                    <p className="text-gray-600 mt-1">{q.question}</p>
                                </div>

                                {/* ✅ FIX: SHOW RESPONSE PROPERLY */}
                                {(q.response || q.Response) && (
                                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
                                    <p className="text-green-800 leading-relaxed font-bold">
                                    Supervisor Response:
                                    </p>
                                    <p className="text-green-700 mt-1">
                                    {q.response || q.Response}
                                    </p>
                                </div>
                                )}


                                <div className="mt-4 text-xs text-gray-400 flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Submitted on{" "}
                                    {new Date(q.createdAt).toLocaleDateString()}{" "}
                                    at{" "}
                                    {new Date(q.createdAt).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500">
                        <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                        <p className="text-xl font-medium">No queries found</p>
                        <p className="text-sm">
                            Click 'New Query' to start a conversation with a supervisor.
                        </p>
                    </div>
                )}
            </div>

            {/* ================= MODAL ================= */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setShowModal(false)}
                    ></div>

                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
                        <div className="bg-indigo-600 px-6 py-4">
                            <h3 className="text-xl font-bold text-white flex items-center">
                                <Send className="h-5 w-5 mr-2" />
                                Post a New Query
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <select
                                required
                                className="w-full bg-gray-50 border rounded-xl px-4 py-2"
                                value={formData.supervisorId}
                                onChange={(e) =>
                                    setFormData({ ...formData, supervisorId: e.target.value })
                                }
                            >
                                <option value="">Select Supervisor</option>
                                {supervisors.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                required
                                className="w-full bg-gray-50 border rounded-xl px-4 py-2"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={(e) =>
                                    setFormData({ ...formData, subject: e.target.value })
                                }
                            />

                            <textarea
                                required
                                rows={4}
                                className="w-full bg-gray-50 border rounded-xl px-4 py-2"
                                placeholder="Your Question"
                                value={formData.question}
                                onChange={(e) =>
                                    setFormData({ ...formData, question: e.target.value })
                                }
                            />

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 border rounded-xl py-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-indigo-600 text-white rounded-xl py-2"
                                >
                                    {submitting ? "Sending..." : "Send Query"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Queries;
