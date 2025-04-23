import { create } from "zustand";
import { DashboardLayoutState } from "./dashboard-layout.type";
import { persist } from "zustand/middleware";
import REPO_CONSTANT from "@repo/utils/constant";

const { LOCALSTORAGE_KEYS } = REPO_CONSTANT;

const useDashboardLayoutStore = create<DashboardLayoutState>()(
    persist(
        (set) => ({
            openSidebar: false,
            setOpenSideBar: (openSidebar: boolean) => set({ openSidebar })
        }),
        {
            name: LOCALSTORAGE_KEYS.dashboardLayout,
            partialize: (state) => ({ 
                openSidebar: state.openSidebar
            })
        }
    )
);

export { useDashboardLayoutStore };