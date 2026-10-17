import { apiClient } from "@/core/lib/api-client";
import { PageOutput, SearchInput } from "@/core/types/pagination";
import {
  CreateInventoryMovementInput,
  InventoryMovementFilterInput,
  InventoryMovementOutput,
} from "../types/movement";

export class MovementService {
  public async register(
    input: CreateInventoryMovementInput
  ): Promise<InventoryMovementOutput> {
    return await apiClient
      .post("movements", { json: input })
      .json<InventoryMovementOutput>();
  }

  public async registerMovement(
    input: CreateInventoryMovementInput
  ): Promise<InventoryMovementOutput> {
    return this.register(input);
  }

  public async getById(id: string): Promise<InventoryMovementOutput> {
    return await apiClient.get(`movements/${id}`).json<InventoryMovementOutput>();
  }

  public async search(
    input: SearchInput<InventoryMovementFilterInput>
  ): Promise<PageOutput<InventoryMovementOutput>> {
    return await apiClient
      .post("movements/filter", { json: input })
      .json<PageOutput<InventoryMovementOutput>>();
  }
}

export const movementService = new MovementService();
