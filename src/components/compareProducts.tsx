import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Modal, Table, notification, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./utils/store";
import {
  fetchProducts,
  fetchProductById,
  removeFromCompare,
  addToCompare,
} from "./utils/productSlice";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
}

const CompareProducts: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { compareList, comparedProducts, allProducts, loading, total } =
    useSelector((state: RootState) => state.product);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalPage, setModalPage] = useState(1);

  useEffect(() => {
    fetchComparedProducts();
  }, [compareList]);

  const fetchComparedProducts = async () => {
    for (const id of compareList) {
      if (!comparedProducts.some((product) => product.id === id)) {
        dispatch(fetchProductById(id));
      }
    }
  };

  const handleRemove = (id: number) => {
    dispatch(removeFromCompare(id));
    notification.success({ message: "Product removed from comparison" });
  };

  const handleAddMore = () => {
    setIsModalVisible(true);
    setModalPage(1);
    dispatch(fetchProducts({ limit: 10, skip: 0 }));
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddProduct = (productId: number) => {
    if (compareList.length < 4 && !compareList.includes(productId)) {
      dispatch(addToCompare(productId));
      notification.success({ message: "Product added to comparison" });
    } else {
      notification.warning({
        message: "Cannot add more products or duplicate products",
      });
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title", width: 200 },
    { title: "Brand", dataIndex: "brand", key: "brand", width: 100 },
    { title: "Category", dataIndex: "category", key: "category", width: 100 },
    { title: "Price", dataIndex: "price", key: "price", width: 100 },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (text: string, record: Product) => (
        <Button
          onClick={() => handleAddProduct(record.id)}
          disabled={compareList.includes(record.id) || compareList.length >= 4}
        >
          Add to Compare
        </Button>
      ),
    },
  ];

  const handleTableScroll = (event: React.UIEvent<HTMLElement>) => {
    const { target } = event;
    if (target) {
      const { scrollTop, clientHeight, scrollHeight } = target as HTMLElement;
      if (scrollHeight - scrollTop === clientHeight) {
        if (allProducts.length < total) {
          setModalPage((prev) => prev + 1);
          dispatch(fetchProducts({ limit: 10, skip: modalPage * 10 }));
        }
      }
    }
  };

  return (
    <div>
      <h1>Compare Products</h1>
      <Button onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>
        Back to Product Details
      </Button>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          overflowX: "auto",
        }}
      >
        {comparedProducts.map((product: any) => (
          <Card
            key={product.id}
            title={product.title}
            style={{ width: 300, marginRight: 20, flexShrink: 0 }}
          >
            <p>
              <strong>Brand:</strong> {product.brand}
            </p>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Price:</strong> ${product.price}
            </p>
            <p>
              <strong>Description:</strong> {product.description}
            </p>
            <Button onClick={() => handleRemove(product.id)}>Remove</Button>
          </Card>
        ))}
      </div>
      <Button
        onClick={handleAddMore}
        disabled={compareList.length >= 4}
        style={{ marginTop: "20px" }}
      >
        Add More
      </Button>
      <Modal
        title="Add Products to Compare"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={1000}
        bodyStyle={{ height: 600, overflow: "auto" }}
      >
        <Table
          columns={columns}
          dataSource={allProducts}
          scroll={{ y: 500 }}
          pagination={false}
          loading={loading}
          onScroll={handleTableScroll}
        />
      </Modal>
    </div>
  );
};

export default CompareProducts;
