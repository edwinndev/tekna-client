import { apiClient } from "@/core/lib/api-client";
import { PageOutput, SearchInput } from "@/core/types/pagination";
import {
  CreateSupplierInput,
  SupplierFilterInput,
  SupplierModel,
  SupplierOutput,
  UpdateSupplierInput,
} from "../types/supplier";

export class SupplierService {
  public async search(
    input: SearchInput<SupplierFilterInput>
  ): Promise<PageOutput<SupplierOutput>> {
    return await apiClient
      .post("suppliers/filter", { json: input })
      .json<PageOutput<SupplierOutput>>();
  }

  public async getById(id: string): Promise<SupplierOutput> {
    return await apiClient.get(`suppliers/${id}`).json<SupplierOutput>();
  }

  public async create(input: CreateSupplierInput): Promise<SupplierOutput> {
    return await apiClient
      .post("suppliers", { json: input })
      .json<SupplierOutput>();
  }

  public async update(input: UpdateSupplierInput): Promise<SupplierOutput> {
    return await apiClient
      .put("suppliers", { json: input })
      .json<SupplierOutput>();
  }

  public async delete(id: string): Promise<void> {
    await apiClient.delete(`suppliers/${id}`);
  }

  public async fetchAllModels(): Promise<SupplierModel[]> {
    const response: PageOutput<SupplierOutput> = await this.search({
      pageNumber: 0,
      pageSize: 100,
      sortBy: "name",
      sortDirection: "ASC",
    });
    return response.items.map((item: SupplierOutput) => new SupplierModel(item));
  }
}

export const supplierService = new SupplierService();
