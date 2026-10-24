"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownCircle,
  CheckCircle2,
  PackageX,
  RefreshCw,
  SearchCheck,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAlerts } from "../hooks/use-alerts";
import { AlertSeverity, StockAlertModel } from "../types/alert";
import { MovementCreateDialog } from "@/features/movements/ui/movement-create-dialog";
import { CreateInventoryMovementInput } from "@/features/movements/types/movement";
import { movementService } from "@/features/movements/services/movement.service";
import { alertService } from "../services/alert.service";
import { useProducts } from "@/features/products/hooks/use-products";
import { useSuppliers } from "@/features/suppliers/hooks/use-suppliers";

export function AlertsView() {
  const { alerts, loading, stats, errorMessage, fetchAlerts } = useAlerts();
  const { products, fetchProducts } = useProducts();
  const { suppliers, fetchSuppliers } = useSuppliers();

  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | "ALL">("ALL");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [dialogLoading, setDialogLoading] = useState<boolean>(false);
  const [attendedProductIds, setAttendedProductIds] = useState<string[]>([]);
  const [isCheckingStock, setIsCheckingStock] = useState<boolean>(false);

  useEffect(() => {
    fetchAlerts();
    fetchProducts(undefined, 0, 100);
    fetchSuppliers(undefined, 0, 100);
  }, [fetchAlerts, fetchProducts, fetchSuppliers]);

  const handleOpenRestock = (productId: string) => {
    setSelectedProductId(productId);
    setDialogOpen(true);
  };

  const handleToggleAttended = async (alert: StockAlertModel): Promise<void> => {
    try {
      await alertService.markAsAttended(alert.id);
      await fetchAlerts();
    } catch (error) {
      console.error("Error al marcar alerta como atendida en backend:", error);
      setAttendedProductIds((prev) =>
        prev.includes(alert.productId)
          ? prev.filter((id) => id !== alert.productId)
          : [...prev, alert.productId]
      );
    }
  };

  const handleCheckStock = async (): Promise<void> => {
    setIsCheckingStock(true);
    try {
      await alertService.checkStock();
      await fetchAlerts();
    } catch (error) {
      console.error("Error al ejecutar comprobación de inventario:", error);
    } finally {
      setIsCheckingStock(false);
    }
  };

  const handleRestockSubmit = async (data: CreateInventoryMovementInput): Promise<boolean> => {
    setDialogLoading(true);
    try {
      await movementService.registerMovement(data);
      await fetchAlerts();
      await fetchProducts(undefined, 0, 100);
      return true;
    } catch {
      return false;
    } finally {
      setDialogLoading(false);
    }
  };

  const filteredAlerts: StockAlertModel[] = alerts.filter((alert: StockAlertModel) => {
    if (filterSeverity === "ALL") return true;
    return alert.severity === filterSeverity;
  });

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alertas de stock mínimo</h1>
          <p className="text-muted-foreground text-sm">
            Monitoreo preventivo y reposición oportuna de periféricos con bajo inventario
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCheckStock}
            disabled={isCheckingStock || loading}
            className="gap-2"
          >
            <SearchCheck className={`h-4 w-4 text-primary ${isCheckingStock ? "animate-pulse" : ""}`} />
            {isCheckingStock ? "Comprobando..." : "Verificar stock"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAlerts()}
            disabled={loading || isCheckingStock}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between border-border">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total de alertas</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">{stats.totalAlerts}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Productos afectados</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between border-border">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Sin stock (Agotados)</p>
            <h3 className="text-2xl font-bold text-destructive mt-1">{stats.outOfStockCount}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Requieren compra urgente</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <PackageX className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between border-border">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Nivel crítico (&le; 50%)</p>
            <h3 className="text-2xl font-bold text-amber-500 mt-1">{stats.criticalCount}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Por debajo de la mitad del mínimo</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <AlertCircle className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between border-border">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Déficit total</p>
            <h3 className="text-2xl font-bold text-emerald-500 mt-1">+{stats.totalDeficitUnits}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Unidades faltantes respecto al mínimo</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <TrendingDown className="h-5 w-5" />
          </div>
        </Card>
      </div>

      <Card className="w-full min-w-0 overflow-hidden">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={filterSeverity === "ALL" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterSeverity("ALL")}
              >
                Todas las alertas ({alerts.length})
              </Button>
              <Button
                variant={filterSeverity === "OUT_OF_STOCK" ? "destructive" : "outline"}
                size="sm"
                className="gap-1.5"
                onClick={() => setFilterSeverity("OUT_OF_STOCK")}
              >
                <PackageX className="h-3.5 w-3.5" />
                Agotados ({stats.outOfStockCount})
              </Button>
              <Button
                variant={filterSeverity === "CRITICAL" ? "default" : "outline"}
                size="sm"
                className="gap-1.5"
                onClick={() => setFilterSeverity("CRITICAL")}
              >
                <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                Nivel crítico ({stats.criticalCount})
              </Button>
              <Button
                variant={filterSeverity === "WARNING" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterSeverity("WARNING")}
              >
                Stock bajo ({alerts.length - stats.outOfStockCount - stats.criticalCount})
              </Button>
            </div>

            <CardDescription className="text-sm">
              Umbrales mínimos configurados por producto
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Comprobando niveles de inventario...
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-3">
                <ArrowDownCircle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                No hay alertas activas en este criterio
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                El inventario de Tekna Gamer se encuentra por encima de los niveles mínimos establecidos
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map((alert: StockAlertModel) => {
                const badgeInfo = alert.getSeverityBadgeInfo();
                const stockPercentage = alert.getStockRatioPercentage();
                const isAttended = attendedProductIds.includes(alert.productId);

                return (
                  <div
                    key={alert.productId}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-card gap-4 transition-colors hover:bg-muted/30"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {alert.productSku}
                        </Badge>
                        <span className="font-semibold text-foreground">
                          {alert.productName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          &bull; {alert.categoryName}
                        </span>
                        <Badge
                          variant={badgeInfo.variant}
                          className={`text-xs gap-1 ${badgeInfo.colorClass}`}
                        >
                          <AlertTriangle className="h-3 w-3" />
                          {badgeInfo.label}
                        </Badge>
                        {isAttended && (
                          <Badge variant="outline" className="text-xs gap-1 border-emerald-500 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            Atendida
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {alert.getDeficitMessage()}
                      </p>

                      <div className="flex items-center gap-3 pt-1">
                        <div className="w-48 bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              alert.isOutOfStock()
                                ? "bg-destructive"
                                : stockPercentage <= 50
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${stockPercentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">
                          {alert.currentStock} / {alert.minStock} unids. ({stockPercentage}%)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-center">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-muted-foreground">Sugerencia de compra</p>
                        <p className="text-sm font-bold text-foreground">
                          +{alert.recommendedOrderQuantity} unids.
                        </p>
                      </div>
                      <Button
                        variant={isAttended ? "outline" : "secondary"}
                        size="sm"
                        onClick={() => handleToggleAttended(alert)}
                        className="gap-1.5"
                      >
                        <CheckCircle2 className={`h-4 w-4 ${isAttended ? "text-emerald-500" : ""}`} />
                        {isAttended ? "Reabrir alerta" : "Marcar atendida"}
                      </Button>
                      <Button
                        onClick={() => handleOpenRestock(alert.productId)}
                        className="gap-1.5"
                        size="sm"
                      >
                        <ArrowDownCircle className="h-4 w-4" />
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

      <MovementCreateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        products={products}
        suppliers={suppliers}
        initialProductId={selectedProductId}
        initialType="ENTRY"
        onSubmit={handleRestockSubmit}
        loading={dialogLoading}
      />
    </div>
  );
}
