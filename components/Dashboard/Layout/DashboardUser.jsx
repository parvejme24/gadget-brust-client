"use client";

import { createContext, useContext } from "react";

// the signed-in user, available to every dashboard page
const DashboardUserContext = createContext(null);

export const DashboardUserProvider = DashboardUserContext.Provider;
export const useDashboardUser = () => useContext(DashboardUserContext);
