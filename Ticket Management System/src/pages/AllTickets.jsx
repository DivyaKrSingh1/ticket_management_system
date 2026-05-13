import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../services/api';

const AllTickets = () => {

    const [tickets, setTickets] = useState([]);

    const [statusFilter, setStatusFilter] = useState('');

    const [employeeFilter, setEmployeeFilter] = useState('');

    const [loading, setLoading] = useState(false);

    const user =
        JSON.parse(localStorage.getItem('user') || '{}');


    const fetchTickets = async () => {

        setLoading(true);

        try {

            let query = '/ticket/listTickets?';

            if (statusFilter) {
                query += `status=${statusFilter}&`;
            }

            if (employeeFilter) {
                query += `employeeName=${employeeFilter}`;
            }

            const res = await API.get(query);

            console.log("Tickets:", res.data);

            setTickets(res.data.tickets);

        } catch (error) {

            console.log(error);

            toast.error('Error fetching tickets');

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchTickets();

    }, [statusFilter, employeeFilter]);


    const handleStatusUpdate = async (
        id,
        newStatus
    ) => {

        try {

            let body = {
                status: newStatus
            };

            if (newStatus === 'RESOLVED') {

                const note =
                    prompt('Enter resolution note:');

                if (!note) {
                    return toast.error(
                        'Resolution note is required'
                    );
                }

                body.resolutionNote = note;
            }

            await API.put(
                `/ticket/${id}/update`,
                body
            );

            toast.success('Ticket updated!');

            fetchTickets();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                'Error updating ticket'
            );
        }
    };


    const handleDelete = async (id) => {

        if (
            window.confirm(
                'Are you sure you want to delete this ticket?'
            )
        ) {

            try {

                await API.delete(
                    `/ticket/${id}/delete`
                );

                toast.success('Ticket deleted!');

                fetchTickets();

            } catch (error) {

                toast.error('Error deleting ticket');
            }
        }
    };


    const getStatusColor = (status) => {

        const colors = {

            'OPEN':
                'bg-blue-100 text-blue-800',

            'IN PROGRESS':
                'bg-yellow-100 text-yellow-800',

            'RESOLVED':
                'bg-green-100 text-green-800',

            'CLOSED':
                'bg-gray-100 text-gray-800',

            'ON HOLD':
                'bg-orange-100 text-orange-800',

            'REOPENED':
                'bg-red-100 text-red-800'
        };

        return colors[status] ||
            'bg-gray-100 text-gray-800';
    };


    return (

        <div className="max-w-6xl mx-auto px-4">

            <h2 className="text-2xl font-bold text-indigo-900 mb-6">
                All Tickets
            </h2>


            {/* FILTERS */}
            <div className="flex flex-wrap gap-4 mb-6">

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                    className="p-3 border border-gray-300 rounded-lg"
                >

                    <option value="">
                        All Status
                    </option>

                    <option value="OPEN">
                        OPEN
                    </option>

                    <option value="IN PROGRESS">
                        IN PROGRESS
                    </option>

                    <option value="RESOLVED">
                        RESOLVED
                    </option>

                    <option value="CLOSED">
                        CLOSED
                    </option>

                    <option value="ON HOLD">
                        ON HOLD
                    </option>

                    <option value="REOPENED">
                        REOPENED
                    </option>

                </select>


                <input
                    type="text"
                    placeholder="Filter by employee name"
                    value={employeeFilter}
                    onChange={(e) =>
                        setEmployeeFilter(e.target.value)
                    }
                    className="p-3 border border-gray-300 rounded-lg"
                />

            </div>


            {/* TICKET LIST */}
            {

                loading ? (

                    <p className="text-gray-500">
                        Loading tickets...
                    </p>

                ) : (

                    <div className="grid gap-4">

                        {

                            tickets.length > 0 ? (

                                tickets.map((ticket) => (

                                    <div
                                        key={ticket._id}
                                        className="bg-white p-6 rounded-xl shadow"
                                    >

                                        <div className="flex justify-between items-start">

                                          <div>
    <p className="text-sm text-indigo-600 font-semibold">
        TICKET-{ticket.ticketNumber}
    </p>

    <h3 className="text-lg font-bold text-indigo-900">
        {ticket.title}
    </h3>
</div>

                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}
                                            >
                                                {ticket.status}
                                            </span>

                                        </div>


                                        <p className="text-gray-600 mt-2">
                                            {ticket.description}
                                        </p>


                                        {/* IMAGE */}
                                       {
    ticket.image && (

        <div className="mt-4">

            <img
                src={`https://ticket-management-system-1-8q08.onrender.com${ticket.image}`}
                alt="ticket"
                className="w-72 h-72 object-cover rounded-xl border cursor-pointer hover:scale-105 transition duration-300"
                onClick={() =>
                    window.open(
                        `https://ticket-management-system-1-8q08.onrender.com${ticket.image}`,
                        '_blank'
                    )
                }
            />

            <p className="text-xs text-gray-500 mt-1">
                Click image to view full size
            </p>

        </div>
    )
}


                                        <div className="mt-3 text-sm text-gray-500 flex flex-wrap gap-4">

                                            <span>
                                                <strong>
                                                    Created By:
                                                </strong>

                                                {' '}

                                                {ticket.createdBy?.name}
                                            </span>

                                            <span>
                                                <strong>
                                                    Assigned To:
                                                </strong>

                                                {' '}

                                                {ticket.assignedTo?.name || 'Unassigned'}
                                            </span>

                                            <span>
                                                <strong>
                                                    Date:
                                                </strong>

                                                {' '}

                                                {
                                                    new Date(ticket.createdAt)
                                                    .toLocaleDateString()
                                                }
                                            </span>

                                        </div>


                                        {

                                            ticket.resolutionNote && (

                                                <p className="mt-2 text-sm text-green-700">

                                                    <strong>
                                                        Resolution:
                                                    </strong>

                                                    {' '}

                                                    {ticket.resolutionNote}

                                                </p>
                                            )
                                        }


                                        {/* ADMIN ACTIONS */}
                                        {

                                            user.role === 'admin' && (

                                                <div className="mt-4 flex gap-3">

                                                    <select
                                                        onChange={(e) =>
                                                            handleStatusUpdate(
                                                                ticket._id,
                                                                e.target.value
                                                            )
                                                        }

                                                        defaultValue=""

                                                        className="p-2 border border-gray-300 rounded-lg text-sm"
                                                    >

                                                        <option value="" disabled>
                                                            Change Status
                                                        </option>

                                                        <option value="OPEN">
                                                            OPEN
                                                        </option>

                                                        <option value="IN PROGRESS">
                                                            IN PROGRESS
                                                        </option>

                                                        <option value="RESOLVED">
                                                            RESOLVED
                                                        </option>

                                                        <option value="CLOSED">
                                                            CLOSED
                                                        </option>

                                                        <option value="ON HOLD">
                                                            ON HOLD
                                                        </option>

                                                        <option value="REOPENED">
                                                            REOPENED
                                                        </option>

                                                    </select>


                                                    <button
                                                        onClick={() =>
                                                            handleDelete(ticket._id)
                                                        }

                                                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>
                                            )
                                        }

                                    </div>
                                ))

                            ) : (

                                <p className="text-gray-500">
                                    No tickets found
                                </p>
                            )
                        }

                    </div>
                )
            }

        </div>
    );
};

export default AllTickets;