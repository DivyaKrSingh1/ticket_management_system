import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AllTickets from './pages/AllTickets';
import MyTickets from './pages/MyTickets';
import CreateTicket from './pages/CreateTicket';
import Reports from './pages/Report';

import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminTickets from './pages/AdminTickets';

import MarkAttendance from './pages/Attendance/MarkAttendance';
import WarehouseManagement from './pages/Attendance/WarehouseManagement';
import AttendanceHistory from './pages/Attendance/AttendanceHistory';
import EmployeeAttendance from './pages/Attendance/EmployeeAttendance';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 bg-gray-100 py-6">
          <Routes>

            <Route
              path="/"
              element={
                <Navigate
                  to="/login"
                  replace
                />
              }
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/signup"
              element={<Signup />}
            />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/all-tickets"
              element={
                <PrivateRoute>
                  <AllTickets />
                </PrivateRoute>
              }
            />

            <Route
              path="/my-tickets"
              element={
                <PrivateRoute>
                  <MyTickets />
                </PrivateRoute>
              }
            />

            <Route
              path="/create-ticket"
              element={
                <PrivateRoute>
                  <CreateTicket />
                </PrivateRoute>
              }
            />

            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <PrivateRoute>
                  <AdminUsers />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/tickets"
              element={
                <PrivateRoute>
                  <AdminTickets />
                </PrivateRoute>
              }
            />

            {/* ATTENDANCE ROUTE */}

            <Route
              path="/attendance/mark"
              element={
                <PrivateRoute>
                  <MarkAttendance />
                </PrivateRoute>
              }
            />
            <Route
              path="/warehouse-management"
              element={
               <PrivateRoute>
                 <WarehouseManagement />
               </PrivateRoute>
              }
                />
                <Route
               path="/attendance/history"
                element={
                  <PrivateRoute>
                     <AttendanceHistory />
                  </PrivateRoute>
                  }
                    />
                    <Route
                     path="/attendance/report"
                        element={
                          <PrivateRoute>
                            <EmployeeAttendance />
                          </PrivateRoute>
                  }
                     />

            <Route
              path="*"
              element={
                <Navigate
                  to="/login"
                  replace
                />
              }
            />

          </Routes>
        </main>

        <Footer />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </Router>
  );
}

export default App;