import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const res = await API.get('/admin/stats');
                setStats(res.data);
            } catch (error) {
                toast.error('Access denied or error fetching stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="bg-gradient-to-r from-red-800 to-red-600 text-white p-8 rounded-xl mb-8">
                <h2 className="text-3xl font-bold mb-2">Admin Panel</h2>
                <p className="text-red-200">Manage users, tickets, and system settings</p>
            </div>

            {/* Quick Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div onClick={() => navigate('/admin/users')} className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer border-l-4 border-blue-500 transition-all hover:-translate-y-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">👥 Manage Users</h3>
                    <p className="text-sm text-gray-500">View, edit, assign roles, delete users</p>
                </div>
                <div onClick={() => navigate('/admin/tickets')} className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer border-l-4 border-green-500 transition-all hover:-translate-y-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">🎫 Manage Tickets</h3>
                    <p className="text-sm text-gray-500">Edit, reassign, force close tickets</p>
                </div>
                
            </div>

            {/* Stats */}
            {stats && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-5 rounded-xl shadow text-center">
                            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                            <p className="text-sm text-gray-500 mt-1">Total Users</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow text-center">
                            <p className="text-3xl font-bold text-red-600">{stats.totalAdmins}</p>
                            <p className="text-sm text-gray-500 mt-1">Admins</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow text-center">
                            <p className="text-3xl font-bold text-green-600">{stats.totalEmployees}</p>
                            <p className="text-sm text-gray-500 mt-1">Employees</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow text-center">
                            <p className="text-3xl font-bold text-indigo-600">{stats.totalTickets}</p>
                            <p className="text-sm text-gray-500 mt-1">Total Tickets</p>
                        </div>
                    </div>

                    {/* Employee Performance */}
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-bold text-gray-800">Employee Performance</h3>
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm">
                                    <th className="py-3 px-6 text-left">Name</th>
                                    <th className="py-3 px-6 text-left">Email</th>
                                    <th className="py-3 px-6 text-left">Assigned</th>
                                    <th className="py-3 px-6 text-left">Resolved</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.employeeStats.map((emp, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-6 font-medium">{emp.name}</td>
                                        <td className="py-3 px-6 text-gray-600">{emp.email}</td>
                                        <td className="py-3 px-6">{emp.totalAssigned}</td>
                                        <td className="py-3 px-6 text-green-600 font-bold">{emp.resolved}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
