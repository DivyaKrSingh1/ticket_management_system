import { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../services/api';

const CreateTicket = () => {
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post('/ticket/create', formData);
            toast.success('Ticket created successfully!');
            setFormData({ title: '', description: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6">Create New Ticket</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter ticket title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        placeholder="Enter ticket description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="5"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-900 text-white py-3 rounded-lg hover:bg-indigo-800 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating...' : 'Create Ticket'}
                </button>
            </form>
        </div>
    );
};

export default CreateTicket;
