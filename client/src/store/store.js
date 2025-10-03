import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminAlumniReducer from "./admin/alumni-slice";
import adminEventReducer from "./admin/event-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAlumni: adminAlumniReducer,
    adminEvent: adminEventReducer,
  },
});

export default store;