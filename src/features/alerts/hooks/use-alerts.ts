"use client";

import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { alertService } from "../services/alert.service";
import { AlertSummaryStats, StockAlertModel } from "../types/alert";

export const stockAlertsListAtom = atom<StockAlertModel[]>([]);
export const alertsLoadingAtom = atom<boolean>(false);
export const alertsStatsAtom = atom<AlertSummaryStats>({
  totalAlerts: 0,
  outOfStockCount: 0,
  criticalCount: 0,
  totalDeficitUnits: 0,
});
export const alertsErrorAtom = atom<string | null>(null);

export function useAlerts() {
  const [alerts, setAlerts] = useAtom(stockAlertsListAtom);
  const [loading, setLoading] = useAtom(alertsLoadingAtom);
  const [stats, setStats] = useAtom(alertsStatsAtom);
  const [errorMessage, setErrorMessage] = useAtom(alertsErrorAtom);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const alertModels: StockAlertModel[] = await alertService.getStockAlerts();
      const calculatedStats: AlertSummaryStats = alertService.calculateStats(alertModels);
      setAlerts(alertModels);
      setStats(calculatedStats);
    } catch (error) {
      const message: string =
        error instanceof Error ? error.message : "Error al cargar alertas de stock";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }, [setAlerts, setLoading, setStats, setErrorMessage]);

  return {
    alerts,
    loading,
    stats,
    errorMessage,
    fetchAlerts,
  };
}
