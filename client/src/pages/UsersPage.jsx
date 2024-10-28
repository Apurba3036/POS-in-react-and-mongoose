import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import axios from "axios";
import { EyeOutlined } from "@ant-design/icons";
import { Button, Modal, Table, notification } from "antd";

const UsersPage = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const [usersData, setUsersData] = useState([]);
  const [popUpModal, setPopUpModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch all users from the API
  const getAllUsers = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("http://localhost:8080/api/users/all");
      setUsersData(data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.error("Error fetching users:", error);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    getAllUsers();
  }, []);

  // Handle printing of user details
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // Function to update user role to admin
  const makeAdmin = async (userId) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const response = await axios.put(
        `http://localhost:8080/api/users/make-admin/${userId}`
      );
      dispatch({ type: "HIDE_LOADING" });

      // Update the usersData state to reflect the change
      setUsersData((prevData) =>
        prevData.map((user) =>
          user._id === userId ? { ...user, role: "admin" } : user
        )
      );

      // Show success notification
      notification.success({
        message: "Success",
        description: response.data.message,
      });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.error("Error updating user role:", error);
      notification.error({
        message: "Error",
        description: "Could not update user role.",
      });
    }
  };

  // Define the columns for the table
  const columns = [
    { title: "ID", dataIndex: "_id" },
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "userId" },
    { title: "Role", dataIndex: "role" },
    {
      title: "Action",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EyeOutlined
            style={{ cursor: "pointer", marginRight: 8 }}
            onClick={() => {
              setSelectedUser(record);
              setPopUpModal(true);
            }}
          />
          
        </div>
      ),
    },
    {   title: "Change Role",
        dataIndex: "_id",
        render: (id, record) =>(
        <div>
        <Button
            type="primary"
            onClick={() => makeAdmin(record._id)}
            disabled={record.role === "admin"} // Disable if already admin
          >
            Make Admin
          </Button>
        </div>)
    }
  ];

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>User List</h1>
      </div>
      <Table columns={columns} dataSource={usersData} bordered />

      {popUpModal && (
        <Modal
          title="User Details"
          open={popUpModal}
          onCancel={() => setPopUpModal(false)}
          footer={false}
        >
          <div id="user-details" ref={componentRef}>
            <center>
              <h2>{selectedUser.name}</h2>
              <p>Email: {selectedUser.userId}</p>
              <p>Role: {selectedUser.role}</p>
              <p>Verified: {selectedUser.verified ? "Yes" : "No"}</p>
            </center>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <Button type="primary" onClick={handlePrint}>
              Print
            </Button>
          </div>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default UsersPage;
