import { ProductOutput } from "@/features/products/types/product";

export type AlertSeverity = "OUT_OF_STOCK" | "CRITICAL" | "WARNING";

export interface AlertSummaryStats {
  totalAlerts: number;
  outOfStockCount: number;
  criticalCount: number;
  totalDeficitUnits: number;
}

export class StockAlertModel {
  public readonly productId: string;
  public readonly productName: string;
  public readonly productSku: string;
  public readonly categoryName: string;
  public readonly currentStock: number;
  public readonly minStock: number;
  public readonly price: number;
  public readonly severity: AlertSeverity;
  public readonly deficit: number;
  public readonly recommendedOrderQuantity: number;

  constructor(product: ProductOutput) {
    this.productId = product.id;
    this.productName = product.name;
    this.productSku = product.sku;
    this.categoryName = product.categoryName ? product.categoryName : "Sin categoría";
    this.currentStock = product.stock;
    this.minStock = product.minStock;
    this.price = product.price;

    if (this.currentStock <= 0) {
      this.severity = "OUT_OF_STOCK";
      this.deficit = this.minStock;
    } else if (this.currentStock <= Math.floor(this.minStock / 2)) {
      this.severity = "CRITICAL";
      this.deficit = this.minStock - this.currentStock;
    } else {
      this.severity = "WARNING";
      this.deficit = this.minStock - this.currentStock;
    }

    const calculatedOrder: number = this.minStock * 2 - this.currentStock;
    this.recommendedOrderQuantity = calculatedOrder > 0 ? calculatedOrder : this.minStock;
  }

  public isOutOfStock(): boolean {
    return this.currentStock <= 0;
  }

  public getStockRatioPercentage(): number {
    if (this.minStock <= 0) return 100;
    const ratio: number = Math.round((this.currentStock / this.minStock) * 100);
    return Math.min(Math.max(ratio, 0), 100);
  }

  public getSeverityBadgeInfo(): { label: string; variant: "destructive" | "outline"; colorClass: string } {
    switch (this.severity) {
      case "OUT_OF_STOCK":
        return {
          label: "Agotado urgente",
          variant: "destructive",
          colorClass: "bg-destructive text-destructive-foreground",
        };
      case "CRITICAL":
        return {
          label: "Nivel crítico",
          variant: "destructive",
          colorClass: "border-rose-500/40 text-rose-600 bg-rose-500/10 dark:text-rose-400",
        };
      case "WARNING":
      default:
        return {
          label: "Stock bajo",
          variant: "outline",
          colorClass: "border-amber-500/40 text-amber-600 bg-amber-500/10 dark:text-amber-400",
        };
    }
  }

  public getDeficitMessage(): string {
    if (this.currentStock <= 0) {
      return `Sin inventario disponible. Faltan ${this.minStock} unidades para el umbral mínimo.`;
    }
    return `Quedan ${this.currentStock} unidades. Faltan ${this.deficit} unidades para nivel óptimo.`;
  }
}
