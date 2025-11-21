import { createSlice } from "@reduxjs/toolkit";

const newJobDataSlice = createSlice({
  name: "newJobData",
  initialState: {
    data: {
      pickUpBuildingType: "",
      deliveryBuildingType: "",
      pickUpSuburb: "",
      dropOffSuburb: "",
      jobDataRows: [],
      jobQty: 0,
      jobKgs: 0,
      jobWeight: 0,
      jobLength: 0,
      jobWidth: 0,
      jobHeight: 0,
      jobTotalQty: 0,
      jobTotalKgs: 0,
      jobTotalVolume: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    setNewJobData: (state, action) => {
      state.data = action.payload;
    },
    resetNewJobDataStatus: (state) => {
      state.status = "idle";
    },
  },
});

export const { setNewJobData, resetNewJobDataStatus } = newJobDataSlice.actions;
export default newJobDataSlice.reducer;
