import { apiClient } from "@/core/lib/api-client";
import { PageOutput, SearchInput } from "@/core/types/pagination";
import {
  CreateProductInput,
  ProductFilterInput,
  ProductModel,
  ProductOutput,
  UpdateProductInput,
} from "../types/product";

export class ProductService {
  public async search(
    input: SearchInput<ProductFilterInput>
  ): Promise<PageOutput<ProductOutput>> {
    return await apiClient
      .post("products/filter", { json: input })
      .json<PageOutput<ProductOutput>>();
  }

  public async getById(id: string): Promise<ProductOutput> {
    return await apiClient.get(`products/${id}`).json<ProductOutput>();
  }

  public async getBySku(sku: string): Promise<ProductOutput> {
    return await apiClient.get(`products/sku/${sku}`).json<ProductOutput>();
  }

  public async create(input: CreateProductInput): Promise<ProductOutput> {
    return await apiClient
      .post("products", { json: input })
      .json<ProductOutput>();
  }

  public async update(input: UpdateProductInput): Promise<ProductOutput> {
    return await apiClient
      .put("products", { json: input })
      .json<ProductOutput>();
  }

  public async delete(id: string): Promise<void> {
    await apiClient.delete(`products/${id}`);
  }

  public async fetchLowStockProducts(): Promise<ProductModel[]> {
    const response: PageOutput<ProductOutput> = await this.search({
      pageNumber: 0,
      pageSize: 50,
      sortBy: "stock",
      sortDirection: "ASC",
      filter: {
        lowStockOnly: true,
      },
    });
    return response.items.map((item: ProductOutput) => new ProductModel(item));
  }
}

export const productService = new ProductService();
