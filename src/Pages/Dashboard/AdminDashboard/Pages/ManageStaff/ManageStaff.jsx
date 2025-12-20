import React, { useEffect } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useState } from "react";
import useAxiosSecure from "../../../../../Hooks/useAxiosSecure/useAxiosSecure";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Loading from "../../../../../Components/Loading/Loading";

const ManageStaff = () => {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const axiosSecure = useAxiosSecure();

  const {
    register: addRegister,
    handleSubmit: handleAddSubmit,
    reset: resetAddForm,
  } = useForm();

  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    setValue,
  } = useForm();

  useEffect(() => {
    if (editingStaff) {
      setValue("name", editingStaff.name);
      setValue("email", editingStaff.email);
      setValue("phone", editingStaff.phone);
    }
    if (showAddModal) {
      resetAddForm();
    }
  }, [editingStaff, setValue, resetAddForm, showAddModal]);

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ["manage-staff"],
    queryFn: async () => {
      const res = await axiosSecure.get("/all-staff?role=Staff");
      return res.data?.data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post("/create-staff", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["manage-staff"]);
      setShowAddModal(false);
      toast.success("Staff added successfully.");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add staff");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axiosSecure.patch(`/update-staff/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["manage-staff"]);
      setEditingStaff(null);
      toast.success("Staff updated");
    },
    onError: () => {
      toast.error("Update failed");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/staff/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["manage-staff"]);
      toast.success("Staff deleted");
    },

    onError: () => {
      toast.error("Delete failed");
    },
  });

  const handleCreateStaff = async (data) => {
    try {
      const { name, email, photo, phone, password } = data;
      const img = photo[0];

      let photoURL = "https://i.pravatar.cc/1080";

      if (img) {
        const imgData = new FormData();
        imgData.append("image", img);

        const pictureH = await axios.post(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMG_BB_KEY
          }`,
          imgData
        );
        photoURL = pictureH.data.data.display_url;
      }

      addMutation.mutate({
        name,
        email,
        phone,
        picture: photoURL,
        password,
      });
    } catch (error) {
      const message =
        error.code === "auth/email-already-in-use"
          ? "Email already registered"
          : "Registration failed";
      toast.error(message);
    }
  };

  const handleStaffUpdate = async (data) => {
    const { name, email, photo, phone } = data;

    const img = photo[0];
    let photoURL;
    if (img) {
      const imgData = new FormData();
      imgData.append("image", img);

      const pictureG = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMG_BB_KEY}`,
        imgData
      );
      photoURL = pictureG.data.data.display_url;
    }

    updateMutation.mutate({
      id: editingStaff._id,
      data: {
        name: name,
        email: email,
        phone: phone,
        picture: photoURL || editingStaff.picture,
      },
    });
  };

  const confirmDeleteStaff = (id) => {
    Swal.fire({
      title: "Delete Staff?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const closeAddModal = () => {
    resetAddForm();
    setShowAddModal(false);
  };

  const closeEditModal = () => {
    resetEditForm();
    setEditingStaff(null);
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">Manage Staff</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-success btn-sm md:btn-md btn-outline"
        >
          Add Staff
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s._id}>
                <td>
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img
                        src={s.picture}
                        alt={s.name}
                      />
                    </div>
                  </div>
                </td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => setEditingStaff(s)}
                    className="btn btn-sm btn-error btn-outline "
                  >
                    Update
                  </button>
                  <button
                    onClick={() => confirmDeleteStaff(s._id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add New Staff</h3>
            <form
              onSubmit={handleAddSubmit(handleCreateStaff)}
              className="space-y-4 mt-4"
            >
              <input
                {...addRegister("name")}
                type="text"
                placeholder="Name"
                className="input input-bordered w-full"
                required
              />
              <input
                {...addRegister("email")}
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                required
              />
              <input
                {...addRegister("phone")}
                type="text"
                placeholder="Phone"
                className="input input-bordered w-full"
                required
              />
              <input
                {...addRegister("photo")}
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
              />
              <input
                {...addRegister("password")}
                type="password"
                placeholder="Password"
                className="input input-bordered w-full"
                required
              />
              <div className="modal-action">
                <button type="submit" className="btn btn-accent btn-outline">
                  Add Staff
                </button>
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="btn btn-neutral btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingStaff && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Update Staff</h3>
            <form
              onSubmit={handleEditSubmit(handleStaffUpdate)}
              className="space-y-4 mt-4"
            >
              <input
                {...editRegister("name")}
                type="text"
                placeholder="Name"
                className="input input-bordered w-full"
                required
              />
              <input
                {...editRegister("email")}
                readOnly
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                required
              />
              <input
                {...editRegister("phone")}
                type="text"
                placeholder="Phone"
                className="input input-bordered w-full"
                required
              />
              <input
                {...editRegister("photo")}
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
              />
              <div className="modal-action">
                <button type="submit" className="btn btn-info btn-outline">
                  Update
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="btn btn-neutral btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStaff;
