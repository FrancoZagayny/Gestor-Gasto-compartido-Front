import { getJson, postJson, del } from '../../../../shared/libs/api';
import { Categoria, CategoriaFormData } from '../types/CategoriaTypes';

export class CategoriasService {
  static async getAll(): Promise<Categoria[]> {
    const data = await getJson('/categorias');
    return Array.isArray(data) ? data : [];
  }

  static async create(data: CategoriaFormData): Promise<Categoria> {
    return await postJson('/categorias', data);
  }

  static async delete(id: number): Promise<void> {
    return await del(`/categorias/${id}`);
  }
}

