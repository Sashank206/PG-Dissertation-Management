import { useState, useEffect } from 'react';
import queryService from '../../services/queryService';
import { MessageSquare, CheckCircle, Clock, AlertCircle, Send, X } from 'lucide-react';
import Loader from '../../components/common/Loader';
import { useNotification } from '../../context/NotificationContext';
import StatusBadge from '../../components/common/StatusBadge';

const QueryList = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answeringId, setAnsweringId] = useState(null);
    const [response, setResponse] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        fetchQueries();
    }, []);

    /* ================= FETCH QUERIES ================= */
    const fetchQueries = async () => {
        try {
            setLoading(true);
            const data = await queryService.getQueries();
            setQueries(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch queries", error);
            showNotification('error', 'Failed to load student queries');
            setQueries([]);
        } finally {
            setLoading(false);
        }
    };

    /* ================= ANSWER QUERY ================= */
    const handleAnswer = async (id) => {
        if (!response.trim()) {
            showNotification('error', 'Please enter a response');
            return;
        }

        try {
            setSubmitting(true);
            await queryService.answerQuery(id, response);
            showNotification('success', 'Response sent successfully');
            setAnsweringId(null);
            setResponse('');
            fetchQueries();
        } catch (error) {
            console.error(error);
            showNotification('error', 'Failed to send response');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Open': return <AlertCircle className="h-4 w-4 text-blue-500" />;
            case 'Pending': return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'Closed': return <CheckCircle className="h-4 w-4 text-green-500" />;
            default: return null;
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
            {/* HEADER */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <MessageSquare className="h-7 w-7 mr-3 text-indigo-600" />
                        Student Queries
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Respond to student questions and provide clarifications
                    </p>
                </div>
                <div className="bg-indigo-50 px-4 py-2 rounded-lg text-indigo-700 font-medium text-sm">
                    {queries.filter(q => q.status !== 'Closed').length} Unresolved
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader />
                </div>
            ) : queries.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 text-center">
                    <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-xl font-medium">No queries found</p>
                    <p className="text-sm">You'll see student questions here when they are submitted.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {queries.map(q => (
                        <div
                            key={q._id}
                            className={`bg-white rounded-xl shadow-sm border transition-all duration-200 overflow-hidden ${q.status !== 'Closed' ? 'border-indigo-100 ring-1 ring-indigo-50' : 'border-gray-100'
                                }`}
                        >
                            <div className="p-5">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${q.status !== 'Closed' ? 'bg-indigo-50' : 'bg-gray-50'}`}>
                                            <MessageSquare className={`h-5 w-5 ${q.status !== 'Closed' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 leading-tight">
                                                {q.subject}
                                            </h3>
                                            <div className="flex items-center mt-1 text-xs text-gray-500 space-x-2">
                                                <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                                    {q.studentId?.name || 'Student'}
                                                </span>
                                                <span>•</span>
                                                <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100">
                                        {getStatusIcon(q.status)}
                                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            {q.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 p-4 bg-gray-50/50 rounded-lg border border-gray-100">
                                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{q.question}</p>
                                </div>

                                {q.status !== 'Closed' ? (
                                    <div className="mt-4">
                                        {answeringId === q._id ? (
                                            <div className="space-y-3 animate-slide-down">
                                                <textarea
                                                    className="w-full border border-indigo-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-xl p-3 text-sm transition-all"
                                                    rows={4}
                                                    placeholder="Provide your clarification here..."
                                                    value={response}
                                                    onChange={(e) => setResponse(e.target.value)}
                                                />
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleAnswer(q._id)}
                                                        disabled={submitting}
                                                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
                                                    >
                                                        {submitting ? (
                                                            <Loader className="h-4 w-4 mr-2" />
                                                        ) : (
                                                            <Send className="h-4 w-4 mr-2" />
                                                        )}
                                                        Submit Response
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setAnsweringId(null);
                                                            setResponse('');
                                                        }}
                                                        className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all flex items-center"
                                                    >
                                                        <X className="h-4 w-4 mr-2" />
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setAnsweringId(q._id)}
                                                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-bold tracking-tight py-2 px-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-all"
                                            >
                                                <Send className="h-4 w-4 mr-2" />
                                                Click to Answer
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mt-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
                                        <div className="flex items-center text-green-800 text-xs font-bold uppercase mb-2">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Your Clarification
                                        </div>
                                        <p className="text-green-700 text-sm italic whitespace-pre-wrap">
                                            "{q.response || q.Response}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QueryList;
