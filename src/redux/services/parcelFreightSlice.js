import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./../../utils/axiosInstance";
import { getSelectedService } from "./../../utils/helpers";
import { updateCollectionData } from "./collectionSlice";

export const fetchPackageWithQuote = createAsyncThunk(
  "data/fetchPackageWithQuote",
  async (freight_id) => {
    const response = await axiosInstance.get(
      `/freight/${freight_id}/get_quote`
    );
    return response.data;
  }
);

export const submitPackageWithQuote = createAsyncThunk(
  "data/submitPackageWithQuote",
  async (data, thunkAPI) => {
    const response = await axiosInstance.put(
      `/freight/${data.freight_id}/freight_service_quote`,
      data
    );

    thunkAPI.dispatch(updateCollectionData(response.data));

    return response.data;
  }
);

const parcelFreightSlice = createSlice({
  name: "parcelFreight",
  initialState: {
    data: {},
    loading: "idle",
    error: null,
  },
  reducers: {
    setParcelFreight: (state, action) => {
      const selected_service = getSelectedService(action.payload);
      state.data = {
        freight_service_quote_id: action.payload.freight_service_quote_id,
        ...selected_service,
      };
    },
    resetParcelFreightStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackageWithQuote.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPackageWithQuote.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = { ...state.data, ...action.payload };
      })
      .addCase(fetchPackageWithQuote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(submitPackageWithQuote.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitPackageWithQuote.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = { ...state.data, ...action.payload };
      })
      .addCase(submitPackageWithQuote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const { setParcelFreight, resetParcelFreightStatus } =
  parcelFreightSlice.actions;
export default parcelFreightSlice.reducer;
