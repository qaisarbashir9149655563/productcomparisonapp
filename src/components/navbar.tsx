import React from "react";
import { Avatar, Layout, Switch } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

interface NavbarProps {
  onThemeChange: (checked: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onThemeChange }) => {
  return (
    <Header
      style={{
        position: "fixed",
        zIndex: 1,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link to="/" style={{ color: "white" }}>
        Product Comparison App
      </Link>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar icon={<UserOutlined />} style={{ marginRight: "16px" }} />
        <Switch
          onChange={onThemeChange}
          checkedChildren="Dark"
          unCheckedChildren="Light"
        />
      </div>
    </Header>
  );
};

export default Navbar;
