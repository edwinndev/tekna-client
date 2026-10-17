"use client";

import { useState } from "react";
import { AlertCircle, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductOutput } from "@/features/products/types/product";
import { SupplierOutput } from "@/features/suppliers/types/supplier";
import { CreateInventoryMovementInput, MovementType } from "../types/movement";

interface MovementCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: ProductOutput[];
  suppliers: SupplierOutput[];
  initialProductId?: string;
  initialType?: MovementType;
  onSubmit: (data: CreateInventoryMovementInput) => Promise<boolean>;
  loading: boolean;
}

interface InnerFormProps {
  products: ProductOutput[];
  suppliers: SupplierOutput[];
  initialProductId?: string;
  initialType: MovementType;
  onSubmit: (data: CreateInventoryMovementInput) => Promise<boolean>;
  onCancel: () => void;
  loading: boolean;
}

function MovementCreateFormFields({
  products,
  suppliers,
  initialProductId,
  initialType,
  onSubmit,
  onCancel,
  loading,
}: InnerFormProps) {
  const defaultProdId: string =
    initialProductId || (products.length > 0 ? products[0].id : "");

  const [productId, setProductId] = useState<string>(defaultProdId);
  const [supplierId, setSupplierId] = useState<string>("");
  const [movementType, setMovementType] = useState<MovementType>(initialType);
  const [quantity, setQuantity] = useState<string>("1");
  const [unitPrice, setUnitPrice] = useState<string>("");
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const productItems: Record<string, string> = Object.fromEntries(
    products.map((p: ProductOutput) => [p.id, `${p.name} (${p.sku})`])
  );

  const supplierItems: Record<string, string> = Object.fromEntries(
    suppliers.map((s: SupplierOutput) => [s.id, s.name])
  );

  const selectedProduct: ProductOutput | null =
    products.find((p: ProductOutput) => p.id === productId) || null;

  const parsedQty: number = parseInt(quantity, 10) || 0;
  const currentStock: number = selectedProduct ? selectedProduct.stock : 0;
  const minStock: number = selectedProduct ? selectedProduct.minStock : 5;

  let projectedStock: number = currentStock;
  let isInsufficientStock: boolean = false;
  let willTriggerLowStockAlert: boolean = false;

  if (movementType === "ENTRY") {
    projectedStock = currentStock + parsedQty;
  } else {
    projectedStock = currentStock - parsedQty;
    if (parsedQty > currentStock) {
      isInsufficientStock = true;
    } else if (projectedStock <= minStock) {
      willTriggerLowStockAlert = true;
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productId || parsedQty <= 0 || isInsufficientStock) return;

    const parsedPrice: number | undefined = unitPrice ? parseFloat(unitPrice) : undefined;

    const success: boolean = await onSubmit({
      productId,
      supplierId: movementType === "ENTRY" && supplierId ? supplierId : undefined,
      movementType,
      quantity: parsedQty,
      unitPrice: parsedPrice,
      documentNumber: documentNumber.trim() || undefined,
      reason: reason.trim() || undefined,
    });

    if (success) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Registrar movimiento de inventario</DialogTitle>
        <DialogDescription>
          Actualice el stock de productos mediante entradas de reposición o salidas de venta
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="mov-type">Tipo de movimiento</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={movementType === "ENTRY" ? "default" : "outline"}
                className="gap-1.5"
                onClick={() => setMovementType("ENTRY")}
              >
                <ArrowDownCircle className="h-4 w-4" />
                Entrada
              </Button>
              <Button
                type="button"
                variant={movementType === "EXIT" ? "destructive" : "outline"}
                className="gap-1.5"
                onClick={() => setMovementType("EXIT")}
              >
                <ArrowUpCircle className="h-4 w-4" />
                Salida
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="mov-product">Producto</Label>
            <Select
              value={productId}
              onValueChange={(val: string | null) => setProductId(val ? val : "")}
              items={productItems}
              disabled={loading}
            >
              <SelectTrigger id="mov-product" className="w-full">
                <SelectValue placeholder="Seleccione un producto">
                  {(val: string | null) =>
                    val && productItems[val]
                      ? productItems[val]
                      : "Seleccione un producto"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {products.map((p: ProductOutput) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedProduct && (
          <div className="rounded-lg border bg-muted/40 p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-muted-foreground">Stock actual: </span>
                <span className="font-semibold">{currentStock} unids.</span>
              </div>
              <div>
                <span className="text-muted-foreground">Stock mínimo: </span>
                <span className="font-semibold">{minStock} unids.</span>
              </div>
              <div>
                <span className="text-muted-foreground">Nuevo stock proyectado: </span>
                <span
                  className={`font-bold ${
                    isInsufficientStock
                      ? "text-destructive"
                      : willTriggerLowStockAlert
                      ? "text-amber-500"
                      : "text-emerald-500"
                  }`}
                >
                  {projectedStock} unids.
                </span>
              </div>
            </div>

            {isInsufficientStock && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-destructive font-medium">
                <AlertCircle className="h-4 w-4" />
                No hay suficiente stock disponible para realizar esta salida.
              </div>
            )}

            {willTriggerLowStockAlert && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-500 font-medium">
                <AlertCircle className="h-4 w-4" />
                Atención: Este egreso colocará el producto en alerta de stock bajo.
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="mov-qty">Cantidad de unidades</Label>
            <Input
              id="mov-qty"
              type="number"
              min="1"
              value={quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuantity(e.target.value)
              }
              required
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="mov-price">Precio unitario referencial (S/)</Label>
            <Input
              id="mov-price"
              type="number"
              step="0.01"
              min="0"
              value={unitPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUnitPrice(e.target.value)
              }
              placeholder={selectedProduct ? selectedProduct.price.toString() : "0.00"}
              disabled={loading}
            />
          </div>
        </div>

        {movementType === "ENTRY" && (
          <div className="grid gap-2">
            <Label htmlFor="mov-supplier">Proveedor (opcional para entradas)</Label>
            <Select
              value={supplierId}
              onValueChange={(val: string | null) => setSupplierId(val ? val : "")}
              items={supplierItems}
              disabled={loading}
            >
              <SelectTrigger id="mov-supplier" className="w-full">
                <SelectValue placeholder="Seleccione el proveedor o distribuidor">
                  {(val: string | null) =>
                    val && supplierItems[val]
                      ? supplierItems[val]
                      : "Seleccione el proveedor o distribuidor"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((s: SupplierOutput) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="mov-doc">Número de documento / comprobante</Label>
            <Input
              id="mov-doc"
              value={documentNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDocumentNumber(e.target.value)
              }
              placeholder="Ejemplo: F001-000452 o B001-001204"
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="mov-reason">Motivo del movimiento</Label>
            <Input
              id="mov-reason"
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setReason(e.target.value)
              }
              placeholder="Ejemplo: Compra a distribuidor o venta en tienda"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading || !productId || parsedQty <= 0 || isInsufficientStock}
        >
          {loading ? "Procesando..." : "Confirmar movimiento"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function MovementCreateDialog({
  open,
  onOpenChange,
  products,
  suppliers,
  initialProductId,
  initialType = "ENTRY",
  onSubmit,
  loading,
}: MovementCreateDialogProps) {
  const formKey: string = `${initialProductId || "none"}-${initialType}-${open ? "open" : "closed"}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        {open && (
          <MovementCreateFormFields
            key={formKey}
            products={products}
            suppliers={suppliers}
            initialProductId={initialProductId}
            initialType={initialType}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            loading={loading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
