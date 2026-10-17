"use client";

import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { categoryService } from "../services/category.service";
import {
  CategoryFilterInput,
  CategoryOutput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types/category";
import { PageOutput } from "@/core/types/pagination";

export const categoriesListAtom = atom<CategoryOutput[]>([]);
export const categoriesLoadingAtom = atom<boolean>(false);
export const categoriesTotalAtom = atom<number>(0);
export const categoriesErrorAtom = atom<string | null>(null);

export function useCategories() {
  const [categories, setCategories] = useAtom(categoriesListAtom);
  const [loading, setLoading] = useAtom(categoriesLoadingAtom);
  const [total, setTotal] = useAtom(categoriesTotalAtom);
  const [errorMessage, setErrorMessage] = useAtom(categoriesErrorAtom);

  const fetchCategories = useCallback(
    async (filterText?: string, pageNumber: number = 0, pageSize: number = 10) => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const filterInput: CategoryFilterInput = filterText ? { name: filterText } : {};
        const response: PageOutput<CategoryOutput> = await categoryService.search({
          pageNumber,
          pageSize,
          sortBy: "name",
          sortDirection: "ASC",
          filter: filterInput,
        });
        setCategories(response.items);
        setTotal(response.total);
      } catch (error) {
        const message: string = error instanceof Error ? error.message : "Error al cargar categorías";
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    },
    [setCategories, setLoading, setTotal, setErrorMessage]
  );

  const createCategory = async (input: CreateCategoryInput): Promise<boolean> => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await categoryService.create(input);
      await fetchCategories();
      return true;
    } catch (error) {
      const message: string = error instanceof Error ? error.message : "Error al crear categoría";
      setErrorMessage(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (input: UpdateCategoryInput): Promise<boolean> => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await categoryService.update(input);
      await fetchCategories();
      return true;
    } catch (error) {
      const message: string = error instanceof Error ? error.message : "Error al actualizar categoría";
      setErrorMessage(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await categoryService.delete(id);
      await fetchCategories();
      return true;
    } catch (error) {
      const message: string = error instanceof Error ? error.message : "Error al eliminar categoría";
      setErrorMessage(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    total,
    errorMessage,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
