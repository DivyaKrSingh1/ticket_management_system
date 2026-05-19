import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import jsPDF from 'jspdf';

import autoTable from 'jspdf-autotable';

import {
  getWarehouses,
  getAttendanceByDate,
  getMonthlyAttendance,
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

  const currentDate = new Date();

  const [month, setMonth] =
    useState(
      currentDate.getMonth() + 1
    );

  const [year, setYear] =
    useState(
      currentDate.getFullYear()
    );

  const [reportType, setReportType] =
    useState('daily');

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

      if (!selectedWarehouse) {
        return;
      }

      setLoading(true);

      try {

        let res;

        if (
          reportType === 'daily'
        ) {

          res =
            await getAttendanceByDate(
              selectedWarehouse,
              date
            );

        } else {

          res =
            await getMonthlyAttendance(
              selectedWarehouse,
              month,
              year
            );
        }

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

  }, [
    selectedWarehouse,
    date,
    month,
    year,
    reportType,
  ]);

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

    const doc = new jsPDF(
      'landscape',
      'mm',
      'a4'
    );

    doc.setFontSize(16);

    doc.text(
      'Monthly Attendance Report',
      10,
      10
    );

    const warehouseName =
      warehouses.find(
        (w) =>
          w._id ===
          selectedWarehouse
      )?.name || '';

    doc.setFontSize(10);

    doc.text(
      `Warehouse: ${warehouseName}`,
      10,
      18
    );

    doc.text(
      `Month: ${
        [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ][month - 1]
      } ${year}`,
      10,
      24
    );

    const groupedEmployees =
      Object.values(

        attendanceData.reduce(
          (
            acc,
            item
          ) => {

            const userId =
              item.user?._id;

            if (
              !acc[userId]
            ) {

              acc[userId] = {

                name:
                  item.user?.name,

                attendance:
                  {},

                P: 0,

                HD: 0,

                A: 0,
              };
            }

            const day =
              Number(
                item.date.split(
                  '-'
                )[2]
              );

            acc[userId]
              .attendance[day] =
              item.status;

            if (
              item.status === 'P'
            ) {
              acc[userId].P++;
            }

            if (
              item.status === 'HD'
            ) {
              acc[userId].HD++;
            }

            if (
              item.status === 'A'
            ) {
              acc[userId].A++;
            }

            return acc;

          },
          {}
        )
      );

    const head = [[
      'Employee',

      ...Array.from(
        {
          length: daysInMonth,
        },
        (_, i) => i + 1
      ),

      'P',
      'HD',
      'A',
      'Total',
    ]];

    const body =
      groupedEmployees.map(
        (employee) => {

          const row = [

            employee.name,
          ];

          for (
            let day = 1;
            day <= daysInMonth;
            day++
          ) {

            let value =
              employee
                .attendance[
                day
              ] || '-';

            if (
              !employee
                .attendance[
                day
              ]
            ) {

              const dateObj =
                new Date(
                  year,
                  month - 1,
                  day
                );

              if (
                dateObj.getDay() === 0
              ) {

                value = 'Sun';

              } else if (

                dateObj.getDay() === 6 &&
                day >= 8 &&
                day <= 14

              ) {

                value = 'Off';
              }
            }

            row.push(value);
          }

          row.push(
            employee.P
          );

          row.push(
            employee.HD
          );

          row.push(
            employee.A
          );

          row.push(
            employee.P +
              employee.HD +
              employee.A
          );

          return row;
        }
      );

    autoTable(doc, {

      startY: 30,

      head,

      body,

      styles: {

        fontSize: 6,

        halign: 'center',

        valign: 'middle',
      },

      headStyles: {

        fillColor: [
          49,
          46,
          129,
        ],

        textColor: 255,

        fontSize: 6,
      },

      alternateRowStyles: {
        fillColor: [
          245,
          245,
          245,
        ],
      },

      margin: {
        left: 5,
        right: 5,
      },

      tableWidth: 'auto',
    });

    doc.save(
      `attendance-${month}-${year}.pdf`
    );
  };

  const handlePrint = () => {

    window.print();

  };

  const daysInMonth =
    new Date(
      year,
      month,
      0
    ).getDate();

  const isSunday = (day) => {

    const dateObj = new Date(
      year,
      month - 1,
      day
    );

    return dateObj.getDay() === 0;
  };

  const isSecondSaturday =
    (day) => {

      const dateObj = new Date(
        year,
        month - 1,
        day
      );

      return (
        dateObj.getDay() === 6 &&
        day >= 8 &&
        day <= 14
      );
    };

  return (

    <div className="max-w-7xl mx-auto px-4">

      <h2 className="text-3xl font-bold text-indigo-900 mb-6">

        Attendance History

      </h2>

      {/* REPORT TYPE */}

      <div className="flex gap-4 mb-4">

        <button
          onClick={() =>
            setReportType(
              'daily'
            )
          }
          className={`px-4 py-2 rounded ${
            reportType ===
            'daily'
              ? 'bg-indigo-700 text-white'
              : 'bg-gray-200'
          }`}
        >
          Daily Report
        </button>

        <button
          onClick={() =>
            setReportType(
              'monthly'
            )
          }
          className={`px-4 py-2 rounded ${
            reportType ===
            'monthly'
              ? 'bg-indigo-700 text-white'
              : 'bg-gray-200'
          }`}
        >
          Monthly Report
        </button>

      </div>

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

          {
            reportType ===
            'daily'

            ? (

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
            )

            : (

              <div className="grid grid-cols-2 gap-4">

                <select
                  value={month}
                  onChange={(e) =>
                    setMonth(
                      Number(
                        e.target
                          .value
                      )
                    )
                  }
                  className="border p-3 rounded"
                >

                  {
                    Array.from(
                      {
                        length: 12,
                      },
                      (_, i) => (

                        <option
                          key={i + 1}
                          value={i + 1}
                        >

                          {
                            [
                              'January',
                              'February',
                              'March',
                              'April',
                              'May',
                              'June',
                              'July',
                              'August',
                              'September',
                              'October',
                              'November',
                              'December',
                            ][i]
                          }

                        </option>
                      )
                    )
                  }

                </select>

                <input
                  type="number"
                  value={year}
                  onChange={(e) =>
                    setYear(
                      e.target.value
                    )
                  }
                  className="border p-3 rounded"
                />

              </div>
            )
          }

        </div>

      </div>

      {/* TABLE */}

      {loading ? (

        <p>Loading...</p>

      ) : attendanceData.length >
        0 ? (

        <div className="bg-white shadow rounded-xl overflow-x-auto">

          <div className="flex flex-wrap gap-3 p-4 border-b">

            {
              reportType ===
                'daily' && (

                <button
                  onClick={() =>
                    setEditMode(
                      !editMode
                    )
                  }
                  className="bg-yellow-500 text-white px-5 py-2 rounded"
                >

                  {editMode
                    ? 'Cancel Edit'
                    : 'Edit Attendance'}

                </button>
              )
            }

            <button
              onClick={
                handleDownloadPDF
              }
              className="bg-red-600 text-white px-5 py-2 rounded"
            >

              Download PDF

            </button>

            <button
              onClick={handlePrint}
              className="bg-blue-600 text-white px-5 py-2 rounded"
            >

              Print Report

            </button>

          </div>

          {
            reportType ===
            'daily'

            ? (

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
                        className="border-b"
                      >

                        <td className="py-3 px-4">

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

                              <option value="P">
                                P
                              </option>

                              <option value="HD">
                                HD
                              </option>

                              <option value="A">
                                A
                              </option>

                            </select>

                          ) : (

                            <span
                              className={`px-3 py-1 rounded text-white text-sm font-bold ${
                                item.status ===
                                'P'
                                  ? 'bg-green-600'
                                  : item.status ===
                                    'HD'
                                  ? 'bg-yellow-500'
                                  : 'bg-red-600'
                              }`}
                            >

                              {
                                item.status
                              }

                            </span>

                          )}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            )

            : (

              <table className="w-full text-sm">

                <thead>

                  <tr className="bg-indigo-900 text-white">

                    <th className="border p-2">
                      Employee
                    </th>

                    {
                      [...Array(daysInMonth)]
                        .map(
                          (_, index) => (

                            <th
                              key={index}
                              className="border p-2"
                            >
                              {index + 1}
                            </th>
                          )
                        )
                    }

                    <th className="border p-2">
                      P
                    </th>

                    <th className="border p-2">
                      HD
                    </th>

                    <th className="border p-2">
                      A
                    </th>

                    <th className="border p-2">
                      Total
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {

                    Object.values(

                      attendanceData.reduce(
                        (
                          acc,
                          item
                        ) => {

                          const userId =
                            item.user
                              ?._id;

                          if (
                            !acc[userId]
                          ) {

                            acc[userId] = {
                              name:
                                item
                                  .user
                                  ?.name,

                              attendance:
                                {},

                              P: 0,

                              HD: 0,

                              A: 0,
                            };
                          }

                          const day =
                            Number(
                              item.date.split(
                                '-'
                              )[2]
                            );

                          acc[userId]
                            .attendance[
                              day
                            ] =
                            item.status;

                          if (
                            item.status ===
                            'P'
                          ) {
                            acc[userId].P++;
                          }

                          if (
                            item.status ===
                            'HD'
                          ) {
                            acc[userId].HD++;
                          }

                          if (
                            item.status ===
                            'A'
                          ) {
                            acc[userId].A++;
                          }

                          return acc;

                        },
                        {}
                      )
                    ).map(
                      (
                        employee,
                        index
                      ) => (

                        <tr
                          key={index}
                        >

                          <td className="border p-2 font-semibold">

                            {
                              employee.name
                            }

                          </td>

                          {
                            [...Array(
                              daysInMonth
                            )].map(
                              (
                                _,
                                index
                              ) => {

                                const day =
                                  index +
                                  1;

                                return (

                                  <td
                                    key={
                                      index
                                    }
                                    className="border p-1 text-center"
                                  >

                                    {
                                      employee.attendance[day]

                                      ? (

                                        <span
                                          className={`px-2 py-1 rounded text-white text-xs font-bold ${
                                            employee.attendance[day] === 'P'
                                              ? 'bg-green-600'

                                              : employee.attendance[day] === 'HD'
                                              ? 'bg-yellow-500'

                                              : 'bg-red-600'
                                          }`}
                                        >

                                          {
                                            employee.attendance[day]
                                          }

                                        </span>

                                      )

                                      : isSunday(day)

                                      ? (

                                        <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs font-bold">

                                          Sun

                                        </span>

                                      )

                                      : isSecondSaturday(day)

                                      ? (

                                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">

                                          Off

                                        </span>

                                      )

                                      : '-'
                                    }

                                  </td>
                                );
                              }
                            )
                          }

                          <td className="border p-2 text-center font-bold text-green-600">
                            {
                              employee.P
                            }
                          </td>

                          <td className="border p-2 text-center font-bold text-yellow-600">
                            {
                              employee.HD
                            }
                          </td>

                          <td className="border p-2 text-center font-bold text-red-600">
                            {
                              employee.A
                            }
                          </td>

                          <td className="border p-2 text-center font-bold text-indigo-700">

                            {
                              employee.P +
                              employee.HD 
                            }

                          </td>

                        </tr>
                      )
                    )
                  }

                </tbody>

              </table>
            )
          }

          {
            editMode &&
            reportType ===
              'daily' && (

              <button
                onClick={
                  handleSaveChanges
                }
                className="bg-indigo-700 text-white px-6 py-2 rounded m-4"
              >

                Save Changes

              </button>
            )
          }

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