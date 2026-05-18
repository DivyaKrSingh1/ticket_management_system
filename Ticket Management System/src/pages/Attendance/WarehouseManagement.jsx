import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from '../../services/attendanceApi';

const WarehouseManagement = () => {

  const [warehouses, setWarehouses] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [formData, setFormData] =
    useState({
      name: '',
      location: '',
      description: '',
    });

  const fetchWarehouses = async () => {
    setLoading(true);

    try {
      const res = await getWarehouses();

      setWarehouses(
        res.data.warehouses
      );
    } catch (error) {
      toast.error(
        'Error fetching warehouses'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {

        await updateWarehouse(
          editingId,
          formData
        );

        toast.success(
          'Warehouse updated successfully'
        );

      } else {

        await createWarehouse(
          formData
        );

        toast.success(
          'Warehouse created successfully'
        );
      }

      setFormData({
        name: '',
        location: '',
        description: '',
      });

      setEditingId(null);

      fetchWarehouses();

    } catch (error) {
      toast.error(
        'Error saving warehouse'
      );
    }
  };

  const handleEdit = (
    warehouse
  ) => {
    setEditingId(
      warehouse._id
    );

    setFormData({
      name:
        warehouse.name || '',
      location:
        warehouse.location ||
        '',
      description:
        warehouse.description ||
        '',
    });
  };

  const handleDelete = async (
    id
  ) => {
    if (
      window.confirm(
        'Delete this warehouse?'
      )
    ) {
      try {

        await deleteWarehouse(id);

        toast.success(
          'Warehouse deleted successfully'
        );

        fetchWarehouses();

      } catch (error) {
        toast.error(
          'Error deleting warehouse'
        );
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">

      <h2 className="text-3xl font-bold text-indigo-900 mb-6">
        Warehouse Management
      </h2>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 mb-8"
      >

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            type="text"
            name="name"
            placeholder="Warehouse Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="border p-3 rounded"
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-3 rounded"
          />

        </div>

        <button
          type="submit"
          className="bg-indigo-700 text-white px-6 py-2 rounded mt-4 hover:bg-indigo-800"
        >

          {editingId
            ? 'Update Warehouse'
            : 'Create Warehouse'}

        </button>

      </form>

      {/* TABLE */}

      {loading ? (
        <p>Loading...</p>
      ) : (

        <div className="bg-white shadow rounded-xl overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="bg-indigo-900 text-white">

                <th className="py-3 px-4 text-left">
                  Name
                </th>

                <th className="py-3 px-4 text-left">
                  Location
                </th>

                <th className="py-3 px-4 text-left">
                  Description
                </th>

                <th className="py-3 px-4 text-left">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {warehouses.map(
                (warehouse) => (

                  <tr
                    key={warehouse._id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="py-3 px-4">
                      {warehouse.name}
                    </td>

                    <td className="py-3 px-4">
                      {
                        warehouse.location
                      }
                    </td>

                    <td className="py-3 px-4">
                      {
                        warehouse.description
                      }
                    </td>

                    <td className="py-3 px-4 flex gap-2">

                      <button
                        onClick={() =>
                          handleEdit(
                            warehouse
                          )
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            warehouse._id
                          )
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
};

export default WarehouseManagement;