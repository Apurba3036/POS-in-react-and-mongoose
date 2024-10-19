import React from "react";
import { Space, Spin } from "antd";
const Spinner = () => {
  return (
    <div className="spinner">
      <Space size="middle">
        <Spin size="large" />
      </Space>
    </div>
  );
};

export default Spinner;
