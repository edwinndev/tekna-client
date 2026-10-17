"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Truck, Edit2, Trash2, Phone, Mail, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSuppliers } from "../hooks/use-suppliers";
import { CreateSupplierInput, SupplierOutput } from "../types/supplier";
import { SupplierFormDialog } from "./supplier-form-dialog";

export function SuppliersView() {
  const {
    suppliers,
    loading,
    total,
    errorMessage,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  } = useSuppliers();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierOutput | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchSuppliers(searchTerm);
  };

  const handleOpenCreate = () => {
    setSelectedSupplier(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (supplier: SupplierOutput) => {
    setSelectedSupplier(supplier);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed: boolean = window.confirm(
      `¿Está seguro de que desea eliminar al proveedor "${name}"?`
    );
    if (confirmed) {
      await deleteSupplier(id);
    }
  };

  const handleFormSubmit = async (data: CreateSupplierInput) => {
    if (selectedSupplier) {
      await updateSupplier({
        id: selectedSupplier.id,
        ...data,
      });
    } else {
      await createSupplier(data);
    }
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proveedores</h1>
          <p className="text-muted-foreground text-sm">
            Gestión de fabricantes, marcas y distribuidores mayoristas de Tekna Gamer
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo proveedor
        </Button>
      </div>

      {errorMessage && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
          {errorMessage}
        </div>
      )}

      <Card className="w-full min-w-0 overflow-hidden">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Directorio de proveedores
              </CardTitle>
              <CardDescription>
                Total de proveedores registrados: {total}
              </CardDescription>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Buscar proveedor..."
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
          </div>
        </CardHeader>
        <CardContent className="overflow-hidden">
          <div className="rounded-md border overflow-hidden">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Proveedor / Empresa</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Cargando proveedores...
                    </TableCell>
                  </TableRow>
                ) : suppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No se encontraron proveedores registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  suppliers.map((supplier: SupplierOutput) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-semibold text-foreground">
                        {supplier.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{supplier.contactName ? supplier.contactName : "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{supplier.email ? supplier.email : "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{supplier.phone ? supplier.phone : "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate">{supplier.address ? supplier.address : "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(supplier)}
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(supplier.id, supplier.name)}
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <SupplierFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        supplier={selectedSupplier}
        onSubmit={handleFormSubmit}
        loading={loading}
      />
    </div>
  );
}
