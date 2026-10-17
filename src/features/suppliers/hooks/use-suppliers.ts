"use client";

import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { supplierService } from "../services/supplier.service";
import {
  CreateSupplierInput,
  SupplierFilterInput,
  SupplierOutput,
  UpdateSupplierInput,
} from "../types/supplier";
import { PageOutput } from "@/core/types/pagination";

export const suppliersListAtom = atom<SupplierOutput[]>([]);
export const suppliersLoadingAtom = atom<boolean>(false);
export const suppliersTotalAtom = atom<number>(0);
export const suppliersErrorAtom = atom<string | null>(null);

export function useSuppliers() {
  const [suppliers, setSuppliers] = useAtom(suppliersListAtom);
  const [loading, setLoading] = useAtom(suppliersLoadingAtom);
  const [total, setTotal] = useAtom(suppliersTotalAtom);
  const [errorMessage, setErrorMessage] = useAtom(suppliersErrorAtom);

  const fetchSuppliers = useCallback(
    async (filterText?: string, pageNumber: number = 0, pageSize: number = 10) => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const filterInput: SupplierFilterInput = filterText ? { name: filterText } : {};
        const response: PageOutput<SupplierOutput> = await supplierService.search({
          pageNumber,
          pageSize,
          sortBy: "name",
          sortDirection: "ASC",
          filter: filterInput,
        });
        setSuppliers(response.items);
        setTotal(response.total);
      } catch (error) {
        const message: string = error instanceof Error ? error.message : "Error al cargar proveedores";
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    },
    [setSuppliers, setLoading, setTotal, setErrorMessage]
  );

  const createSupplier = async (input: CreateSupplierInput): Promise<boolean> => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await supplierService.create(input);
      await fetchSuppliers();
      return true;
    } catch (error) {
      const message: string = error instanceof Error ? error.message : "Error al crear proveedor";
      setErrorMessage(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSupplier = async (input: UpdateSupplierInput): Promise<boolean> => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await supplierService.update(input);
      await fetchSuppliers();
      return true;
    } catch (error) {
      const message: string = error instanceof Error ? error.message : "Error al actualizar proveedor";
      setErrorMessage(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSupplier = async (id: string): Promise<boolean> => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await supplierService.delete(id);
      await fetchSuppliers();
      return true;
    } catch (error) {
      const message: string = error instanceof Error ? error.message : "Error al eliminar proveedor";
      setErrorMessage(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    suppliers,
    loading,
    total,
    errorMessage,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  };
}
