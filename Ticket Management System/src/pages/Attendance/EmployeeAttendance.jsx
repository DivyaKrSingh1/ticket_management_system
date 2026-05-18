import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import API from '../../services/api';

import {
  getEmployeeAttendance,
} from '../../services/attendanceApi';

const EmployeeAttendance = () => {

  const [employees, setEmployees] =
    useState([]);

  const [selectedEmployee,
    setSelectedEmployee] = useState('');

  const [report, setReport] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {

    try {

      const res = await API.get(
        '/admin/users'
      );

      const warehouseEmployees =
        res.data.users.filter(
          (user) =>
            user.role === 'employee' ||
            user.role === 'warehouse_employee'
        );

      setEmployees(
        warehouseEmployees
      );

    } catch (error) {

      toast.error(
        'Error fetching employees'
      );
    }
  };

  const fetchReport = async (
    userId
  ) => {

    setLoading(true);

    try {

      const res =
        await getEmployeeAttendance(
          userId
        );

      setReport(res.data);

    } catch (error) {

      toast.error(
        'Error fetching report'
      );

    } finally {

      setLoading(false);

    }
  };

  const handleEmployeeChange = (
    e
  ) => {

    const userId =
      e.target.value;

    setSelectedEmployee(userId);

    fetchReport(userId);
  };

  return (

    <div className="max-w-7xl mx-auto px-4">

      <h2 className="text-3xl font-bold text-indigo-900 mb-6">

        Employee Attendance Report

      </h2>

      {/* SELECT EMPLOYEE */}

      <div className="bg-white shadow rounded-xl p-6 mb-6">

        <select
          value={
            selectedEmployee
          }
          onChange={
            handleEmployeeChange
          }
          className="border p-3 rounded w-full"
        >

          <option value="">
            Select Employee
          </option>

          {employees.map(
            (employee) => (

              <option
                key={
                  employee._id
                }
                value={
                  employee._id
                }
              >

                {employee.name}

              </option>

            )
          )}

        </select>

      </div>

      {/* LOADING */}

      {loading && (
        <p>Loading report...</p>
      )}

      {/* REPORT */}

      {report && (

        <>

          {/* SUMMARY */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

            <div className="bg-white p-5 rounded-xl shadow text-center">

              <p className="text-3xl font-bold text-blue-600">
                {report.totalDays}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Total Days
              </p>

            </div>

            <div className="bg-white p-5 rounded-xl shadow text-center">

              <p className="text-3xl font-bold text-green-600">
                {report.fullDay}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Full Days
              </p>

            </div>

            <div className="bg-white p-5 rounded-xl shadow text-center">

              <p className="text-3xl font-bold text-yellow-500">
                {report.halfDay}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Half Days
              </p>

            </div>

            <div className="bg-white p-5 rounded-xl shadow text-center">

              <p className="text-3xl font-bold text-red-600">
                {report.absent}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Absent
              </p>

            </div>

          </div>

          {/* ATTENDANCE % */}

          <div className="bg-white p-6 rounded-xl shadow mb-6">

            <h3 className="text-xl font-bold text-gray-800 mb-2">

              Attendance Percentage

            </h3>

            <p className="text-4xl font-bold text-indigo-700">

              {
                report.attendancePercentage
              }%

            </p>

          </div>

          {/* HISTORY TABLE */}

          <div className="bg-white shadow rounded-xl overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-indigo-900 text-white">

                  <th className="py-3 px-4 text-left">
                    Date
                  </th>

                  <th className="py-3 px-4 text-left">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {report.attendance.map(
                  (item) => (

                    <tr
                      key={item._id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="py-3 px-4">

                        {item.date}

                      </td>

                      <td className="py-3 px-4">

                        <span
                          className={`px-3 py-1 rounded text-white text-sm
                          ${
                            item.status ===
                            'full_day'
                              ? 'bg-green-600'
                              : item.status ===
                                'half_day'
                              ? 'bg-yellow-500'
                              : 'bg-red-600'
                          }`}
                        >

                          {item.status}

                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </>

      )}

    </div>

  );
};

export default EmployeeAttendance;