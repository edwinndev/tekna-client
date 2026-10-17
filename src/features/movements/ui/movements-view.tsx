"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  Plus,
  Search,
  FileText,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
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
import { useMovements } from "../hooks/use-movements";
import { CreateInventoryMovementInput, InventoryMovementOutput, MovementType } from "../types/movement";
import { MovementCreateDialog } from "./movement-create-dialog";
import { useProducts } from "@/features/products/hooks/use-products";
import { useSuppliers } from "@/features/suppliers/hooks/use-suppliers";

export function MovementsView() {
  const {
    movements,
    loading,
    total,
    errorMessage,
    fetchMovements,
    registerMovement,
  } = useMovements();

  const { products, fetchProducts } = useProducts();
  const { suppliers, fetchSuppliers } = useSuppliers();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [activeTypeFilter, setActiveTypeFilter] = useState<MovementType | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchMovements();
    fetchProducts(undefined, 0, 100);
    fetchSuppliers(undefined, 0, 100);
  }, [fetchMovements, fetchProducts, fetchSuppliers]);

  const handleTypeChange = (type: MovementType | "ALL") => {
    setActiveTypeFilter(type);
    if (type === "ALL") {
      fetchMovements({});
    } else {
      fetchMovements({ movementType: type });
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchMovements({
      movementType: activeTypeFilter === "ALL" ? undefined : activeTypeFilter,
      documentNumber: searchTerm.trim() || undefined,
    });
  };

  const handleFormSubmit = async (data: CreateInventoryMovementInput): Promise<boolean> => {
    const success: boolean = await registerMovement(data);
    if (success) {
      fetchProducts(undefined, 0, 100);
    }
    return success;
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Movimientos de inventario</h1>
          <p className="text-muted-foreground text-sm">
            Auditoría histórica de entradas, salidas y fluctuaciones de stock en Tekna Gamer
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Registrar movimiento
        </Button>
      </div>

      {errorMessage && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
          {errorMessage}
        </div>
      )}

      <Card className="w-full min-w-0 overflow-hidden">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={activeTypeFilter === "ALL" ? "default" : "outline"}
                size="sm"
                onClick={() => handleTypeChange("ALL")}
              >
                Todos ({total})
              </Button>
              <Button
                variant={activeTypeFilter === "ENTRY" ? "default" : "outline"}
                size="sm"
                className="gap-1.5"
                onClick={() => handleTypeChange("ENTRY")}
              >
                <ArrowDownCircle className="h-3.5 w-3.5 text-emerald-500" />
                Solo entradas
              </Button>
              <Button
                variant={activeTypeFilter === "EXIT" ? "destructive" : "outline"}
                size="sm"
                className="gap-1.5"
                onClick={() => handleTypeChange("EXIT")}
              >
                <ArrowUpCircle className="h-3.5 w-3.5" />
                Solo salidas
              </Button>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Buscar por comprobante..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full md:w-56"
              />
              <Button type="submit" variant="secondary" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent className="overflow-hidden">
          <div className="rounded-md border overflow-hidden">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[160px]">Fecha</TableHead>
                  <TableHead className="w-[110px]">Tipo</TableHead>
                  <TableHead className="min-w-[200px]">Producto</TableHead>
                  <TableHead className="w-[100px] text-center">Cantidad</TableHead>
                  <TableHead className="w-[150px]">Stock (ant. &rarr; nuevo)</TableHead>
                  <TableHead className="min-w-[180px]">Proveedor / Comprobante</TableHead>
                  <TableHead className="min-w-[180px]">Motivo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Cargando historial de movimientos...
                    </TableCell>
                  </TableRow>
                ) : movements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No se encontraron movimientos registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  movements.map((mov: InventoryMovementOutput) => {
                    const isEntry: boolean = mov.movementType === "ENTRY";
                    const formattedDate: string = new Date(mov.createdAt).toLocaleString("es-PE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <TableRow key={mov.id}>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            {formattedDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          {isEntry ? (
                            <Badge variant="outline" className="border-emerald-500/40 text-emerald-500 bg-emerald-500/10 gap-1">
                              <ArrowDownCircle className="h-3 w-3 shrink-0" />
                              Entrada
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-rose-500/40 text-rose-500 bg-rose-500/10 gap-1">
                              <ArrowUpCircle className="h-3 w-3 shrink-0" />
                              Salida
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[220px]">
                          <div className="font-medium text-foreground truncate" title={mov.productName}>
                            {mov.productName}
                          </div>
                          <div className="text-xs font-mono text-muted-foreground">
                            {mov.productSku}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-center">
                          <span className={isEntry ? "text-emerald-500" : "text-rose-500"}>
                            {isEntry ? `+${mov.quantity}` : `-${mov.quantity}`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs font-mono">
                            <span>{mov.previousStock}</span>
                            <ArrowLeftRight className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="font-bold text-foreground">{mov.newStock}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[190px]">
                          <div className="text-sm font-medium truncate" title={mov.supplierName || ""}>
                            {mov.supplierName ? mov.supplierName : "-"}
                          </div>
                          {mov.documentNumber && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono truncate" title={mov.documentNumber}>
                              <FileText className="h-3 w-3 shrink-0" />
                              <span className="truncate">{mov.documentNumber}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm max-w-[220px]">
                          <div className="truncate" title={mov.reason || "Sin observaciones"}>
                            {mov.reason ? mov.reason : "Sin observaciones"}
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

      <MovementCreateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        products={products}
        suppliers={suppliers}
        onSubmit={handleFormSubmit}
        loading={loading}
      />
    </div>
  );
}
