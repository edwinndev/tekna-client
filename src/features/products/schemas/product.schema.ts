import { z } from "zod";

export const createProductSchema = z.object({
  sku: z
    .string()
    .min(1, "El código SKU es obligatorio")
    .max(50, "El SKU no puede exceder 50 caracteres"),
  name: z
    .string()
    .min(1, "El nombre del producto es obligatorio")
    .max(255, "El nombre no puede exceder 255 caracteres"),
  categoryId: z.string().uuid("Identificador de categoría inválido").optional(),
  description: z.string().max(500, "Descripción muy extensa").optional(),
  price: z
    .number()
    .positive("El precio debe ser un número positivo mayor a 0"),
  stock: z
    .number()
    .int("El stock debe ser un número entero")
    .nonnegative("El stock no puede ser negativo"),
  minStock: z
    .number()
    .int("El stock mínimo debe ser un número entero")
    .nonnegative("El stock mínimo no puede ser negativo"),
});

export const updateProductSchema = createProductSchema.extend({
  id: z.string().uuid("Identificador de producto inválido"),
});

export const productFilterSchema = z.object({
  name: z.string().optional(),
  sku: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  lowStockOnly: z.boolean().optional(),
});

export type CreateProductSchemaType = z.infer<typeof createProductSchema>;
export type UpdateProductSchemaType = z.infer<typeof updateProductSchema>;
export type ProductFilterSchemaType = z.infer<typeof productFilterSchema>;
