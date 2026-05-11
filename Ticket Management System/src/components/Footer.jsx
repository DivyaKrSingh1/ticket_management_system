import { useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    const token = localStorage.getItem('token');

    // Hide footer on login and signup pages
    if (location.pathname === '/login' || location.pathname === '/signup') return null;
    if (!token) return null;

    return (
        <footer className="bg-indigo-900 text-white text-center py-4 mt-10">
            <p className="text-sm">© 2026 Ticket Management System | Built by Divya</p>
        </footer>
    );
};

export default Footer;
