import { apiClient } from "@/core/lib/api-client";
import { PageOutput, SearchInput } from "@/core/types/pagination";
import { productService } from "@/features/products/services/product.service";
import { ProductOutput } from "@/features/products/types/product";
import {
  AlertFilterInput,
  AlertOutput,
  AlertSummaryStats,
  StockAlertModel,
} from "../types/alert";

export class AlertService {
  public async search(
    input: SearchInput<AlertFilterInput>
  ): Promise<PageOutput<AlertOutput>> {
    return await apiClient
      .post("alerts/filter", { json: input })
      .json<PageOutput<AlertOutput>>();
  }

  public async markAsAttended(id: string): Promise<AlertOutput> {
    return await apiClient
      .put(`alerts/${id}/attend`)
      .json<AlertOutput>();
  }

  public async checkStock(): Promise<{ message: string; generatedAlerts: number }> {
    return await apiClient
      .post("alerts/check")
      .json<{ message: string; generatedAlerts: number }>();
  }

  public async getStockAlerts(): Promise<StockAlertModel[]> {
    try {
      const backendAlerts = await this.search({
        pageNumber: 0,
        pageSize: 100,
        sortBy: "createdAt",
        sortDirection: "DESC",
        filter: {},
      });

      if (backendAlerts && backendAlerts.items.length > 0) {
        const productsResponse = await productService.search({
          pageNumber: 0,
          pageSize: 100,
          filter: {},
        });
        const productMap = new Map<string, ProductOutput>(
          productsResponse.items.map((p: ProductOutput) => [p.id, p])
        );

        return backendAlerts.items.map((alert: AlertOutput): StockAlertModel => {
          const product: ProductOutput = productMap.get(alert.productId) || {
            id: alert.productId,
            name: alert.productName,
            sku: alert.productSku,
            stock: alert.stockRecorded,
            minStock: alert.minStockSnapshot,
            price: 0,
            categoryId: null,
            categoryName: null,
            description: null,
            isLowStock: true,
            createdAt: alert.createdAt,
            updatedAt: alert.updatedAt,
          };
          return new StockAlertModel(product, alert);
        });
      }
    } catch {
      // Fallback to client-side real-time low-stock computation
    }

    const response = await productService.search({
      pageNumber: 0,
      pageSize: 100,
      sortBy: "stock",
      sortDirection: "ASC",
      filter: {
        lowStockOnly: true,
      },
    });

    return response.items.map(
      (product: ProductOutput) => new StockAlertModel(product)
    );
  }

  public calculateStats(alerts: StockAlertModel[]): AlertSummaryStats {
    let outOfStockCount: number = 0;
    let criticalCount: number = 0;
    let totalDeficitUnits: number = 0;

    for (const alert of alerts) {
      if (alert.severity === "OUT_OF_STOCK") {
        outOfStockCount++;
      } else if (alert.severity === "CRITICAL") {
        criticalCount++;
      }
      totalDeficitUnits += alert.deficit;
    }

    return {
      totalAlerts: alerts.length,
      outOfStockCount,
      criticalCount,
      totalDeficitUnits,
    };
  }
}

export const alertService = new AlertService();
