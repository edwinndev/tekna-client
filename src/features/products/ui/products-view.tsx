"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Edit2,
  FileSpreadsheet,
  FileText,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { reportService } from "@/core/services/report.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts } from "../hooks/use-products";
import { CreateProductInput, ProductModel, ProductOutput } from "../types/product";
import { ProductFormDialog } from "./product-form-dialog";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { CategoryOutput } from "@/features/categories/types/category";

export function ProductsView() {
  const {
    products,
    loading,
    total,
    errorMessage,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const { categories, fetchCategories } = useCategories();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [lowStockFilter, setLowStockFilter] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductOutput | null>(null);
  const [isExporting, setIsExporting] = useState<"EXCEL" | "PDF" | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories(undefined, 0, 100);
  }, [fetchProducts, fetchCategories]);

  const categoryItems: Record<string, string> = {
    ALL: "Todas las categorías",
    ...Object.fromEntries(categories.map((c: CategoryOutput) => [c.id, c.name])),
  };

  const executeFilter = (nameTerm: string, categoryId: string, isLowStockOnly: boolean) => {
    fetchProducts({
      name: nameTerm.trim() || undefined,
      categoryId: categoryId === "ALL" ? undefined : categoryId,
      lowStockOnly: isLowStockOnly ? true : undefined,
    });
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    executeFilter(searchTerm, selectedCategory, lowStockFilter);
  };

  const handleCategorySelect = (value: string | null) => {
    const selected: string = value ? value : "ALL";
    setSelectedCategory(selected);
    executeFilter(searchTerm, selected, lowStockFilter);
  };

  const handleToggleLowStock = () => {
    const nextState: boolean = !lowStockFilter;
    setLowStockFilter(nextState);
    executeFilter(searchTerm, selectedCategory, nextState);
  };

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (product: ProductOutput) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed: boolean = window.confirm(
      `¿Está seguro de que desea eliminar el producto "${name}"?`
    );
    if (confirmed) {
      await deleteProduct(id);
    }
  };

  const handleFormSubmit = async (data: CreateProductInput): Promise<void> => {
    if (selectedProduct) {
      await updateProduct({
        ...data,
        id: selectedProduct.id,
      });
    } else {
      await createProduct(data);
    }
  };

  const handleExportExcel = async (): Promise<void> => {
    setIsExporting("EXCEL");
    try {
      const blob: Blob = await reportService.exportProductsExcel({
        categoryId: selectedCategory === "ALL" ? undefined : selectedCategory,
        lowStockOnly: lowStockFilter ? true : undefined,
      });
      reportService.downloadBlob(blob, "tekna_products_inventory.xlsx");
    } catch (error) {
      console.error("Error al exportar inventario de productos a Excel:", error);
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportPdf = async (): Promise<void> => {
    setIsExporting("PDF");
    try {
      const blob: Blob = await reportService.exportProductsPdf({
        categoryId: selectedCategory === "ALL" ? undefined : selectedCategory,
        lowStockOnly: lowStockFilter ? true : undefined,
      });
      reportService.downloadBlob(blob, "tekna_products_inventory.pdf");
    } catch (error) {
      console.error("Error al exportar inventario de productos a PDF:", error);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catálogo de productos</h1>
          <p className="text-muted-foreground text-sm">
            Control de inventario, niveles de stock mínimo y especificaciones comerciales
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            disabled={products.length === 0 || isExporting !== null}
            className="gap-1.5"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
            <span className="hidden sm:inline">Exportar</span> Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPdf}
            disabled={products.length === 0 || isExporting !== null}
            className="gap-1.5"
          >
            <FileText className="h-4 w-4 text-rose-500" />
            <span className="hidden sm:inline">Exportar</span> PDF
          </Button>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo producto
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
          {errorMessage}
        </div>
      )}

      <Card className="w-full min-w-0 overflow-hidden">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <Input
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full sm:w-64"
                />
                <Button type="submit" variant="secondary" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              <div className="w-56">
                <Select
                  value={selectedCategory}
                  onValueChange={handleCategorySelect}
                  items={categoryItems}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas las categorías">
                      {(val: string | null) =>
                        val && categoryItems[val]
                          ? categoryItems[val]
                          : "Todas las categorías"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todas las categorías</SelectItem>
                    {categories.map((category: CategoryOutput) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant={lowStockFilter ? "destructive" : "outline"}
                size="sm"
                className="gap-1.5"
                onClick={handleToggleLowStock}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                {lowStockFilter ? "Ver todos" : "Solo stock bajo"}
              </Button>
            </div>

            <CardDescription className="text-sm">
              Mostrando {products.length} de {total} productos
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="overflow-hidden">
          <div className="rounded-md border overflow-hidden">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Precio unitario</TableHead>
                  <TableHead className="text-center">Stock / Mínimo</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Cargando inventario de productos...
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No se encontraron productos registrados con los criterios seleccionados
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((productData: ProductOutput) => {
                    const model = new ProductModel(productData);

                    return (
                      <TableRow key={model.id}>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {model.sku}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-foreground">{model.name}</div>
                          {model.description && (
                            <div className="text-xs text-muted-foreground max-w-sm truncate">
                              {model.description}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {model.categoryName ? model.categoryName : "Sin categoría"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {model.getFormattedPrice()}
                        </TableCell>
                        <TableCell className="text-center font-mono">
                          <span className="font-bold text-foreground">{model.stock}</span>
                          <span className="text-muted-foreground text-xs"> / {model.minStock}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          {model.isOutOfStock() ? (
                            <Badge variant="destructive" className="gap-1">
                              Agotado
                            </Badge>
                          ) : model.isCriticalAlert() ? (
                            <Badge
                              variant="outline"
                              className="border-amber-500/40 text-amber-600 bg-amber-500/10 gap-1 dark:text-amber-400"
                            >
                              <AlertTriangle className="h-3 w-3" />
                              Bajo stock
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-emerald-500/40 text-emerald-600 bg-emerald-500/10 dark:text-emerald-400"
                            >
                              Óptimo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEdit(productData)}
                              title="Editar producto"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(model.id, model.name)}
                              title="Eliminar producto"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        categories={categories}
        onSubmit={handleFormSubmit}
        loading={loading}
      />
    </div>
  );
}
