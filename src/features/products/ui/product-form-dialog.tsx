"use client";

import { useState } from "react";
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
import { CategoryOutput } from "@/features/categories/types/category";
import { CreateProductInput, ProductOutput } from "../types/product";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductOutput | null;
  categories: CategoryOutput[];
  onSubmit: (data: CreateProductInput) => Promise<void>;
  loading: boolean;
}

interface InnerFormProps {
  product: ProductOutput | null;
  categories: CategoryOutput[];
  onSubmit: (data: CreateProductInput) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

function ProductFormFields({
  product,
  categories,
  onSubmit,
  onCancel,
  loading,
}: InnerFormProps) {
  const [sku, setSku] = useState<string>(product ? product.sku : "");
  const [name, setName] = useState<string>(product ? product.name : "");
  const [categoryId, setCategoryId] = useState<string>(
    product && product.categoryId ? product.categoryId : ""
  );
  const [price, setPrice] = useState<string>(product ? product.price.toString() : "");
  const [stock, setStock] = useState<string>(product ? product.stock.toString() : "0");
  const [minStock, setMinStock] = useState<string>(
    product ? product.minStock.toString() : "5"
  );
  const [description, setDescription] = useState<string>(
    product && product.description ? product.description : ""
  );

  const isEditing: boolean = product !== null;

  const categoryItems: Record<string, string> = Object.fromEntries(
    categories.map((cat: CategoryOutput) => [cat.id, cat.name])
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sku.trim() || !name.trim() || !price) return;

    const parsedPrice: number = parseFloat(price);
    const parsedStock: number = parseInt(stock, 10) || 0;
    const parsedMinStock: number = parseInt(minStock, 10) || 5;

    await onSubmit({
      sku: sku.trim().toUpperCase(),
      name: name.trim(),
      categoryId: categoryId ? categoryId : undefined,
      price: parsedPrice,
      stock: parsedStock,
      minStock: parsedMinStock,
      description: description.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Editar producto" : "Nuevo producto"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Actualice los datos comerciales y niveles de inventario del producto"
            : "Ingrese los datos del nuevo periférico o componente de Tekna Gamer"}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="product-sku">Código SKU</Label>
            <Input
              id="product-sku"
              value={sku}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSku(e.target.value)
              }
              placeholder="Ejemplo: MOU-LOG-G502"
              required
              disabled={loading || isEditing}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="product-category">Categoría</Label>
            <Select
              value={categoryId}
              onValueChange={(val: string | null) => setCategoryId(val ? val : "")}
              items={categoryItems}
              disabled={loading}
            >
              <SelectTrigger id="product-category" className="w-full">
                <SelectValue placeholder="Seleccione una categoría">
                  {(val: string | null) =>
                    val && categoryItems[val]
                      ? categoryItems[val]
                      : "Seleccione una categoría"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat: CategoryOutput) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="product-name">Nombre del producto</Label>
          <Input
            id="product-name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            placeholder="Ejemplo: Mouse Logitech G502 Hero Lightspeed"
            required
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="product-price">Precio unitario (S/)</Label>
            <Input
              id="product-price"
              type="number"
              step="0.01"
              min="0.01"
              value={price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPrice(e.target.value)
              }
              placeholder="389.90"
              required
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="product-stock">Stock actual</Label>
            <Input
              id="product-stock"
              type="number"
              min="0"
              value={stock}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setStock(e.target.value)
              }
              placeholder="10"
              required
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="product-min-stock">Stock mínimo (alerta)</Label>
            <Input
              id="product-min-stock"
              type="number"
              min="1"
              value={minStock}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMinStock(e.target.value)
              }
              placeholder="5"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="product-desc">Descripción detallada</Label>
          <Input
            id="product-desc"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDescription(e.target.value)
            }
            placeholder="Características técnicas, conectividad, switches, etc."
            disabled={loading}
          />
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
        <Button type="submit" disabled={loading || !sku.trim() || !name.trim()}>
          {loading ? "Guardando..." : "Guardar producto"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  categories,
  onSubmit,
  loading,
}: ProductFormDialogProps) {
  const formKey: string = product ? product.id : "new";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        {open && (
          <ProductFormFields
            key={formKey}
            product={product}
            categories={categories}
            onSubmit={async (data) => {
              await onSubmit(data);
              onOpenChange(false);
            }}
            onCancel={() => onOpenChange(false)}
            loading={loading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
