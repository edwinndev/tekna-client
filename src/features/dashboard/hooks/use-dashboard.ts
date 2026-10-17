"use client";

import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { dashboardService } from "../services/dashboard.service";
import { DashboardOverviewModel } from "../types/dashboard";

export const dashboardOverviewAtom = atom<DashboardOverviewModel | null>(null);
export const dashboardLoadingAtom = atom<boolean>(true);
export const dashboardErrorAtom = atom<string | null>(null);

export function useDashboard() {
  const [overview, setOverview] = useAtom(dashboardOverviewAtom);
  const [loading, setLoading] = useAtom(dashboardLoadingAtom);
  const [errorMessage, setErrorMessage] = useAtom(dashboardErrorAtom);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data: DashboardOverviewModel = await dashboardService.getOverview();
      setOverview(data);
    } catch (error) {
      const message: string =
        error instanceof Error ? error.message : "Error al cargar datos del panel";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }, [setOverview, setLoading, setErrorMessage]);

  return {
    overview,
    loading,
    errorMessage,
    fetchOverview,
  };
}
