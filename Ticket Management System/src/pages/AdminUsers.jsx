import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import API from '../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [warehouses, setWarehouses] =
    useState([]);

  const [editingUser, setEditingUser] =
    useState(null);

  const [editForm, setEditForm] =
    useState({
      name: '',
      email: '',
      warehouse: '',
      phone: '',
      address: '',
    });

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const res = await API.get(
        '/admin/users'
      );

      setUsers(res.data.users);
    } catch (error) {
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await API.get(
        '/warehouse/list'
      );

      setWarehouses(
        res.data.warehouses
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchWarehouses();
  }, []);

  const handleRoleChange = async (
    userId,
    newRole
  ) => {
    try {
      await API.put(
        `/admin/user/${userId}/role`,
        {
          role: newRole,
        }
      );

      toast.success(
        'Role updated successfully'
      );

      fetchUsers();
    } catch (error) {
      toast.error(
        'Error updating role'
      );
    }
  };

  const handleDelete = async (
    userId
  ) => {
    if (
      window.confirm(
        'Are you sure you want to delete this user?'
      )
    ) {
      try {
        await API.delete(
          `/admin/user/${userId}/delete`
        );

        toast.success(
          'User deleted successfully'
        );

        fetchUsers();
      } catch (error) {
        toast.error(
          'Error deleting user'
        );
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);

    setEditForm({
      name: user.name || '',
      email: user.email || '',
      warehouse:
        user.warehouse?._id || '',
      phone: user.phone || '',
      address: user.address || '',
    });
  };

  const handleSaveEdit = async (
    userId
  ) => {
    try {
      await API.put(
        `/admin/user/${userId}/edit`,
        editForm
      );

      toast.success(
        'User updated successfully'
      );

      setEditingUser(null);

      fetchUsers();
    } catch (error) {
      toast.error(
        'Error updating user'
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4">

      <h2 className="text-3xl font-bold text-indigo-900 mb-6">
        Manage Users
      </h2>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="bg-indigo-900 text-white">

                <th className="py-3 px-4 text-left">
                  Name
                </th>

                <th className="py-3 px-4 text-left">
                  Email
                </th>

                <th className="py-3 px-4 text-left">
                  Role
                </th>

                <th className="py-3 px-4 text-left">
                  Warehouse
                </th>

                <th className="py-3 px-4 text-left">
                  Phone
                </th>

                <th className="py-3 px-4 text-left">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {users.map((user) => (

                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50"
                >

                  {/* NAME */}

                  <td className="py-3 px-4">

                    {editingUser ===
                    user._id ? (

                      <input
                        value={
                          editForm.name
                        }
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            name:
                              e.target
                                .value,
                          })
                        }
                        className="border p-2 rounded w-full"
                      />

                    ) : (
                      user.name
                    )}

                  </td>

                  {/* EMAIL */}

                  <td className="py-3 px-4">

                    {editingUser ===
                    user._id ? (

                      <input
                        value={
                          editForm.email
                        }
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            email:
                              e.target
                                .value,
                          })
                        }
                        className="border p-2 rounded w-full"
                      />

                    ) : (
                      user.email
                    )}

                  </td>

                  {/* ROLE */}

                  <td className="py-3 px-4">

                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(
                          user._id,
                          e.target.value
                        )
                      }
                      className="border p-2 rounded"
                    >

                      <option value="employee">
                        Employee
                      </option>

                      <option value="admin">
                        Admin
                      </option>

                      <option value="warehouse_employee">
                        Warehouse Employee
                      </option>

                    </select>

                  </td>

                  {/* WAREHOUSE */}

                  <td className="py-3 px-4">

                    {editingUser ===
                    user._id ? (

                      <select
                        value={
                          editForm.warehouse
                        }
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            warehouse:
                              e.target
                                .value,
                          })
                        }
                        className="border p-2 rounded w-full"
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
                              {
                                warehouse.name
                              }
                            </option>
                          )
                        )}

                      </select>

                    ) : (
                      user.warehouse
                        ?.name || '-'
                    )}

                  </td>

                  {/* PHONE */}

                  <td className="py-3 px-4">

                    {editingUser ===
                    user._id ? (

                      <input
                        value={
                          editForm.phone
                        }
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            phone:
                              e.target
                                .value,
                          })
                        }
                        className="border p-2 rounded w-full"
                      />

                    ) : (
                      user.phone || '-'
                    )}

                  </td>

                  {/* ACTIONS */}

                  <td className="py-3 px-4 flex gap-2">

                    {editingUser ===
                    user._id ? (

                      <>

                        <button
                          onClick={() =>
                            handleSaveEdit(
                              user._id
                            )
                          }
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Save
                        </button>

                        <button
                          onClick={() =>
                            setEditingUser(
                              null
                            )
                          }
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>

                      </>

                    ) : (

                      <>

                        <button
                          onClick={() =>
                            handleEdit(
                              user
                            )
                          }
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              user._id
                            )
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>

                      </>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}
    </div>
  );
};

export default AdminUsers;