import { useEffect, useState } from "react";
import api from "../../config/api";
import Loader from "../../components/common/Loader";
import { Plus, Trash2, Pencil } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";

const Departments = () => {
    const { showNotification } = useNotification();

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        departmentName: "",
        departmentCode: ""
    });

    /* -----------------------------
       FETCH DEPARTMENTS
    ------------------------------ */
    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const res = await api.get("/departments");
            setDepartments(res.data || []);
        } catch (error) {
            showNotification("error", "Failed to load departments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    /* -----------------------------
       CREATE / UPDATE DEPARTMENT
    ------------------------------ */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await api.put(`/departments/${editingId}`, formData);
                showNotification("success", "Department updated");
            } else {
                await api.post("/departments", formData);
                showNotification("success", "Department created");
            }

            setShowModal(false);
            setEditingId(null);
            setFormData({ departmentName: "", departmentCode: "" });
            fetchDepartments();
        } catch (error) {
            showNotification("error", "Operation failed");
        }
    };

    /* -----------------------------
       DELETE DEPARTMENT
    ------------------------------ */
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this department?")) return;

        try {
            await api.delete(`/departments/${id}`);
            showNotification("success", "Department deleted");
            fetchDepartments();
        } catch (error) {
            showNotification("error", "Failed to delete department");
        }
    };

    /* -----------------------------
       OPEN EDIT MODAL
    ------------------------------ */
    const openEdit = (dept) => {
        setEditingId(dept._id);
        setFormData({
            departmentName: dept.departmentName,
            departmentCode: dept.departmentCode
        });
        setShowModal(true);
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                    Departments
                </h1>

                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ departmentName: "", departmentCode: "" });
                        setShowModal(true);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Department
                </button>
            </div>

            {/* LIST */}
            <div className="bg-white shadow rounded-lg">
                <ul className="divide-y divide-gray-200">
                    {departments.map((dept) => (
                        <li
                            key={dept._id}
                            className="px-6 py-4 flex justify-between items-center hover:bg-gray-50"
                        >
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    {dept.departmentName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Code: {dept.departmentCode}
                                </p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => openEdit(dept)}
                                    className="text-indigo-600 hover:text-indigo-800"
                                >
                                    <Pencil className="h-5 w-5" />
                                </button>

                                <button
                                    onClick={() => handleDelete(dept._id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </li>
                    ))}

                    {departments.length === 0 && (
                        <li className="px-6 py-6 text-center text-gray-500">
                            No departments found.
                        </li>
                    )}
                </ul>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {editingId ? "Edit Department" : "Add Department"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Department Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 w-full border rounded-md px-3 py-2"
                                    value={formData.departmentName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            departmentName: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Department Code
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 w-full border rounded-md px-3 py-2"
                                    value={formData.departmentCode}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            departmentCode: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    {editingId ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Departments;
