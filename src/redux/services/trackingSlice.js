import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

export const getTracking = createAsyncThunk(
  "data/getTracking",
  async ({ freight_id, formData }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `/freight/${freight_id}/get_couriers_tracking`,
        formData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const trackingSlice = createSlice({
  name: "tracking",
  initialState: {
    data: {},
    loading: false,
    error: null,
  },
  reducers: {
    setTracking: (state, action) => {
      state.data = action.payload;
    },
    resetTrackingStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTracking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTracking.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action?.payload) {
          state.data = [action.payload];
        }
      })
      .addCase(getTracking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setTracking, resetTrackingStatus } = trackingSlice.actions;
export default trackingSlice.reducer;
