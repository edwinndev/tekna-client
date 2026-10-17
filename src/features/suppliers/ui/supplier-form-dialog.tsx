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
import { CreateSupplierInput, SupplierOutput } from "../types/supplier";

interface SupplierFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: SupplierOutput | null;
  onSubmit: (data: CreateSupplierInput) => Promise<void>;
  loading: boolean;
}

interface InnerFormProps {
  supplier: SupplierOutput | null;
  onSubmit: (data: CreateSupplierInput) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

function SupplierFormFields({
  supplier,
  onSubmit,
  onCancel,
  loading,
}: InnerFormProps) {
  const [name, setName] = useState<string>(supplier ? supplier.name : "");
  const [contactName, setContactName] = useState<string>(
    supplier && supplier.contactName ? supplier.contactName : ""
  );
  const [email, setEmail] = useState<string>(
    supplier && supplier.email ? supplier.email : ""
  );
  const [phone, setPhone] = useState<string>(
    supplier && supplier.phone ? supplier.phone : ""
  );
  const [address, setAddress] = useState<string>(
    supplier && supplier.address ? supplier.address : ""
  );

  const isEditing: boolean = supplier !== null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onSubmit({
      name: name.trim(),
      contactName: contactName.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Editar proveedor" : "Nuevo proveedor"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Actualice los datos comerciales del distribuidor o fabricante"
            : "Ingrese los datos del nuevo distribuidor mayorista de tecnología"}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="supplier-name">Razón social o nombre</Label>
          <Input
            id="supplier-name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            placeholder="Ejemplo: Razer Distributor Peru S.A.C."
            required
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="supplier-contact">Persona de contacto</Label>
            <Input
              id="supplier-contact"
              value={contactName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setContactName(e.target.value)
              }
              placeholder="Ejemplo: Carlos Mendoza"
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="supplier-phone">Teléfono de contacto</Label>
            <Input
              id="supplier-phone"
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPhone(e.target.value)
              }
              placeholder="+51 987 654 321"
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="supplier-email">Correo electrónico</Label>
          <Input
            id="supplier-email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            placeholder="ventas@distribuidor.pe"
            disabled={loading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="supplier-address">Dirección fiscal o almacén</Label>
          <Input
            id="supplier-address"
            value={address}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAddress(e.target.value)
            }
            placeholder="Av. Arenales 1234, Lima"
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
          {loading ? "Guardando..." : "Guardar proveedor"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function SupplierFormDialog({
  open,
  onOpenChange,
  supplier,
  onSubmit,
  loading,
}: SupplierFormDialogProps) {
  const formKey: string = supplier ? supplier.id : "new";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {open && (
          <SupplierFormFields
            key={formKey}
            supplier={supplier}
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
