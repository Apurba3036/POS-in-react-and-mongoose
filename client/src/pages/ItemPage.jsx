import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import axios from "axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Form, Input, Select, message } from "antd";
const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);

  const [popUpModal, setpopModal] = useState(false);

  const [editItem, setEditItem] = useState(null);

  const getAllItems = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get(
        "http://localhost:8080/api/items/get-item"
      );
      setItemsData(data);
      dispatch({ type: "HIDE_LOADING" });
      console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };
  // useeffect
  useEffect(() => {
    getAllItems();
  }, []);

  // ------------------------------------------------------------------------------

  // handle Delete
  const handleDelete = async (record) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      await axios.post("http://localhost:8080/api/items/delete-item", {
        itemId: record._id,
      });
      message.success("Item Delete Successfully");
      getAllItems();
      setpopModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      dispatch({
        type: "SHOW_LOADING",
      });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };
  // ------------------------------------------------------------------------------

  // Able Data
  const columns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} height="60" width="60" />
      ),
    },
    { title: "Price", dataIndex: "price" },

    {
      title: "Action",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setEditItem(record);
              setpopModal(true);
            }}
          />
          <DeleteOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  // handle form submit
  const handleSubmit = async (value) => {
    if (editItem === null) {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const res = await axios.post(
          "http://localhost:8080/api/items/add-item",
          value
        );
        message.success("Item Added Successfully");
        getAllItems();
        setpopModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Something Went Wrong");
        console.log(error);
      }
    } else {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        await axios.put("http://localhost:8080/api/items/edit-item", {
          ...value,
          itemId: editItem._id,
        });
        message.success("Item Update Successfully");
        getAllItems();
        setpopModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Something Went Wrong");
        console.log(error);
      }
    }
  };
  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>item List</h1>
        <Button type="primary" onClick={() => setpopModal(true)}>
          Add Item
        </Button>
      </div>
      <Table columns={columns} dataSource={itemsData} bordered />
      {popUpModal && (
        <Modal
          title={`${editItem !== null ? "Edit Item" : "add Item"}`}
          open={popUpModal}
          onCancel={() => {
            setEditItem(null);
            setpopModal(false);
          }}
          footer={false}
        >
          <Form
            layout="vertical"
            initialValues={editItem}
            onFinish={handleSubmit}
          >
            <Form.Item name="name" label="Name">
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Price">
              <Input />
            </Form.Item>
            <Form.Item name="image" label="Image URL">
              <Input />
            </Form.Item>

            <Form.Item name="category" label="Category">
              <Select>
                <Select.Option value="Men_Collection">
                  Men_Collection
                </Select.Option>
                <Select.Option value="Woman_Collection">
                  Woman_Collection
                </Select.Option>
                <Select.Option value="99_Product">99_Product</Select.Option>
              </Select>
            </Form.Item>

            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit">
                SAVE
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default ItemPage;
