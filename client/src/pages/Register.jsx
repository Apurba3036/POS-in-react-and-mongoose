import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { message } from "antd";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (value) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      await axios.post("http://localhost:8080/api/users/register", value);

      message.success("Register Successfully");
      navigate("/login");
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("auth")) {
      localStorage.getItem("auth");
      navigate("/");
    }
  }, [navigate]);
  return (
    <>
      <div>
        <div className="register">
          <div className="register-form">
            <h1>Burtique Fashion</h1>
            <h3>Register page</h3>
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item name="name" label="Name">
                <Input />
              </Form.Item>
              <Form.Item name="userId" label="User Email">
                <Input />
              </Form.Item>
              <Form.Item name="password" label="Password">
                <Input type="password" />
              </Form.Item>

              <div className="d-flex justify-content-between">
                <p>
                  Already Register Please
                  <Link to="/login">Login Here</Link>
                </p>
                <Button type="primary" htmlType="submit">
                  Register
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
