import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (location.pathname === '/login' || location.pathname === '/signup') return null;
    if (!token) return null;

    return (
        <header className="bg-indigo-900 text-white px-6 py-4 shadow-lg">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link to="/dashboard" className="text-xl font-bold">🎫 Ticket Management System</Link>
                <div className="flex gap-3 items-center">
                    <Link to="/dashboard" className="hover:bg-indigo-700 px-4 py-2 rounded text-sm">
                        Dashboard
                    </Link>
                    {user.role === 'admin' && (
                        <Link to="/admin" className="hover:bg-red-700 bg-red-600 px-4 py-2 rounded text-sm">
                            Admin Panel
                        </Link>
                    )}
                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm">
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
