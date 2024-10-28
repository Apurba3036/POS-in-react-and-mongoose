import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Layout, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import img from "../logo/burtique.jpg";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  CopyOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import "../styles/DefaultLayout.css";
import Spinner from "./Spinner";

const { Header, Sider, Content } = Layout;

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    // Retrieve and parse the auth object from localStorage
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth && auth.role) {
      setRole(auth.role);
    }
  }, []);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Layout>
      {loading && <Spinner />}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logoimg">
          <h4 className="text-center text-light font-weight-bold mt-4">
            Burtique Fashion
          </h4>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[window.location.pathname]}>
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>

          {/* Conditionally render items based on the role */}
          {role === "admin" ? (
            <>
              <Menu.Item key="/bills" icon={<CopyOutlined />}>
                <Link to="/bills">Bills</Link>
              </Menu.Item>
              <Menu.Item key="/items" icon={<UnorderedListOutlined />}>
                <Link to="/items">Items</Link>
              </Menu.Item>
              <Menu.Item key="/users" icon={<UsergroupAddOutlined />}>
                <Link to="/users">Users</Link>
              </Menu.Item>
            </>
          ) : (
            <>
            <Menu.Item key="/cart" icon={<ShoppingCartOutlined />}>
              <Link to="/cart">Cart</Link>
            </Menu.Item>
            <Menu.Item key="/userbilPage" icon={<CopyOutlined />}>
              <Link to="/userbilPage">Bill</Link>
            </Menu.Item>
            </>
          )}

          <Menu.Item key="/customers" icon={<UserOutlined />}>
            <Link to="/CustomerPage">About Us</Link>
          </Menu.Item>
          <Menu.Item
            key="/logout"
            icon={<LogoutOutlined />}
            onClick={() => {
              localStorage.removeItem("auth");
              navigate("/login");
            }}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: "trigger",
            onClick: toggle,
          })}
          {/* <div
            className="cart-item d-flex justify-content-space-between flex-row"
            onClick={() => navigate("/cart")}
          >
            <h5 className="mt-2 text-primary lengthh ">{cartItems.length}</h5>
            <ShoppingCartOutlined className="iconn" />
          </div> */}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
