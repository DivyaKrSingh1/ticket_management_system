import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../services/api';

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchMyTickets = async () => {
        setLoading(true);
        try {
            const res = await API.get('/ticket/myTickets');
            setTickets(res.data.tickets);
        } catch (error) {
            toast.error('Error fetching your tickets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyTickets();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            let body = { status: newStatus };
            if (newStatus === 'RESOLVED') {
                const note = prompt('Enter resolution note:');
                if (!note) return toast.error('Resolution note is required');
                body.resolutionNote = note;
            }
            await API.put(`/ticket/${id}/update`, body);
            toast.success('Ticket updated!');
            fetchMyTickets();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating ticket');
        }
    };

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

    return (
        <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6">My Tickets</h2>
            {loading ? (
                <p className="text-gray-500">Loading your tickets...</p>
            ) : (
                <div className="grid gap-4">
                    {tickets.length > 0 ? tickets.map(ticket => (
                        <div key={ticket._id} className="bg-white p-6 rounded-xl shadow">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold text-indigo-900">{ticket.title}</h3>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <p className="text-gray-600 mt-2">{ticket.description}</p>
                            <div className="mt-3 text-sm text-gray-500 flex flex-wrap gap-4">
                                <span><strong>Created By:</strong> {ticket.createdBy?.name}</span>
                                <span><strong>Date:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                            </div>
                            {ticket.resolutionNote && (
                                <p className="mt-2 text-sm text-green-700"><strong>Resolution:</strong> {ticket.resolutionNote}</p>
                            )}
                            <div className="mt-4">
                                <select
                                    onChange={(e) => handleStatusUpdate(ticket._id, e.target.value)}
                                    defaultValue=""
                                    className="p-2 border border-gray-300 rounded-lg text-sm"
                                >
                                    <option value="" disabled>Change Status</option>
                                    <option value="IN PROGRESS">IN PROGRESS</option>
                                    <option value="RESOLVED">RESOLVED</option>
                                    <option value="CLOSED">CLOSED</option>
                                    <option value="ON HOLD">ON HOLD</option>
                                </select>
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-500">No tickets assigned to you</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyTickets;
