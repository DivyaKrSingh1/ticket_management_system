import { useEffect, useState } from 'react';

import {
  getWarehouses,
  getWarehouseEmployees,
  markAttendance,
} from '../../services/attendanceApi';

const MarkAttendance = () => {
  const [warehouses, setWarehouses] =
    useState([]);

  const [selectedWarehouse,
    setSelectedWarehouse] = useState('');

  const [employees, setEmployees] =
    useState([]);

  const [attendance, setAttendance] =
    useState({});

  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await getWarehouses();

      setWarehouses(res.data.warehouses);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmployees = async (
    warehouseId
  ) => {
    try {
      const res =
        await getWarehouseEmployees(
          warehouseId
        );

      setEmployees(res.data.employees);

      const initialAttendance = {};

      res.data.employees.forEach(
        (employee) => {
          initialAttendance[
            employee._id
          ] = 'full_day';
        }
      );

      setAttendance(initialAttendance);
    } catch (error) {
      console.log(error);
    }
  };

  const handleWarehouseChange = (
    e
  ) => {
    const warehouseId = e.target.value;

    setSelectedWarehouse(warehouseId);

    fetchEmployees(warehouseId);
  };

  const handleStatusChange = (
    userId,
    status
  ) => {
    setAttendance({
      ...attendance,
      [userId]: status,
    });
  };

  const handleSubmit = async () => {
    try {
      const attendanceData =
        employees.map((employee) => ({
          userId: employee._id,
          status:
            attendance[employee._id],
        }));

      await markAttendance({
        warehouseId:
          selectedWarehouse,
        date,
        attendance: attendanceData,
      });

      alert(
        'Attendance marked successfully'
      );
    } catch (error) {
      console.log(error);

      alert('Error marking attendance');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Mark Attendance
      </h2>

      <div className="mb-4">
        <label>Warehouse</label>

        <select
          className="border p-2 w-full"
          value={selectedWarehouse}
          onChange={
            handleWarehouseChange
          }
        >
          <option value="">
            Select Warehouse
          </option>

          {warehouses.map((warehouse) => (
            <option
              key={warehouse._id}
              value={warehouse._id}
            >
              {warehouse.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label>Date</label>

        <input
          type="date"
          className="border p-2 w-full"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
        />
      </div>

      {employees.length > 0 && (
        <div>
          <table className="w-full border">
            <thead>
              <tr>
                <th className="border p-2">
                  Employee
                </th>

                <th className="border p-2">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td className="border p-2">
                    {employee.name}
                  </td>

                  <td className="border p-2">
                    <select
                      className="border p-2"
                      value={
                        attendance[
                          employee._id
                        ]
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          employee._id,
                          e.target.value
                        )
                      }
                    >
 <option value="P">
  Full Day
</option>

<option value="HD">
  Half Day
</option>

<option value="A">
  Absent
</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="bg-blue-500 text-white px-4 py-2 mt-4"
            onClick={handleSubmit}
          >
            Save Attendance
          </button>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;