"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowRight,
  ArrowUpCircle,
  CheckCircle2,
  DollarSign,
  FolderTree,
  Package,
  Plus,
  RefreshCw,
  TrendingDown,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDashboard } from "../hooks/use-dashboard";
import { MovementCreateDialog } from "@/features/movements/ui/movement-create-dialog";
import { ProductOutput } from "@/features/products/types/product";
import { CreateInventoryMovementInput } from "@/features/movements/types/movement";
import { movementService } from "@/features/movements/services/movement.service";
import { useProducts } from "@/features/products/hooks/use-products";
import { useSuppliers } from "@/features/suppliers/hooks/use-suppliers";

export function DashboardView() {
  const { overview, loading, errorMessage, fetchOverview } = useDashboard();
  const { products, fetchProducts } = useProducts();
  const { suppliers, fetchSuppliers } = useSuppliers();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [dialogLoading, setDialogLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchOverview();
    fetchProducts(undefined, 0, 100);
    fetchSuppliers(undefined, 0, 100);
  }, [fetchOverview, fetchProducts, fetchSuppliers]);

  const handleOpenRestock = (productId: string) => {
    setSelectedProductId(productId);
    setDialogOpen(true);
  };

  const handleMovementSubmit = async (data: CreateInventoryMovementInput): Promise<boolean> => {
    setDialogLoading(true);
    try {
      await movementService.registerMovement(data);
      await fetchOverview();
      await fetchProducts(undefined, 0, 100);
      return true;
    } catch {
      return false;
    } finally {
      setDialogLoading(false);
    }
  };

  const metrics = overview ? overview.metrics : null;
  const health = overview ? overview.getSystemHealthStatus() : { label: "Cargando...", isHealthy: true };

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Panel de control</h1>
          <p className="text-muted-foreground text-sm">
            Control centralizado de inventario, movimientos y umbrales de stock en Tekna Gamer
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchOverview()}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSelectedProductId("");
              setDialogOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Registrar movimiento
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Catálogo de productos</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">
              {metrics ? metrics.totalProducts : "-"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {metrics ? `${metrics.totalInventoryUnits} unidades en stock` : ""}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <Package className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between border-amber-500/20 bg-amber-500/5">
          <div>
            <p className="text-xs text-amber-600 font-medium dark:text-amber-400">Alertas de stock bajo</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1 dark:text-amber-400">
              {metrics ? metrics.lowStockCount + metrics.outOfStockCount : "-"}
            </h3>
            <p className="text-xs text-amber-600/80 mt-0.5 dark:text-amber-400/80">
              {metrics ? `${metrics.outOfStockCount} productos agotados` : ""}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Movimientos registrados</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">
              {metrics ? metrics.totalMovements : "-"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Entradas y salidas históricas</p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
            <ArrowDownCircle className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Valorización de inventario</p>
            <h3 className="text-xl font-bold text-foreground mt-1">
              {overview ? overview.getFormattedValuation() : "-"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Precio de venta estimado</p>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500">
            <DollarSign className="h-5 w-5" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Productos que requieren reposición inmediata
                </CardTitle>
                <CardDescription>
                  Periféricos con stock en nivel mínimo o agotados
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/alerts" />}
                className="gap-1 text-xs"
              >
                Ver todas las alertas
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Comprobando inventario...
                </div>
              ) : !overview || overview.criticalProducts.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Todos los productos tienen niveles óptimos de inventario
                </div>
              ) : (
                <div className="space-y-3">
                  {overview.criticalProducts.map((p: ProductOutput) => {
                    const isOutOfStock: boolean = p.stock <= 0;
                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-muted/20"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground font-semibold">
                              {p.sku}
                            </span>
                            <span className="font-medium text-sm text-foreground">
                              {p.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Categoría: {p.categoryName ? p.categoryName : "General"}</span>
                            <span>&bull;</span>
                            <span className="font-semibold text-foreground">
                              Stock: {p.stock} / Mínimo: {p.minStock}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {isOutOfStock ? (
                            <Badge variant="destructive" className="text-xs">
                              Agotado
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-amber-500/40 text-amber-600 bg-amber-500/10 text-xs dark:text-amber-400"
                            >
                              Stock bajo
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleOpenRestock(p.id)}
                            className="gap-1 text-xs"
                          >
                            <ArrowDownCircle className="h-3.5 w-3.5 text-emerald-500" />
                            Reabastecer
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <ArrowDownCircle className="h-4 w-4 text-emerald-500" />
                  Últimos movimientos de almacén
                </CardTitle>
                <CardDescription>
                  Registro en tiempo real de entradas por compra y salidas por venta
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/movements" />}
                className="gap-1 text-xs"
              >
                Ver historial completo
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-center">Cantidad</TableHead>
                      <TableHead>Comprobante</TableHead>
                      <TableHead className="text-right">Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-20 text-center text-xs">
                          Cargando movimientos...
                        </TableCell>
                      </TableRow>
                    ) : !overview || overview.recentMovements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-20 text-center text-xs text-muted-foreground">
                          No hay movimientos recientes
                        </TableCell>
                      </TableRow>
                    ) : (
                      overview.recentMovements.map((mov) => {
                        const isEntry: boolean = mov.movementType === "ENTRY";
                        const formattedDate: string = new Date(mov.createdAt).toLocaleDateString("es-PE", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        });

                        return (
                          <TableRow key={mov.id}>
                            <TableCell>
                              {isEntry ? (
                                <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 bg-emerald-500/10 text-xs gap-1 dark:text-emerald-400">
                                  <ArrowDownCircle className="h-3 w-3" />
                                  Entrada
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-rose-500/40 text-rose-600 bg-rose-500/10 text-xs gap-1 dark:text-rose-400">
                                  <ArrowUpCircle className="h-3 w-3" />
                                  Salida
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-xs">{mov.productName}</div>
                              <div className="font-mono text-[10px] text-muted-foreground">{mov.productSku}</div>
                            </TableCell>
                            <TableCell className="text-center font-semibold text-xs">
                              <span className={isEntry ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                                {isEntry ? `+${mov.quantity}` : `-${mov.quantity}`}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {mov.documentNumber ? mov.documentNumber : "-"}
                            </TableCell>
                            <TableCell className="text-right text-xs text-muted-foreground">
                              {formattedDate}
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
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estado general del sistema</CardTitle>
              <CardDescription>
                Diagnóstico de inventario y parámetros de control
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-2.5">
                  {health.isHealthy ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  )}
                  <div>
                    <p className="text-sm font-semibold">{health.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {health.isHealthy
                        ? "Umbrales dentro del rango seguro"
                        : "Existen productos por debajo del mínimo"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <FolderTree className="h-3.5 w-3.5 text-primary" />
                    Categorías configuradas
                  </span>
                  <span className="font-bold text-foreground">
                    {metrics ? metrics.totalCategories : 0}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-primary" />
                    Proveedores registrados
                  </span>
                  <span className="font-bold text-foreground">
                    {metrics ? metrics.totalSuppliers : 0}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <TrendingDown className="h-3.5 w-3.5 text-amber-500" />
                    Productos con bajo stock
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {metrics ? metrics.lowStockCount : 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Accesos directos</CardTitle>
              <CardDescription>Operaciones frecuentes de Tekna Gamer</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button
                variant="outline"
                className="justify-start gap-2 h-auto py-2.5"
                nativeButton={false}
                render={<Link href="/products" />}
              >
                <Package className="h-4 w-4 text-primary" />
                <div className="text-left">
                  <div className="text-xs font-semibold">Gestionar productos</div>
                  <div className="text-[11px] text-muted-foreground">Editar catálogo, precios y mínimos</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start gap-2 h-auto py-2.5"
                nativeButton={false}
                render={<Link href="/alerts" />}
              >
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <div className="text-left">
                  <div className="text-xs font-semibold">Monitor de alertas</div>
                  <div className="text-[11px] text-muted-foreground">Consultar déficit y reabastecimiento</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start gap-2 h-auto py-2.5"
                nativeButton={false}
                render={<Link href="/movements" />}
              >
                <ArrowDownCircle className="h-4 w-4 text-emerald-500" />
                <div className="text-left">
                  <div className="text-xs font-semibold">Historial de movimientos</div>
                  <div className="text-[11px] text-muted-foreground">Auditoría detallada de transacciones</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <MovementCreateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        products={products}
        suppliers={suppliers}
        initialProductId={selectedProductId}
        onSubmit={handleMovementSubmit}
        loading={dialogLoading}
      />
    </div>
  );
}
