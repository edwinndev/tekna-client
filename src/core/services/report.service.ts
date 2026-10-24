import { apiClient } from "../lib/api-client";
import { ProductFilterInput } from "@/features/products/types/product";
import { InventoryMovementFilterInput } from "@/features/movements/types/movement";

export class ReportService {
  public async exportProductsExcel(filter?: ProductFilterInput): Promise<Blob> {
    const response = await apiClient.post("reports/products/excel", {
      json: filter || {},
    });
    return await response.blob();
  }

  public async exportProductsPdf(filter?: ProductFilterInput): Promise<Blob> {
    const response = await apiClient.post("reports/products/pdf", {
      json: filter || {},
    });
    return await response.blob();
  }

  public async exportMovementsExcel(
    filter?: InventoryMovementFilterInput
  ): Promise<Blob> {
    const response = await apiClient.post("reports/movements/excel", {
      json: filter || {},
    });
    return await response.blob();
  }

  public async exportMovementsPdf(
    filter?: InventoryMovementFilterInput
  ): Promise<Blob> {
    const response = await apiClient.post("reports/movements/pdf", {
      json: filter || {},
    });
    return await response.blob();
  }

  public downloadBlob(blob: Blob, filename: string): void {
    if (typeof window === "undefined") {
      return;
    }
    const url: string = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.setAttribute("download", filename);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }
}

export const reportService = new ReportService();
