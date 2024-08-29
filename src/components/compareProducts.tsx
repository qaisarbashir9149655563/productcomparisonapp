import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Modal, Table, notification } from "antd";
import axios from "axios";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
}

const CompareProducts: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const compareList = location.state?.compareList || [];
    fetchProducts(compareList);
    fetchAllProducts();
  }, [location]);

  const fetchProducts = async (ids: number[]) => {
    try {
      const fetchedProducts = await Promise.all(
        ids.map((id) => axios.get(`https://dummyjson.com/products/${id}`))
      );
      setProducts(fetchedProducts.map((response) => response.data));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get("https://dummyjson.com/products");
      setAllProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  const handleRemove = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
    notification.success({ message: "Product removed from comparison" });
  };

  const handleAddMore = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddProduct = (product: Product) => {
    if (products.length < 4 && !products.some((p) => p.id === product.id)) {
      setProducts([...products, product]);
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
          onClick={() => handleAddProduct(record)}
          disabled={
            products.some((p) => p.id === record.id) || products.length >= 4
          }
        >
          Add to Compare
        </Button>
      ),
    },
  ];

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
        {products.map((product) => (
          <Card
            key={product.id}
            title={product.title}
            style={{ width: 300, marginRight: 20, flexShrink: 0 }}
          >
            <p>Brand: {product.brand}</p>
            <p>Category: {product.category}</p>
            <p>Price: ${product.price}</p>
            <p>Description: {product.description}</p>
            <Button onClick={() => handleRemove(product.id)}>Remove</Button>
          </Card>
        ))}
      </div>
      <Button
        onClick={handleAddMore}
        disabled={products.length >= 4}
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
        />
      </Modal>
    </div>
  );
};

export default CompareProducts;
