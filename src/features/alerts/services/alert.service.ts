import { productService } from "@/features/products/services/product.service";
import { ProductOutput } from "@/features/products/types/product";
import { AlertSummaryStats, StockAlertModel } from "../types/alert";

export class AlertService {
  public async getStockAlerts(): Promise<StockAlertModel[]> {
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
