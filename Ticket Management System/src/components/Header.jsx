import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    // Don't show header on login/signup pages
    if (!token) return null;

    return (
        <header className="bg-indigo-900 text-white px-6 py-4 shadow-lg">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link to="/dashboard" className="text-xl font-bold">🎫 Ticket Management System</Link>
                <div className="flex gap-3 items-center">
                    <Link to="/dashboard" className="hover:bg-indigo-700 px-4 py-2 rounded text-sm">
                        Dashboard
                    </Link>
                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm">
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
