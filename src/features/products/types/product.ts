export interface ProductOutput {
  id: string;
  categoryId: string | null;
  categoryName: string | null;
  sku: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  minStock: number;
  isLowStock: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateProductInput {
  categoryId?: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  minStock: number;
}

export interface UpdateProductInput extends CreateProductInput {
  id: string;
}

export interface ProductFilterInput {
  name?: string;
  sku?: string;
  categoryId?: string;
  lowStockOnly?: boolean;
}

export class ProductModel {
  public readonly id: string;
  public readonly categoryId: string | null;
  public readonly categoryName: string | null;
  public readonly sku: string;
  public readonly name: string;
  public readonly description: string | null;
  public readonly price: number;
  public readonly stock: number;
  public readonly minStock: number;
  public readonly isLowStock: boolean;
  public readonly createdAt: string;
  public readonly updatedAt: string | null;

  constructor(data: ProductOutput) {
    this.id = data.id;
    this.categoryId = data.categoryId;
    this.categoryName = data.categoryName;
    this.sku = data.sku;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.stock = data.stock;
    this.minStock = data.minStock;
    this.isLowStock = data.isLowStock;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  public isOutOfStock(): boolean {
    return this.stock <= 0;
  }

  public isCriticalAlert(): boolean {
    return this.stock <= this.minStock;
  }

  public getStockDeficit(): number {
    if (this.stock < this.minStock) {
      return this.minStock - this.stock;
    }
    return 0;
  }

  public getFormattedPrice(): string {
    return `S/ ${this.price.toFixed(2)}`;
  }

  public getStockBadgeInfo(): { label: string; isAlert: boolean } {
    if (this.stock <= 0) {
      return { label: "Agotado (0)", isAlert: true };
    }
    if (this.stock <= this.minStock) {
      return { label: `Stock bajo (${this.stock}/${this.minStock})`, isAlert: true };
    }
    return { label: `Stock óptimo (${this.stock})`, isAlert: false };
  }
}
