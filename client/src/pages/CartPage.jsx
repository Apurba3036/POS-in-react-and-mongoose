import React, { useEffect, useState } from "react"; 
import DefaultLayout from "../components/DefaultLayout";
import { useSelector, useDispatch } from "react-redux";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Select, Table } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [billPopup, setBillPopup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [form] = Form.useForm();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.rootReducer);

  // Handle increment
  const handleIncrement = (record) => {
    dispatch({
      type: "UPDATE_CART",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  // Handle decrement
  const handleDecrement = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "UPDATE_CART",
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  };

  // Table columns
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
      title: "Quantity",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <PlusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleIncrement(record)}
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleDecrement(record)}
          />
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "_id",
      render: (id, record) => (
        <DeleteOutlined
          style={{ cursor: "pointer" }}
          onClick={() =>
            dispatch({
              type: "DELETE_FROM_CART",
              payload: record,
            })
          }
        />
      ),
    },
  ];

  // Calculate subTotal
  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => (temp += item.price * item.quantity));
    setSubTotal(temp);
  }, [cartItems]);

  // Handle payment based on selected method
  const handlePayment = async (value) => {
    const { customerName, customerNumber } = form.getFieldsValue();
    const paymentData = {
      ...value,
      cartItems,
      customerName,
      customerNumber,
      time: new Date().toISOString(),
      tax: Number(((subTotal / 100) * 10).toFixed(2)),
      totalAmount: Number(subTotal + Number(((subTotal / 100) * 10).toFixed(2))),
    };

    try {
      const response = await axios.post("http://localhost:8080/create-payment", paymentData);

     
      const session_url = response.data.paymentUrl;
      console.log(session_url);
      window.location.replace(session_url);
    } catch (error) {
      message.error("Failed to initiate payment");
      console.log(error);
    }
  };

  // Handle form submission
  const handleSubmit = (value) => {
    if (paymentMethod === "card") {
      handlePayment(value);
    } else {
      handleGenerateBill(value);
    }
  };

  // Handle bill generation
  const handleGenerateBill = async (value) => {
    try {
      const newObject = {
        ...value,
        cartItems,
        subTotal,
        tax: Number(((subTotal / 100) * 10).toFixed(2)),
        totalAmount: Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2)),
        userId: JSON.parse(localStorage.getItem("auth"))._id,
      };

      await axios.post("http://localhost:8080/api/bills/add-bills", newObject);

      // Clear cart items from local storage and Redux
      localStorage.removeItem("cartItems");
      dispatch({ type: "CLEAR_CART" });

      message.success("Bill Generated Successfully");
      navigate("/bills");
    } catch (error) {
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  return (
    <DefaultLayout>
      <h1>Cart</h1>
      <Table columns={columns} dataSource={cartItems} bordered />
      <div className="d-flex align-items-end flex-column">
        <hr />
        <h3>
          SUB TOTAL: $ <b>{subTotal}</b> /-
        </h3>
        <Button type="primary" onClick={() => setBillPopup(true)}>
          Create Invoice
        </Button>
      </div>

      <Modal
        title="Create Invoice"
        visible={billPopup}
        onCancel={() => setBillPopup(false)}
        footer={false}
      >
        <Form layout="vertical" onFinish={handleSubmit} form={form}>
          <Form.Item
            name="customerName"
            label="Customer Name"
            rules={[{ required: true, message: "Please enter customer name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="customerNumber"
            label="Contact Number"
            rules={[{ required: true, message: "Please enter contact number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="pamentMode" label="Payment Method">
            <Select onChange={(value) => setPaymentMethod(value)}>
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="card">Card or Online</Select.Option>
            </Select>
          </Form.Item>
          <div className="bill-it">
            <h5>Sub Total: <b>{subTotal}</b></h5>
            <h4>TAX: <b>{((subTotal / 100) * 10).toFixed(2)}</b></h4>
            <h3>
              Grand Total: <b>{Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))}</b>
            </h3>
          </div>

          <div className="d-flex justify-content-end">
            {paymentMethod !== "card" && (
              <Button type="primary" htmlType="submit">
                On cash pay
              </Button>
            )}
            {paymentMethod === "card" && (
              <Button type="primary" htmlType="submit">
                 SSl Commerze
              </Button>
            )}
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default CartPage;
