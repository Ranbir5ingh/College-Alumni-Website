import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminAlumniReducer from "./admin/alumni-slice";
import adminEventReducer from "./admin/event-slice";
import userEventReducer from "./user/event-slice";
import userAlumniReducer from "./user/alumni-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAlumni: adminAlumniReducer,
    adminEvent: adminEventReducer,


    userEvent: userEventReducer,
    userAlumni: userAlumniReducer,
  },
});

export default store;