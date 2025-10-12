import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminAlumniReducer from "./admin/alumni-slice";
import adminEventReducer from "./admin/event-slice";
import adminDonationReducer from "./admin/donation-slice";
import adminmembershipReducer from "./admin/membership-slice";
import adminNewsReducer from "./admin/news-slice";
import adminGalleryReducer from "./admin/gallery-slice";
import userEventReducer from "./user/event-slice";
import userAlumniReducer from "./user/alumni-slice";
import userAttendanceReducer from "./user/attendance-slice";
import userDonationReducer from "./user/donation-slice";
import userNewsReducer from "./user/news-slice";
import usermembershipReducer from "./user/membership-slice";
import userGalleryReducer from "./user/gallery-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAlumni: adminAlumniReducer,
    adminEvent: adminEventReducer,
    adminDonation: adminDonationReducer,
    adminNews: adminNewsReducer,
    adminMembership: adminmembershipReducer,
    adminGallery: adminGalleryReducer,

    userEvent: userEventReducer,
    userAlumni: userAlumniReducer,
    userAttendance: userAttendanceReducer,
    userDonation: userDonationReducer,
    userNews: userNewsReducer,
    userMembership: usermembershipReducer,
    userGallery: userGalleryReducer,
  },
});

export default store;