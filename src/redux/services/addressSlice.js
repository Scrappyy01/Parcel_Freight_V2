import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./../../utils/axiosInstance";
import { transformObjectToArray } from "@/utils/helpers";
import { updateCollectionData } from "./collectionSlice";

export const submitAddress = createAsyncThunk(
  "data/submitAddress",
  async ({ freight_id, formData }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `/freight/${freight_id}/addresses`,
        formData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const updateAddress = createAsyncThunk(
  "data/updateAddress",
  async ({ freight_id, formData }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(
        `/freight/${freight_id}/addresses`,
        formData
      );

      thunkAPI.dispatch(updateCollectionData(response.data));
      return response.data;
    } catch (error) {
      // ✅ Always check for Axios error response
      if (error.response) {
        const { status, data } = error.response;

        // Laravel validation error
        if (status === 422 && data.errors) {
          return thunkAPI.rejectWithValue(data);
        }

        // Other errors
        return thunkAPI.rejectWithValue({
          message: data?.message || "Request failed",
        });
      }

      // Network or unknown errors
      return thunkAPI.rejectWithValue({
        message: error.message || "Unknown error occurred",
      });
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    data: {},
    status: "idle",
    error: null,
  },
  reducers: {
    setAddress: (state, action) => {
      state.data = action.payload.freight_address;
    },
    resetAddressStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitAddress.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action?.payload) {
          state.data.freight_address = transformObjectToArray(action.payload);
        }
      })
      .addCase(submitAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = [
          action.payload.pickup,
          action.payload.dropoff,
          action.payload.sender,
        ];
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export const { setAddress, resetAddressStatus } = addressSlice.actions;
export default addressSlice.reducer;
