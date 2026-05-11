import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../services/api';

const AdminTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ticketsRes, usersRes] = await Promise.all([
                API.get('/ticket/listTickets'),
                API.get('/admin/users')
            ]);
            setTickets(ticketsRes.data.tickets);
            setUsers(usersRes.data.users);
        } catch (error) {
            toast.error('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleReassign = async (ticketId, newUserId) => {
        try {
            await API.put(`/admin/ticket/${ticketId}/reassign`, { assignedTo: newUserId });
            toast.success('Ticket reassigned!');
            fetchData();
        } catch (error) {
            toast.error('Error reassigning ticket');
        }
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            let body = { status: newStatus };
            if (newStatus === 'RESOLVED') {
                const note = prompt('Enter resolution note:');
                if (!note) return toast.error('Resolution note is required');
                body.resolutionNote = note;
            }
            await API.put(`/admin/ticket/${ticketId}/edit`, body);
            toast.success('Ticket updated!');
            fetchData();
        } catch (error) {
            toast.error('Error updating ticket');
        }
    };

    const handleDelete = async (ticketId) => {
        if (window.confirm('Delete this ticket?')) {
            try {
                await API.delete(`/ticket/${ticketId}/delete`);
                toast.success('Ticket deleted!');
                fetchData();
            } catch (error) {
                toast.error('Error deleting ticket');
            }
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
            <h2 className="text-2xl font-bold text-indigo-900 mb-6">Manage Tickets</h2>
            {loading ? (
                <p className="text-gray-500">Loading tickets...</p>
            ) : (
                <div className="grid gap-4">
                    {tickets.map(ticket => (
                        <div key={ticket._id} className="bg-white p-6 rounded-xl shadow">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold text-indigo-900">{ticket.title}</h3>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <p className="text-gray-600 mt-2">{ticket.description}</p>
                            <div className="mt-3 text-sm text-gray-500">
                                <span><strong>Created By:</strong> {ticket.createdBy?.name}</span>
                                <span className="ml-4"><strong>Assigned To:</strong> {ticket.assignedTo?.name || 'Unassigned'}</span>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3 items-center">
                                {/* Reassign */}
                                <select
                                    onChange={(e) => handleReassign(ticket._id, e.target.value)}
                                    defaultValue=""
                                    className="p-2 border rounded-lg text-sm"
                                >
                                    <option value="" disabled>Reassign To</option>
                                    {users.map(user => (
                                        <option key={user._id} value={user._id}>{user.name}</option>
                                    ))}
                                </select>
                                {/* Status Change */}
                                <select
                                    onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                                    defaultValue=""
                                    className="p-2 border rounded-lg text-sm"
                                >
                                    <option value="" disabled>Change Status</option>
                                    <option value="OPEN">OPEN</option>
                                    <option value="IN PROGRESS">IN PROGRESS</option>
                                    <option value="RESOLVED">RESOLVED</option>
                                    <option value="CLOSED">CLOSED</option>
                                    <option value="ON HOLD">ON HOLD</option>
                                    <option value="REOPENED">REOPENED</option>
                                </select>
                                {/* Delete */}
                                <button onClick={() => handleDelete(ticket._id)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminTickets;
