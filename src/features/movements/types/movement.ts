export type MovementType = "ENTRY" | "EXIT";

export interface InventoryMovementOutput {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  supplierId: string | null;
  supplierName: string | null;
  movementType: MovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  unitPrice: number | null;
  documentNumber: string | null;
  reason: string | null;
  createdAt: string;
}

export interface CreateInventoryMovementInput {
  productId: string;
  supplierId?: string;
  movementType: MovementType;
  quantity: number;
  unitPrice?: number;
  documentNumber?: string;
  reason?: string;
}

export interface InventoryMovementFilterInput {
  productId?: string;
  supplierId?: string;
  movementType?: MovementType;
  documentNumber?: string;
}

export class InventoryMovementModel {
  public readonly id: string;
  public readonly productId: string;
  public readonly productName: string;
  public readonly productSku: string;
  public readonly supplierId: string | null;
  public readonly supplierName: string | null;
  public readonly movementType: MovementType;
  public readonly quantity: number;
  public readonly previousStock: number;
  public readonly newStock: number;
  public readonly unitPrice: number | null;
  public readonly documentNumber: string | null;
  public readonly reason: string | null;
  public readonly createdAt: string;

  constructor(data: InventoryMovementOutput) {
    this.id = data.id;
    this.productId = data.productId;
    this.productName = data.productName;
    this.productSku = data.productSku;
    this.supplierId = data.supplierId;
    this.supplierName = data.supplierName;
    this.movementType = data.movementType;
    this.quantity = data.quantity;
    this.previousStock = data.previousStock;
    this.newStock = data.newStock;
    this.unitPrice = data.unitPrice;
    this.documentNumber = data.documentNumber;
    this.reason = data.reason;
    this.createdAt = data.createdAt;
  }

  public isEntry(): boolean {
    return this.movementType === "ENTRY";
  }

  public isExit(): boolean {
    return this.movementType === "EXIT";
  }

  public getTypeBadgeInfo(): { label: string; isEntry: boolean } {
    if (this.isEntry()) {
      return { label: "Entrada (Ingreso)", isEntry: true };
    }
    return { label: "Salida (Egreso)", isEntry: false };
  }

  public getStockTransitionText(): string {
    return `${this.previousStock} -> ${this.newStock}`;
  }
}
