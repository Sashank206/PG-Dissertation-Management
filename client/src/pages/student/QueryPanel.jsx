import { useState, useEffect } from 'react';
import queryService from '../../services/queryService';
import userService from '../../services/userService';
import Loader from '../../components/common/Loader';
import { MessageSquare, Send, X } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const QueryPanel = () => {
    const { showNotification } = useNotification();

    const [supervisors, setSupervisors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        subject: '',
        question: '',
        supervisorId: ''
    });

    useEffect(() => {
        fetchSupervisors();
    }, []);

    const fetchSupervisors = async () => {
        try {
            setLoading(true);
            const usersRes = await userService.getAllUsers();
            const users = Array.isArray(usersRes) ? usersRes : usersRes.data || [];
            setSupervisors(users.filter(u => u.role === 'supervisor'));
        } catch (error) {
            console.error("Failed to fetch supervisors", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.supervisorId) {
            showNotification('error', 'Please select a supervisor');
            return;
        }

        try {
            setSubmitting(true);
            await queryService.createQuery(formData);
            showNotification('success', 'Query sent successfully');
            setShowModal(false);
            setFormData({ subject: '', question: '', supervisorId: '' });
        } catch (error) {
            console.error(error);
            showNotification('error', 'Failed to send query');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Loader className="h-6 w-6 mx-auto" />;
    }

    return (
        <>
            <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                onClick={() => setShowModal(true)}
            >
                <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                        <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight">Ask a Question</h3>
                        <p className="text-indigo-100 text-sm mt-1">Directly message your supervisor</p>
                    </div>
                </div>
            </div>

            {/* ================= MODAL ================= */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    ></div>

                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-slide-up">
                        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white flex items-center">
                                <Send className="h-5 w-5 mr-3" />
                                New Query
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-indigo-100 hover:text-white transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Supervisor</label>
                                <select
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Subject</label>
                                <input
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="Quick summary of your question"
                                    value={formData.subject}
                                    onChange={(e) =>
                                        setFormData({ ...formData, subject: e.target.value })
                                    }
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Your Question</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Type your message here..."
                                    value={formData.question}
                                    onChange={(e) =>
                                        setFormData({ ...formData, question: e.target.value })
                                    }
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 border border-gray-200 rounded-xl py-2.5 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-indigo-600 text-white rounded-xl py-2.5 font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center"
                                >
                                    {submitting ? (
                                        <Loader className="h-4 w-4 mr-2" />
                                    ) : (
                                        <Send className="h-4 w-4 mr-2" />
                                    )}
                                    {submitting ? "Sending..." : "Send Query"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default QueryPanel;
