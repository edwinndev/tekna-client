export interface CategoryOutput {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput extends CreateCategoryInput {
  id: string;
}

export interface CategoryFilterInput {
  name?: string;
}

export class CategoryModel {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string | null;
  public readonly createdAt: string;
  public readonly updatedAt: string | null;

  constructor(data: CategoryOutput) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  public getDisplayDescription(): string {
    return this.description ? this.description : "Sin descripción";
  }
}
