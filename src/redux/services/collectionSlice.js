import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./../../utils/axiosInstance";
import { getPackage, getServiceQuote } from "./../../utils/helpers";

import { setParcelFreight } from "./parcelFreightSlice";
import { setAddress } from "./addressSlice";
import { setConfirmation } from "./confirmationSlice";
import { setPayment } from "./paymentSlice";

export const fetchCollection = createAsyncThunk(
  "data/fetchCollection",
  async ({ freight_id }, thunkAPI) => {
    if (!freight_id) {
      return thunkAPI.rejectWithValue({
        message: "Freight ID and User ID are required.",
        status: 400,
      });
    }
    try {
      const response = await axiosInstance.get(
        `/freight/${freight_id}/get_quote_details`
      );
      if (response.data.status === 422) {
        return thunkAPI.rejectWithValue({
          message: response.data.message,
          status: response.data.status,
        });
      }

      thunkAPI.dispatch(setParcelFreight(response.data));
      thunkAPI.dispatch(setAddress(response.data));
      thunkAPI.dispatch(setConfirmation(response.data));
      thunkAPI.dispatch(setPayment(response.data));

      return response.data;
    } catch (error) {
      console.error("Error fetching collection:", error);
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status || 500,
        error: error.response?.data || error.message,
      });
    }
  }
);

const collectionSlice = createSlice({
  name: "collection",
  initialState: {
    data: {},
    loading: "idle",
    error: null,
  },
  reducers: {
    updateCollectionData: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
    updateConfirmationData: (state, action) => {
      state.data = { ...state.data, ...action.payload.data };
    },
    resetCollectionStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollection.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCollection.fulfilled, (state, action) => {
        state.status = "succeeded";
        const freight_package = getPackage(action.payload.freight_package);
        const freight_service_quote = getServiceQuote(
          action.payload.freight_service_quote
        );

        state.data = {
          ...action.payload,
          ...freight_package,
          ...freight_service_quote,
        };
      })
      .addCase(fetchCollection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
        state.errorDetails = action.payload;
      });
  },
});
export const {
  updateCollectionData,
  updateConfirmationData,
  resetCollectionStatus,
} = collectionSlice.actions;
export default collectionSlice.reducer;
