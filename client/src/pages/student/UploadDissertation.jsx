import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import submissionService from '../../services/submissionService';
import userService from '../../services/userService';
import api from '../../config/api';
import { useNotification } from '../../context/NotificationContext';
import Loader from '../../components/common/Loader';
import { Upload, FileText, CheckCircle } from 'lucide-react';

const UploadDissertation = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const [formData, setFormData] = useState({
        title: '',
        abstract: '',
        departmentId: '',
        supervisorId: '',
        submissionMode: 'Initial Submission'
    });
    const [file, setFile] = useState(null);

    const [departments, setDepartments] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [deptRes, userRes] = await Promise.all([
                userService.getDepartments(),
                userService.getAllUsers() // We might need a specific endpoint for supervisors
            ]);
            setDepartments(deptRes.data);
            const sups = userRes.data.filter(u => u.role === 'supervisor');
            setSupervisors(sups);

            // If user has a department, pre-select it
            const meRes = await api.get('/auth/me'); // Simple way to get current user info
            if (meRes.data.departmentId) {
                setFormData(prev => ({ ...prev, departmentId: meRes.data.departmentId }));
            }
        } catch (error) {
            console.error("Error fetching form data", error);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            showNotification('error', 'Please upload your dissertation PDF.');
            return;
        }

        setLoading(true);
        const submissionData = new FormData();
        submissionData.append('title', formData.title);
        submissionData.append('abstract', formData.abstract);
        submissionData.append('departmentId', formData.departmentId);
        submissionData.append('supervisorId', formData.supervisorId);
        submissionData.append('submissionMode', formData.submissionMode);
        submissionData.append('file', file);

        try {
            await submissionService.submitDissertation(submissionData);
            showNotification('success', 'Dissertation submitted successfully!');
            navigate('/student/status'); // Redirect to status page
        } catch (error) {
            console.error(error);
            showNotification('error', error.response?.data?.message || 'Submission failed');
        }
        setLoading(false);
    };

    if (initialLoading) return <Loader />;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white px-6 py-5 border-b border-gray-200 sm:px-8 rounded-t-lg">
                <h1 className="text-2xl font-bold text-gray-900">Upload Dissertation</h1>
                <p className="mt-1 text-sm text-gray-500">Submit your dissertation for review by your supervisor.</p>
            </div>

            <div className="bg-white shadow rounded-lg p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Dissertation Title *</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter your dissertation title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    {/* Abstract */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Abstract *</label>
                        <textarea
                            required
                            rows={5}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Provide a brief summary of your dissertation (max 500 words)"
                            value={formData.abstract}
                            onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                        />
                    </div>

                    {/* Selections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Department *</label>
                            <select
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.departmentId}
                                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                            >
                                <option value="">Select department</option>
                                {departments.map(d => <option key={d._id} value={d._id}>{d.departmentName || d.name}</option>)}
                            </select>
                        </div>

                        {/* Supervisor Selection - Optional/Required based on logic */}
                        {/* If backend assigns automatically, remove this. Design showed "Select Supervisor" */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Supervisor *</label>
                            <select
                                // required // Uncomment if manual selection is enforced
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.supervisorId}
                                onChange={(e) => setFormData({ ...formData, supervisorId: e.target.value })}
                            >
                                <option value="">Select supervisor</option>
                                {supervisors
                                    .filter(s => !formData.departmentId || s.departmentId?._id === formData.departmentId || s.departmentId === formData.departmentId)
                                    .map(s => <option key={s._id} value={s._id}>{s.name} ({s.designation || 'Faculty'})</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Submission Mode *</label>
                            <select
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.submissionMode}
                                onChange={(e) => setFormData({ ...formData, submissionMode: e.target.value })}
                            >
                                <option value="Synopsis">Synopsis</option>
                                <option value="Initial Submission">Initial Submission</option>
                                <option value="Final Submission">Final Submission</option>
                            </select>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Dissertation File (PDF) *</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors">
                            <div className="space-y-1 text-center">
                                {!file ? (
                                    <>
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PDF up to 10MB</p>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <FileText className="h-12 w-12 text-indigo-500" />
                                        <p className="text-sm text-green-600 font-medium mt-2 flex items-center">
                                            {file.name} <CheckCircle className="h-4 w-4 ml-1" />
                                        </p>
                                        <button type="button" onClick={() => setFile(null)} className="text-xs text-red-500 hover:text-red-700 mt-1">Remove</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                        >
                            {loading ? <Loader className="h-5 w-5 text-white" /> : 'Submit Dissertation'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Submission Guidelines Side Panel (Optional - from design) */}
            {/* Could be added here or as a sidebar on desktop */}
        </div>
    );
};

export default UploadDissertation;
