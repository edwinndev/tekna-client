import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre del proveedor es obligatorio")
    .max(150, "El nombre no puede exceder 150 caracteres"),
  contactName: z.string().max(100, "El nombre de contacto no puede exceder 100 caracteres").optional(),
  email: z.string().email("Formato de correo electrónico inválido").max(100).optional().or(z.literal("")),
  phone: z.string().max(30, "El teléfono no puede exceder 30 caracteres").optional(),
  address: z.string().max(255, "La dirección no puede exceder 255 caracteres").optional(),
});

export const updateSupplierSchema = createSupplierSchema.extend({
  id: z.string().uuid("Identificador de proveedor inválido"),
});

export const supplierFilterSchema = z.object({
  name: z.string().optional(),
  contactName: z.string().optional(),
});

export type CreateSupplierSchemaType = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierSchemaType = z.infer<typeof updateSupplierSchema>;
export type SupplierFilterSchemaType = z.infer<typeof supplierFilterSchema>;
