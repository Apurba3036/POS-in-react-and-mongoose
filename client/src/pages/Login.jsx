import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { message } from "antd";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (value) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const res = await axios.post(
        "http://localhost:8080/api/users/login",
        value
      );
      message.success("user login  Successfully");
      localStorage.setItem("auth", JSON.stringify(res.data));
      navigate("/");

      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  // currently login user
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
            <h3>Login page</h3>
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item name="userId" label="User ID">
                <Input />
              </Form.Item>
              <Form.Item name="password" label="Password">
                <Input type="password" />
              </Form.Item>

              <div className="d-flex justify-content-between">
                <p>
                  not a user please
                  <Link to="/register">Register Here</Link>
                </p>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
