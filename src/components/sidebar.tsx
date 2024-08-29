import React from "react";
import { Layout, Menu } from "antd";
import { ShopOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuSelect = (key: string) => {
    if (key === "1") {
      navigate("/");
    } else if (key === "2") {
      navigate("/compare");
    }
  };

  return (
    <Sider
      width={200}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 64,
        bottom: 0,
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname === "/" ? "1" : "2"]}
        style={{ height: "100%", borderRight: 0 }}
        onSelect={({ key }) => handleMenuSelect(key)}
      >
        <Menu.Item key="1" icon={<ShopOutlined />}>
          Product Details
        </Menu.Item>
        <Menu.Item key="2" icon={<ShopOutlined />}>
          Compare Products
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
