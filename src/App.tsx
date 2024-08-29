import React, { useState, lazy, Suspense } from "react";
import { Layout, ConfigProvider, theme, Spin } from "antd";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";

const { Content } = Layout;

const ProductDetailsTable = lazy(() => import("./components/productDetails"));
const CompareProducts = lazy(() => import("./components/compareProducts"));

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Navbar onThemeChange={handleThemeChange} />
        <Layout>
          <Sidebar />
          <Layout style={{ marginLeft: 200, marginTop: 64 }}>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: isDarkMode ? "#141414" : "#fff",
              }}
            >
              <Suspense fallback={<Spin size="large" />}>
                <Routes>
                  <Route path="/" element={<ProductDetailsTable />} />
                  <Route path="/compare" element={<CompareProducts />} />
                </Routes>
              </Suspense>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
