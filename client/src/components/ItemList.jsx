import React from "react";
import { Card, Button, message } from "antd";

import { StarOutlined } from "@ant-design/icons";

import { useDispatch } from "react-redux";
const ItemList = ({ item }) => {
  const dispatch = useDispatch();
  // update cart handler
  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...item, quantity: 1 },
    });
    message.success("Item added Successfully");
  };
  const { Meta } = Card;

  return (
    <div>
      <Card
        hoverable
        style={{ width: 240, marginTop: 20 }}
        cover={<img alt="item.name" src={item.image} style={{ height: 250 }} />}
      >
        <Meta title={item.name} />
        <div className="item-button">
          <h5 className="text-warning mt-2">
            <span>
              <b className="TOO">৳ </b>
            </span>
            {item.price}
          </h5>
          <StarOutlined className="icon" />
          <StarOutlined className="icon" />
          <StarOutlined className="icon" />
          <Button onClick={() => handleAddToCart()}>Add to cart</Button>
        </div>
      </Card>
    </div>
  );
};

export default ItemList;
