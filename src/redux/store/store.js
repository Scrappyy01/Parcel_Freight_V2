import { configureStore } from "@reduxjs/toolkit";
import newJobDataReducer from "../services/newJobDataSlice";
import collectionReducer from "../services/collectionSlice";
import parcelFreightReducer from "../services/parcelFreightSlice";
import addressReducer from "../services/addressSlice";
import confirmationReducer from "../services/confirmationSlice";
import paymentReducer from "../services/paymentSlice";
import trackingReducer from "../services/trackingSlice";

const store = configureStore({
  reducer: {
    newJobData: newJobDataReducer,
    collection: collectionReducer,
    parcelFreight: parcelFreightReducer,
    address: addressReducer,
    confirmation: confirmationReducer,
    payment: paymentReducer,
    tracking: trackingReducer,
  },

  devTools: process.env.NODE_ENV !== "production",
});

export default store;
