import { apiClient } from "@/core/lib/api-client";
import { PageOutput, SearchInput } from "@/core/types/pagination";
import {
  CategoryFilterInput,
  CategoryModel,
  CategoryOutput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types/category";

export class CategoryService {
  public async search(
    input: SearchInput<CategoryFilterInput>
  ): Promise<PageOutput<CategoryOutput>> {
    return await apiClient
      .post("categories/filter", { json: input })
      .json<PageOutput<CategoryOutput>>();
  }

  public async getById(id: string): Promise<CategoryOutput> {
    return await apiClient.get(`categories/${id}`).json<CategoryOutput>();
  }

  public async create(input: CreateCategoryInput): Promise<CategoryOutput> {
    return await apiClient
      .post("categories", { json: input })
      .json<CategoryOutput>();
  }

  public async update(input: UpdateCategoryInput): Promise<CategoryOutput> {
    return await apiClient
      .put("categories", { json: input })
      .json<CategoryOutput>();
  }

  public async delete(id: string): Promise<void> {
    await apiClient.delete(`categories/${id}`);
  }

  public async fetchAllModels(): Promise<CategoryModel[]> {
    const response: PageOutput<CategoryOutput> = await this.search({
      pageNumber: 0,
      pageSize: 100,
      sortBy: "name",
      sortDirection: "ASC",
    });
    return response.items.map((item: CategoryOutput) => new CategoryModel(item));
  }
}

export const categoryService = new CategoryService();
