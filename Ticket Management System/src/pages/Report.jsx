import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../services/api';

const Reports = () => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
              const res = await API.get('/report/summary');
                setReports(res.data);
            } catch (error) {
                toast.error('Error fetching reports');
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6">Reports</h2>
            {loading ? (
                <p className="text-gray-500">Loading reports...</p>
            ) : reports ? (
                <div>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow text-center">
                            <h3 className="text-gray-500 text-sm mb-2">Total Tickets</h3>
                            <p className="text-3xl font-bold text-indigo-900">{reports.totalTickets}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow text-center">
                            <h3 className="text-gray-500 text-sm mb-2">Resolved</h3>
                            <p className="text-3xl font-bold text-green-600">{reports.resolvedTickets}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow text-center">
                            <h3 className="text-gray-500 text-sm mb-2">Pending</h3>
                            <p className="text-3xl font-bold text-yellow-600">{reports.pendingTickets}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow text-center">
                            <h3 className="text-gray-500 text-sm mb-2">Closed</h3>
                            <p className="text-3xl font-bold text-gray-600">{reports.closedTickets}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow text-center">
                            <h3 className="text-gray-500 text-sm mb-2">Avg Resolution</h3>
                            <p className="text-3xl font-bold text-purple-600">{reports.avgResolutionTime}</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-indigo-900 text-white">
                                    <th className="py-4 px-6 text-left">Metric</th>
                                    <th className="py-4 px-6 text-left">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="py-4 px-6 font-medium">Total Tickets</td>
                                    <td className="py-4 px-6 text-lg font-bold">{reports.totalTickets}</td>
                                </tr>
                                <tr className="border-b bg-gray-50">
                                    <td className="py-4 px-6 font-medium">Resolved Tickets</td>
                                    <td className="py-4 px-6 text-lg font-bold text-green-600">{reports.resolvedTickets}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-4 px-6 font-medium">Closed Tickets</td>
                                    <td className="py-4 px-6 text-lg font-bold text-gray-600">{reports.closedTickets}</td>
                                </tr>
                                <tr className="border-b bg-gray-50">
                                    <td className="py-4 px-6 font-medium">Pending Tickets</td>
                                    <td className="py-4 px-6 text-lg font-bold text-yellow-600">{reports.pendingTickets}</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-6 font-medium">Avg Resolution Time</td>
                                    <td className="py-4 px-6 text-lg font-bold text-purple-600">{reports.avgResolutionTime}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">No report data available</p>
            )}
        </div>
    );
};

export default Reports;
