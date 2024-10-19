import React, { useEffect, useState } from "react";

import { Col, Row } from "antd";
import DefaultLayout from "./../components/DefaultLayout";
import axios from "axios";
import ItemList from "../components/ItemList";
import { useDispatch } from "react-redux";
const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [selectedCatagory, setSelectedCatagory] = useState("drinks");
  const categories = [
    {
      name: "Men_Collection",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZVOrnpmMgYzZNliTTxRFujes61ZfghCcWC4lofQfPOCwP_Ie4dINfTOzq3c1lp4aDHsk&usqp=CAU",
    },
    {
      name: "Woman_Collection",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSueICFqEJtwRKvBaAF8lzgZiEqvLYvfz2ytQ&s",
    },
    {
      name: "99_Product",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/9193/9193897.png",
    },
 
  ];
  const dispatch = useDispatch();
  // useeffect
  useEffect(() => {
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
        console.log(error);
      }
    };
    getAllItems();
  }, [dispatch]);
  return (
    <DefaultLayout>
      <div className="d-flex">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`d-flex catagory ${
              selectedCatagory === category.name && "catagory-active "
            }`}
            onClick={() => setSelectedCatagory(category.name)}
          >
            <h4>{category.name}</h4>
            <img
              src={category.imageUrl}
              alt={category.name}
              height="40"
              width="60"
            />
          </div>
        ))}
      </div>
      <Row>
        {itemsData
          .filter((i) => i.category === selectedCatagory)
          .map((item) => (
            <Col xs={24} lg={6} md={12} sm={6}>
              <ItemList key={item.id} item={item}></ItemList>
            </Col>
          ))}
      </Row>
    </DefaultLayout>
  );
};
export default Homepage;
