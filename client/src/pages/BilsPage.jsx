import React, { useEffect, useState, useRef } from "react";

import { useReactToPrint } from "react-to-print";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import axios from "axios";
import { EyeOutlined } from "@ant-design/icons";
import { Button, Modal, Table } from "antd";
import logo from "../logo/burtique.jpg";

const BilsPage = () => {
  const componentRef = useRef();

  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);

  const [popUpModal, setpopModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const getAllBills = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get(
        "http://localhost:8080/api/bills/get-bills"
      );
      setBillsData(data);
      dispatch({ type: "HIDE_LOADING" });
      console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };
  // useeffect
  useEffect(() => {
    getAllBills();
  }, []);

  // print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // ------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------

  // Able Data
  const columns = [
    { title: "ID", dataIndex: "_id" },
    {
      title: "Customer Name",
      dataIndex: "customerName",
    },
    { title: "Contact Number", dataIndex: "customerNumber" },
    { title: "Payment Method", dataIndex: "pamentMode" },
    { title: "Tax", dataIndex: "tax" },
    { title: "Total Amount", dataIndex: "totalAmount" },

    {
      title: "Action",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EyeOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedBill(record);
              setpopModal(true);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>invoice List</h1>
      </div>
      <Table columns={columns} dataSource={billsData} bordered />
      {popUpModal && (
        <Modal
          title="Invoice Details"
          open={popUpModal}
          onCancel={() => {
            setpopModal(false);
          }}
          footer={false}
        >
          {/* invoice modal start */}
          <div id="invoice-POS" ref={componentRef}>
            <center id="top">
              <div className="logo" />
              <div className="info">
                <img src={logo} alt="/" height="80" width="80" />
                <h2 className="mt-5">Burtique Fashion</h2>
                <p>Contact : 01726920703 | Rampura, Dhaka</p>
              </div>
            </center>
            {/* End invoice Top */}

            <div id="mid">
              <div className="mt-2">
                <p>
                  Customer Name : <b>{selectedBill.customerName}</b> <br />
                  Phone No: <b>{selectedBill.customerNumber}</b> <br />
                  Date : <b>{selectedBill.date.toString().substring(0, 10)}</b>
                  <br />
                </p>
                <hr style={{ margin: "5px" }} />
              </div>
            </div>
            {/* invoice Mid  */}
            <div id="bot">
              <div id="table">
                <table>
                  <tbody>
                    <tr className="tabletitle">
                      <td className="item">
                        <h2>Item</h2>
                      </td>
                      <td className="Hours">
                        <h2>Quantity</h2>
                      </td>

                      <td className="rate">
                        <h2>Price</h2>
                      </td>
                      <td className="rate">
                        <h2>Total</h2>
                      </td>
                    </tr>
                    {selectedBill.cartItems.map((item) => (
                      <>
                        <tr className="service">
                          <td className="tableitem">
                            <p className="itemtext">{item.name}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">{item.quantity}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">{item.price}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">
                              {item.quantity * item.price}
                            </p>
                          </td>
                        </tr>
                      </>
                    ))}

                    <tr className="tabletitle">
                      <td />
                      <td />
                      <td className="rate">
                        <h2>Tax : </h2>
                      </td>
                      <td className="payment">
                        <h2>${selectedBill.tax}</h2>
                      </td>
                    </tr>

                    <tr className="tabletitle">
                      <td />
                      <td />
                      <td className="rate">
                        <h2>Grand Total :</h2>
                      </td>
                      <td className="payment">
                        <h2>${selectedBill.totalAmount}</h2>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* End Table  */}
              <div id="legalcopy">
                <p className="legal">
                  <strong>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Recusandae aliquid illo laudantium eius quia odit nisi qui
                    inventore ea minima.
                    <b>najmussakib173@gmail.com</b>
                  </strong>
                </p>
              </div>
            </div>
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

export default BilsPage;
