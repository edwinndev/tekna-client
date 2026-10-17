import { InventoryMovementOutput } from "@/features/movements/types/movement";
import { ProductOutput } from "@/features/products/types/product";

export interface DashboardMetrics {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalCategories: number;
  totalSuppliers: number;
  totalMovements: number;
  totalInventoryUnits: number;
  inventoryValuation: number;
}

export class DashboardOverviewModel {
  public readonly metrics: DashboardMetrics;
  public readonly recentMovements: InventoryMovementOutput[];
  public readonly criticalProducts: ProductOutput[];

  constructor(
    products: ProductOutput[],
    totalProductsCount: number,
    totalCategoriesCount: number,
    totalSuppliersCount: number,
    movements: InventoryMovementOutput[],
    totalMovementsCount: number
  ) {
    let lowStock: number = 0;
    let outOfStock: number = 0;
    let totalUnits: number = 0;
    let valuation: number = 0;
    const criticalList: ProductOutput[] = [];

    for (const product of products) {
      totalUnits += product.stock;
      valuation += product.price * product.stock;

      if (product.stock <= 0) {
        outOfStock++;
        criticalList.push(product);
      } else if (product.isLowStock) {
        lowStock++;
        criticalList.push(product);
      }
    }

    this.metrics = {
      totalProducts: totalProductsCount,
      lowStockCount: lowStock,
      outOfStockCount: outOfStock,
      totalCategories: totalCategoriesCount,
      totalSuppliers: totalSuppliersCount,
      totalMovements: totalMovementsCount,
      totalInventoryUnits: totalUnits,
      inventoryValuation: valuation,
    };

    this.recentMovements = movements.slice(0, 6);
    this.criticalProducts = criticalList.slice(0, 5);
  }

  public getFormattedValuation(): string {
    return `S/ ${this.metrics.inventoryValuation.toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  public getSystemHealthStatus(): { label: string; isHealthy: boolean } {
    if (this.metrics.outOfStockCount > 0 || this.metrics.lowStockCount > 3) {
      return { label: "Atención requerida", isHealthy: false };
    }
    return { label: "Inventario estable", isHealthy: true };
  }
}
