"use client";

import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { movementService } from "../services/movement.service";
import {
  CreateInventoryMovementInput,
  InventoryMovementFilterInput,
  InventoryMovementOutput,
} from "../types/movement";
import { PageOutput } from "@/core/types/pagination";

export const movementsListAtom = atom<InventoryMovementOutput[]>([]);
export const movementsLoadingAtom = atom<boolean>(false);
export const movementsTotalAtom = atom<number>(0);
export const movementsErrorAtom = atom<string | null>(null);

export function useMovements() {
  const [movements, setMovements] = useAtom(movementsListAtom);
  const [loading, setLoading] = useAtom(movementsLoadingAtom);
  const [total, setTotal] = useAtom(movementsTotalAtom);
  const [errorMessage, setErrorMessage] = useAtom(movementsErrorAtom);

  const fetchMovements = useCallback(
    async (
      customFilter?: InventoryMovementFilterInput,
      pageNumber: number = 0,
      pageSize: number = 10
    ) => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const response: PageOutput<InventoryMovementOutput> =
          await movementService.search({
            pageNumber,
            pageSize,
            sortBy: "createdAt",
            sortDirection: "DESC",
            filter: customFilter,
          });
        setMovements(response.items);
        setTotal(response.total);
      } catch (error) {
        const message: string =
          error instanceof Error
            ? error.message
            : "Error al cargar movimientos de inventario";
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    },
    [setMovements, setLoading, setTotal, setErrorMessage]
  );

  const registerMovement = async (
    input: CreateInventoryMovementInput
  ): Promise<boolean> => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await movementService.registerMovement(input);
      await fetchMovements();
      return true;
    } catch (error) {
      const message: string =
        error instanceof Error
          ? error.message
          : "Error al registrar movimiento de inventario";
      setErrorMessage(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    movements,
    loading,
    total,
    errorMessage,
    fetchMovements,
    registerMovement,
  };
}
