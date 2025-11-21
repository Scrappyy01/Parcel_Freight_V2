import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./../../utils/axiosInstance";

export const submitPayment = createAsyncThunk(
  "data/submitPayment",
  async ({ freight_id, formData }, thunkAPI) => {
    const response = await axiosInstance.post(
      `/freight/${freight_id}/payment`,
      formData
    );
    return response.data;
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    data: {},
    loading: false,
    error: null,
  },
  reducers: {
    setPayment: (state, action) => {
      state.data = action.payload.freight_payment;
    },
    resetPaymentStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitPayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitPayment.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action?.payload) {
          state.data = [action.payload.data.freightPayment];
        }
      })
      .addCase(submitPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || action.error?.message;
      });
  },
});

export default paymentSlice.reducer;
export const { setPayment, resetPaymentStatus } = paymentSlice.actions;
