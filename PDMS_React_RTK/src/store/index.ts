import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./features/employeeSlice";
import vanReducer from "./features/vanSlice";
import companyReducer from "./features/companySlice";
import shipmentReducer from "./features/shipmentSlice";

export const store = configureStore({
  reducer: {
    employees: employeeReducer,
    vans: vanReducer,
    companies: companyReducer,
    shipments: shipmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
