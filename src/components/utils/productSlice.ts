import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
}

interface ProductState {
  compareList: number[];
  comparedProducts: Product[];
  allProducts: Product[];
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: ProductState = {
  compareList: [],
  comparedProducts: [],
  allProducts: [],
  loading: false,
  error: null,
  total: 0,
};

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params: { limit: number; skip: number }) => {
    const response = await axios.get("https://dummyjson.com/products", {
      params,
    });
    return response.data;
  }
);

export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (id: number) => {
    const response = await axios.get(`https://dummyjson.com/products/${id}`);
    return response.data;
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addToCompare: (state, action: PayloadAction<number>) => {
      if (
        !state.compareList.includes(action.payload) &&
        state.compareList.length < 4
      ) {
        state.compareList.push(action.payload);
      }
    },
    removeFromCompare: (state, action: PayloadAction<number>) => {
      state.compareList = state.compareList.filter(
        (id) => id !== action.payload
      );
      state.comparedProducts = state.comparedProducts.filter(
        (product) => product.id !== action.payload
      );
    },
    setComparedProducts: (state, action: PayloadAction<Product[]>) => {
      state.comparedProducts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.allProducts = [...state.allProducts, ...action.payload.products];
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        const existingIndex = state.comparedProducts.findIndex(
          (p) => p.id === action.payload.id
        );
        if (existingIndex >= 0) {
          state.comparedProducts[existingIndex] = action.payload;
        } else {
          state.comparedProducts.push(action.payload);
        }
      });
  },
});

export const { addToCompare, removeFromCompare, setComparedProducts } =
  productSlice.actions;
export default productSlice.reducer;
