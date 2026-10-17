export interface SupplierOutput {
  id: string;
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateSupplierInput {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UpdateSupplierInput extends CreateSupplierInput {
  id: string;
}

export interface SupplierFilterInput {
  name?: string;
  contactName?: string;
}

export class SupplierModel {
  public readonly id: string;
  public readonly name: string;
  public readonly contactName: string | null;
  public readonly email: string | null;
  public readonly phone: string | null;
  public readonly address: string | null;
  public readonly createdAt: string;

  constructor(data: SupplierOutput) {
    this.id = data.id;
    this.name = data.name;
    this.contactName = data.contactName;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
    this.createdAt = data.createdAt;
  }

  public getContactSummary(): string {
    const parts: string[] = [];
    if (this.contactName) parts.push(this.contactName);
    if (this.phone) parts.push(this.phone);
    return parts.length > 0 ? parts.join(" - ") : "Sin contacto directo";
  }
}
