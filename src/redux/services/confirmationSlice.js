import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./../../utils/axiosInstance";
import {
  updateConfirmationData,
  updateCollectionData,
} from "./collectionSlice";

export const updateConfirmation = createAsyncThunk(
  "data/updateConfirmation",
  async ({ freight_id, submitData }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(
        `/freight/${freight_id}/confirmation`,
        submitData
      );

      thunkAPI.dispatch(updateConfirmationData(response.data));
      thunkAPI.dispatch(updateCollectionData(response.data));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error,
        message: error.response.data.message,
      });
    }
  }
);

const confirmationSlice = createSlice({
  name: "booking",
  initialState: {
    data: {},
    loading: false,
    error: null,
  },
  reducers: {
    setConfirmation: (state, action) => {
      state.data = action.payload;
    },
    resetConfirmationStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateConfirmation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateConfirmation.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(updateConfirmation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? action.error?.message ?? "";
      });
  },
});

export const { setConfirmation, resetConfirmationStatus } =
  confirmationSlice.actions;
export default confirmationSlice.reducer;
