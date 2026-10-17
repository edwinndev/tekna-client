"use client";

import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { productService } from "../services/product.service";
import {
  CreateProductInput,
  ProductFilterInput,
  ProductOutput,
  UpdateProductInput,
} from "../types/product";
import { PageOutput } from "@/core/types/pagination";

export const productsListAtom = atom<ProductOutput[]>([]);
export const productsLoadingAtom = atom<boolean>(false);
export const productsTotalAtom = atom<number>(0);
export const productsFilterAtom = atom<ProductFilterInput>({});
export const productsErrorAtom = atom<string | null>(null);

export function useProducts() {
  const [products, setProducts] = useAtom(productsListAtom);
  const [loading, setLoading] = useAtom(productsLoadingAtom);
  const [total, setTotal] = useAtom(productsTotalAtom);
  const [filter, setFilter] = useAtom(productsFilterAtom);
  const [errorMessage, setErrorMessage] = useAtom(productsErrorAtom);

  const fetchProducts = useCallback(
    async (
      customFilter?: ProductFilterInput,
      pageNumber: number = 0,
      pageSize: number = 10
    ) => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const activeFilter: ProductFilterInput = customFilter !== undefined ? customFilter : filter;
        const response: PageOutput<ProductOutput> = await productService.search({
          pageNumber,
          pageSize,
          sortBy: "createdAt",
          sortDirection: "DESC",
          filter: activeFilter,
        });
        setProducts(response.items);
        setTotal(response.total);
      } catch (error) {
        const message: string = error instanceof Error ? error.message : "Error al cargar productos";
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    },
    [filter, setProducts, setLoading, setTotal, setErrorMessage]
  );

  const createProduct = async (input: CreateProductInput): Promise<boolean> => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await productService.create(input);
      await fetchProducts();
      return true;
    } catch (error) {
      const message: string = error instanceof Error ? error.message : "Error al crear producto";
      setErrorMessage(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (input: UpdateProductInput): Promise<boolean> => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await productService.update(input);
      await fetchProducts();
      return true;
    } catch (error) {
      const message: string = error instanceof Error ? error.message : "Error al actualizar producto";
      setErrorMessage(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await productService.delete(id);
      await fetchProducts();
      return true;
    } catch (error) {
      const message: string = error instanceof Error ? error.message : "Error al eliminar producto";
      setErrorMessage(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    total,
    filter,
    setFilter,
    errorMessage,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
