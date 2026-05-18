import API from './api';


// WAREHOUSE APIs


// GET ALL WAREHOUSES
export const getWarehouses = async () => {
  return await API.get('/warehouse/list');
};

// CREATE WAREHOUSE
export const createWarehouse = async (
  data
) => {
  return await API.post(
    '/warehouse/create',
    data
  );
};

// UPDATE WAREHOUSE
export const updateWarehouse = async (
  id,
  data
) => {
  return await API.put(
    `/warehouse/update/${id}`,
    data
  );
};

// DELETE WAREHOUSE
export const deleteWarehouse = async (
  id
) => {
  return await API.delete(
    `/warehouse/delete/${id}`
  );
};


// ATTENDANCE APIs


// GET WAREHOUSE EMPLOYEES
export const getWarehouseEmployees =
  async (warehouseId) => {
    return await API.get(
      `/attendance/warehouse-employees?warehouseId=${warehouseId}`
    );
  };

// MARK ATTENDANCE
export const markAttendance = async (
  data
) => {
  return await API.post(
    '/attendance/mark',
    data
  );
};

// GET ATTENDANCE BY DATE
export const getAttendanceByDate =
  async (warehouseId, date) => {
    return await API.get(
      `/attendance/date?warehouseId=${warehouseId}&date=${date}`
    );
  };

// GET EMPLOYEE ATTENDANCE REPORT
export const getEmployeeAttendance =
  async (id) => {
    return await API.get(
      `/attendance/employee/${id}`
    );
  };