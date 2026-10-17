import { categoryService } from "@/features/categories/services/category.service";
import { movementService } from "@/features/movements/services/movement.service";
import { productService } from "@/features/products/services/product.service";
import { supplierService } from "@/features/suppliers/services/supplier.service";
import { DashboardOverviewModel } from "../types/dashboard";

export class DashboardService {
  public async getOverview(): Promise<DashboardOverviewModel> {
    const [productsRes, movementsRes, categoriesRes, suppliersRes] = await Promise.all([
      productService.search({
        pageNumber: 0,
        pageSize: 100,
        sortBy: "stock",
        sortDirection: "ASC",
      }),
      movementService.search({
        pageNumber: 0,
        pageSize: 10,
        sortBy: "createdAt",
        sortDirection: "DESC",
      }),
      categoryService.search({
        pageNumber: 0,
        pageSize: 1,
      }),
      supplierService.search({
        pageNumber: 0,
        pageSize: 1,
      }),
    ]);

    return new DashboardOverviewModel(
      productsRes.items,
      productsRes.total,
      categoriesRes.total,
      suppliersRes.total,
      movementsRes.items,
      movementsRes.total
    );
  }
}

export const dashboardService = new DashboardService();
