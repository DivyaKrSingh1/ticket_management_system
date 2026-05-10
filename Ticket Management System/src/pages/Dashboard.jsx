import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../services/api';

const Dashboard = () => {
    const [reports, setReports] = useState(null);
    const [recentTickets, setRecentTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [reportsRes, ticketsRes] = await Promise.all([
                    API.get('/report/summary'),
                    API.get('/ticket/listTickets')
                ]);
                setReports(reportsRes.data);
                setRecentTickets(ticketsRes.data.tickets.slice(0, 5));
            } catch (error) {
                toast.error('Error fetching dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            'OPEN': 'bg-blue-100 text-blue-800',
            'IN PROGRESS': 'bg-yellow-100 text-yellow-800',
            'RESOLVED': 'bg-green-100 text-green-800',
            'CLOSED': 'bg-gray-100 text-gray-800',
            'ON HOLD': 'bg-orange-100 text-orange-800',
            'REOPENED': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getResolutionRate = () => {
        if (!reports || reports.totalTickets === 0) return 0;
        return Math.round(((reports.resolvedTickets + reports.closedTickets) / reports.totalTickets) * 100);
    };

    if (loading) {
        return <p className="text-center text-gray-500 mt-10">Loading dashboard...</p>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white p-8 rounded-xl mb-8">
                <h2 className="text-3xl font-bold mb-2">Welcome to Ticket Management System</h2>
                <p className="text-indigo-200">Manage, track, and resolve tickets efficiently</p>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div
                    onClick={() => navigate('/create-ticket')}
                    className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer border-l-4 border-green-500 transition-all hover:-translate-y-1"
                >
                    <h3 className="text-lg font-bold text-gray-800 mb-1">➕ Create Ticket</h3>
                    <p className="text-sm text-gray-500">Raise a new issue or task</p>
                </div>
                <div
                    onClick={() => navigate('/all-tickets')}
                    className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer border-l-4 border-blue-500 transition-all hover:-translate-y-1"
                >
                    <h3 className="text-lg font-bold text-gray-800 mb-1">📋 All Tickets</h3>
                    <p className="text-sm text-gray-500">View & manage all tickets</p>
                </div>
                <div
                    onClick={() => navigate('/my-tickets')}
                    className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer border-l-4 border-purple-500 transition-all hover:-translate-y-1"
                >
                    <h3 className="text-lg font-bold text-gray-800 mb-1">🎫 My Tickets</h3>
                    <p className="text-sm text-gray-500">Tickets assigned to you</p>
                </div>
                <div
                    onClick={() => navigate('/reports')}
                    className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer border-l-4 border-orange-500 transition-all hover:-translate-y-1"
                >
                    <h3 className="text-lg font-bold text-gray-800 mb-1">📊 Reports</h3>
                    <p className="text-sm text-gray-500">View detailed analytics</p>
                </div>
            </div>

            {/* Stats Overview */}
            {reports && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                        <div className="bg-white p-5 rounded-xl shadow text-center">
                            <p className="text-3xl font-bold text-indigo-900">{reports.totalTickets}</p>
                            <p className="text-sm text-gray-500 mt-1">Total</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow text-center">
                            <p className="text-3xl font-bold text-green-600">{reports.resolvedTickets}</p>
                            <p className="text-sm text-gray-500 mt-1">Resolved</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow text-center">
                            <p className="text-3xl font-bold text-yellow-600">{reports.pendingTickets}</p>
                            <p className="text-sm text-gray-500 mt-1">Pending</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow text-center">
                            <p className="text-3xl font-bold text-gray-600">{reports.closedTickets}</p>
                            <p className="text-sm text-gray-500 mt-1">Closed</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow text-center">
                            <p className="text-3xl font-bold text-purple-600">{reports.avgResolutionTime}</p>
                            <p className="text-sm text-gray-500 mt-1">Avg Resolution</p>
                        </div>
                    </div>

                    {/* Resolution Progress Bar */}
                    <div className="bg-white p-6 rounded-xl shadow mb-8">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-bold text-gray-800">Resolution Rate</h3>
                            <span className="text-2xl font-bold text-indigo-900">{getResolutionRate()}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-gradient-to-r from-indigo-600 to-green-500 h-4 rounded-full transition-all duration-500"
                                style={{ width: `${getResolutionRate()}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            {reports.resolvedTickets + reports.closedTickets} out of {reports.totalTickets} tickets resolved or closed
                        </p>
                    </div>
                </>
            )}

            {/* Recent Tickets Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-bold text-indigo-900">Recent Tickets</h3>
                    <button
                        onClick={() => navigate('/all-tickets')}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        View All →
                    </button>
                </div>
                {recentTickets.length > 0 ? (
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm">
                                <th className="py-3 px-6 text-left">Title</th>
                                <th className="py-3 px-6 text-left">Status</th>
                                <th className="py-3 px-6 text-left">Assigned To</th>
                                <th className="py-3 px-6 text-left">Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTickets.map(ticket => (
                                <tr key={ticket._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-6 font-medium">{ticket.title}</td>
                                    <td className="py-3 px-6">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6 text-gray-600">{ticket.assignedTo?.name || 'Unassigned'}</td>
                                    <td className="py-3 px-6 text-gray-500 text-sm">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        <p>No tickets yet. Start by creating your first ticket!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
