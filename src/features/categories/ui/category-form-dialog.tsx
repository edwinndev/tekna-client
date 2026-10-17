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
import { CategoryOutput } from "../types/category";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryOutput | null;
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
  loading: boolean;
}

interface InnerFormProps {
  category: CategoryOutput | null;
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

function CategoryFormFields({ category, onSubmit, onCancel, loading }: InnerFormProps) {
  const [name, setName] = useState<string>(category ? category.name : "");
  const [description, setDescription] = useState<string>(
    category && category.description ? category.description : ""
  );

  const isEditing: boolean = category !== null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSubmit({ name: name.trim(), description: description.trim() });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Editar categoría" : "Nueva categoría"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Actualice los datos de la categoría seleccionada"
            : "Ingrese los datos de la nueva categoría para los productos"}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="category-name">Nombre de categoría</Label>
          <Input
            id="category-name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            placeholder="Ejemplo: Periféricos gamer"
            required
            disabled={loading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category-desc">Descripción (opcional)</Label>
          <Input
            id="category-desc"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDescription(e.target.value)
            }
            placeholder="Descripción general de la categoría"
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
        <Button type="submit" disabled={loading || !name.trim()}>
          {loading ? "Guardando..." : "Guardar categoría"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
  loading,
}: CategoryFormDialogProps) {
  const formKey: string = category ? category.id : "new";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && (
          <CategoryFormFields
            key={formKey}
            category={category}
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
