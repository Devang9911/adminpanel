import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import authReducer from "./authSlice";
import categoryReducer from "./categorySlice";
import productReducer from "./productSlice";
import featuresReducer from "./featuresSlice";
import planReducer from "./planSlice";
import workspaceReducer from "./workspaceSlice";
import dashboardReducer from "./dashboardSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
    features: featuresReducer,
    plans: planReducer,
    workspace: workspaceReducer,
    dashboard: dashboardReducer,
  },
});
