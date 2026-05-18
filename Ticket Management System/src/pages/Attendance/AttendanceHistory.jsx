import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import jsPDF from 'jspdf';

import autoTable from 'jspdf-autotable';

import {
  getWarehouses,
  getAttendanceByDate,
  markAttendance,
} from '../../services/attendanceApi';

const AttendanceHistory = () => {

  const [warehouses, setWarehouses] =
    useState([]);

  const [
    selectedWarehouse,
    setSelectedWarehouse,
  ] = useState('');

  const [attendanceData,
    setAttendanceData] =
    useState([]);

  const [date, setDate] = useState(
    new Date()
      .toISOString()
      .split('T')[0]
  );

  const [loading, setLoading] =
    useState(false);

  const [editMode, setEditMode] =
    useState(false);

  useEffect(() => {

    fetchWarehouses();

  }, []);

  const fetchWarehouses =
    async () => {

      try {

        const res =
          await getWarehouses();

        setWarehouses(
          res.data.warehouses
        );

      } catch (error) {

        toast.error(
          'Error fetching warehouses'
        );

      }
    };

  const fetchAttendance =
    async () => {

      if (
        !selectedWarehouse ||
        !date
      ) {
        return;
      }

      setLoading(true);

      try {

        const res =
          await getAttendanceByDate(
            selectedWarehouse,
            date
          );

        setAttendanceData(
          res.data.attendance
        );

      } catch (error) {

        toast.error(
          'Error fetching attendance'
        );

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {

    fetchAttendance();

  }, [selectedWarehouse, date]);

  const handleStatusChange = (
    index,
    value
  ) => {

    const updatedAttendance =
      [...attendanceData];

    updatedAttendance[index].status =
      value;

    setAttendanceData(
      updatedAttendance
    );
  };

  const handleSaveChanges =
    async () => {

      try {

        const formattedAttendance =
          attendanceData.map(
            (item) => ({
              userId:
                item.user._id,
              status:
                item.status,
            })
          );

        await markAttendance({
          warehouseId:
            selectedWarehouse,
          date,
          attendance:
            formattedAttendance,
        });

        toast.success(
          'Attendance updated successfully'
        );

        setEditMode(false);

      } catch (error) {

        toast.error(
          'Error updating attendance'
        );

      }
    };

  const handleDownloadPDF =
    () => {

      const doc = new jsPDF();

      doc.setFontSize(18);

      doc.text(
        'Attendance Report',
        14,
        20
      );

      doc.setFontSize(12);

      doc.text(
        `Date: ${date}`,
        14,
        30
      );

      const selectedWarehouseName =
        warehouses.find(
          (w) =>
            w._id ===
            selectedWarehouse
        )?.name || '';

      doc.text(
        `Warehouse: ${selectedWarehouseName}`,
        14,
        38
      );

      autoTable(doc, {

        startY: 50,

        head: [[
          'Employee',
          'Email',
          'Status',
        ]],

        body:
          attendanceData.map(
            (item) => [

              item.user?.name,

              item.user?.email,

              item.status
                .replace(
                  '_',
                  ' '
                )
                .toUpperCase(),

            ]
          ),

      });

      doc.save(
        `attendance-report-${date}.pdf`
      );
    };

  const handlePrint = () => {

    window.print();

  };

  return (

    <div className="max-w-7xl mx-auto px-4">

      <h2 className="text-3xl font-bold text-indigo-900 mb-6">

        Attendance History

      </h2>

      {/* FILTERS */}

      <div className="bg-white shadow rounded-xl p-6 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <select
            value={
              selectedWarehouse
            }
            onChange={(e) =>
              setSelectedWarehouse(
                e.target.value
              )
            }
            className="border p-3 rounded"
          >

            <option value="">
              Select Warehouse
            </option>

            {warehouses.map(
              (warehouse) => (

                <option
                  key={
                    warehouse._id
                  }
                  value={
                    warehouse._id
                  }
                >

                  {warehouse.name}

                </option>

              )
            )}

          </select>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(
                e.target.value
              )
            }
            className="border p-3 rounded"
          />

        </div>

      </div>

      {/* TABLE */}

      {loading ? (

        <p>Loading...</p>

      ) : attendanceData.length >
        0 ? (

        <div className="bg-white shadow rounded-xl overflow-x-auto">

          {/* TOP ACTIONS */}

          <div className="flex flex-wrap gap-3 p-4 border-b">

            <button
              onClick={() =>
                setEditMode(
                  !editMode
                )
              }
              className="bg-yellow-500 text-white px-5 py-2 rounded hover:bg-yellow-600"
            >

              {editMode
                ? 'Cancel Edit'
                : 'Edit Attendance'}

            </button>

            <button
              onClick={
                handleDownloadPDF
              }
              className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
            >

              Download PDF

            </button>

            <button
              onClick={handlePrint}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >

              Print Report

            </button>

          </div>

          <table className="w-full">

            <thead>

              <tr className="bg-indigo-900 text-white">

                <th className="py-3 px-4 text-left">
                  Employee
                </th>

                <th className="py-3 px-4 text-left">
                  Email
                </th>

                <th className="py-3 px-4 text-left">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {attendanceData.map(
                (
                  item,
                  index
                ) => (

                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="py-3 px-4 font-medium">

                      {
                        item.user
                          ?.name
                      }

                    </td>

                    <td className="py-3 px-4">

                      {
                        item.user
                          ?.email
                      }

                    </td>

                    <td className="py-3 px-4">

                      {editMode ? (

                        <select
                          value={
                            item.status
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              index,
                              e.target
                                .value
                            )
                          }
                          className="border p-2 rounded"
                        >

                          <option value="full_day">
                            Full Day
                          </option>

                          <option value="half_day">
                            Half Day
                          </option>

                          <option value="absent">
                            Absent
                          </option>

                        </select>

                      ) : (

                        <span
                          className={`px-3 py-1 rounded text-white text-sm ${
                            item.status ===
                            'full_day'
                              ? 'bg-green-600'
                              : item.status ===
                                'half_day'
                              ? 'bg-yellow-500'
                              : 'bg-red-600'
                          }`}
                        >

                          {item.status
                            .replace(
                              '_',
                              ' '
                            )
                            .toUpperCase()}

                        </span>

                      )}

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

          {editMode && (

            <button
              onClick={
                handleSaveChanges
              }
              className="bg-indigo-700 text-white px-6 py-2 rounded m-4 hover:bg-indigo-800"
            >

              Save Changes

            </button>

          )}

        </div>

      ) : (

        <div className="bg-white rounded-xl shadow p-6 text-gray-500">

          No attendance found

        </div>

      )}

    </div>

  );
};

export default AttendanceHistory;