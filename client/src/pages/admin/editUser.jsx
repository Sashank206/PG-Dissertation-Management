import { useParams } from "react-router-dom";

const EditUser = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Edit User</h1>
      <p className="text-gray-600 mt-2">User ID: {id}</p>
    </div>
  );
};

export default EditUser;



// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import userService from "../../services/userService";
// import { useNotification } from "../../context/NotificationContext";
// import Loader from "../../components/common/Loader";

// const EditUser = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { showNotification } = useNotification();

//   const [loading, setLoading] = useState(true);
//   const [departments, setDepartments] = useState([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     role: "student",
//     departmentId: "",
//     designation: ""
//   });

//   useEffect(() => {
//     fetchUser();
//     fetchDepartments();
//   }, []);

//   const fetchUser = async () => {
//     try {
//       const res = await userService.getUserById(id);
//       const user = res.data;

//       setFormData({
//         name: user.name || "",
//         email: user.email || "",
//         role: user.role || "student",
//         departmentId: user.department?._id || "",
//         designation: user.designation || ""
//       });
//     } catch (error) {
//       showNotification("error", "Failed to load user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDepartments = async () => {
//     const res = await userService.getDepartments();
//     setDepartments(res.data);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await userService.updateUser(id, formData);
//       showNotification("success", "User updated successfully");
//       navigate("/admin/users");
//     } catch (error) {
//       showNotification("error", "Failed to update user");
//     }
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
//       <h2 className="text-xl font-bold mb-6">Edit User</h2>

//       <form onSubmit={handleSubmit} className="space-y-5">

//         {/* Name */}
//         <div>
//           <label className="block text-sm font-medium">Full Name</label>
//           <input
//             type="text"
//             required
//             value={formData.name}
//             onChange={e => setFormData({ ...formData, name: e.target.value })}
//             className="mt-1 w-full border rounded px-3 py-2"
//           />
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-sm font-medium">Email</label>
//           <input
//             type="email"
//             required
//             value={formData.email}
//             onChange={e => setFormData({ ...formData, email: e.target.value })}
//             className="mt-1 w-full border rounded px-3 py-2"
//           />
//         </div>

//         {/* Role */}
//         <div>
//           <label className="block text-sm font-medium">Role</label>
//           <select
//             value={formData.role}
//             onChange={e =>
//               setFormData({
//                 ...formData,
//                 role: e.target.value,
//                 designation: ""
//               })
//             }
//             className="mt-1 w-full border rounded px-3 py-2"
//           >
//             <option value="student">Student</option>
//             <option value="supervisor">Supervisor</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         {/* Department */}
//         <div>
//           <label className="block text-sm font-medium">Department</label>
//           <select
//             value={formData.departmentId}
//             onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
//             className="mt-1 w-full border rounded px-3 py-2"
//           >
//             <option value="">Select Department</option>
//             {departments.map(dep => (
//               <option key={dep._id} value={dep._id}>
//                 {dep.departmentName || dep.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Designation */}
//         {formData.role === "supervisor" && (
//           <div>
//             <label className="block text-sm font-medium">Designation</label>
//             <input
//               type="text"
//               required
//               value={formData.designation}
//               onChange={e =>
//                 setFormData({ ...formData, designation: e.target.value })
//               }
//               className="mt-1 w-full border rounded px-3 py-2"
//             />
//           </div>
//         )}

//         <div className="flex justify-end gap-3 pt-4">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 border rounded"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-6 py-2 bg-indigo-600 text-white rounded"
//           >
//             Update User
//           </button>
//         </div>

//       </form>
//     </div>
//   );
// };

// export default EditUser;
