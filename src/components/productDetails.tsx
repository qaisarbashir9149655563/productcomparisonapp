import React, { useEffect, useState } from "react";
import { Table, Button, notification } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string | null;
  filters?: Record<string, FilterValue | null>;
}

const ProductDetailsTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [compareList, setCompareList] = useState<number[]>([]);
  const navigate = useNavigate();

  const handleCompare = (productId: number) => {
    if (compareList.includes(productId)) {
      setCompareList(compareList.filter((id) => id !== productId));
    } else {
      setCompareList([...compareList, productId]);
    }
  };
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { pagination, sortField, sortOrder } = tableParams;
      const response = await axios.get("https://dummyjson.com/products", {
        params: {
          limit: pagination?.pageSize,
          skip: ((pagination?.current || 1) - 1) * (pagination?.pageSize || 10),
          sortBy: sortField,
          order: sortOrder === "ascend" ? "asc" : "desc",
        },
      });
      setProducts(response.data.products);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: response.data.total,
        },
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Product> | SorterResult<Product>[]
  ) => {
    const sorterResult = Array.isArray(sorter) ? sorter[0] : sorter;
    setTableParams({
      pagination,
      filters,
      ...(sorterResult.column
        ? {
            sortField: sorterResult.field?.toString(),
            sortOrder: sorterResult.order, // This will now work correctly
          }
        : {}),
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: true,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: true,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      sorter: true,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: true,
    },
    {
      title: "Compare",
      key: "compare",
      width: 100,
      render: (text: string, record: Product) => (
        <Button
          onClick={() => handleCompare(record.id)}
          type={compareList.includes(record.id) ? "primary" : "default"}
        >
          {compareList.includes(record.id) ? "Remove" : "Compare"}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={products}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      <Button
        onClick={() => {
          if (compareList.length >= 2) {
            navigate("/compare");
          } else {
            notification.warning({
              message: "Please select at least 2 products to compare",
            });
          }
        }}
        disabled={compareList.length < 2}
        style={{ marginTop: 16 }}
      >
        Go to Compare Page
      </Button>
    </div>
  );
};

export default ProductDetailsTable;
