import ApiError from '../../errors/ApiError';
import OrderStore from '../../model/orders/OrderStore';
import productStore, { Product, ProductToSave } from '../../model/products/ProductStore';
import validate from './validate';

class ProductService {
  async index(): Promise<Product[]> {
    return await productStore.getAll();
  }

  async show(id: number): Promise<Product> {
    const result = await productStore.getById(id);
    if (!result) {
      throw ApiError.NotFound();
    }
    return result;
  }

  async create(dto: ProductToSave): Promise<Product> {
    const isValid = validate(dto);
    if (!isValid) {
      throw ApiError.BadRequestAjv(validate.errors!);
    }
    return await productStore.create(dto);
  }

  async update(id: number, dto: ProductToSave): Promise<void> {
    const isValid = validate(dto);
    if (!isValid) {
      throw ApiError.BadRequestAjv(validate.errors!);
    }
    await productStore.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    const isUsed = await OrderStore.isProductReferenced(id);
    if (isUsed) {
      throw ApiError.BadRequestSimple(`Can't Delete product with id ${id} because its referenced by order`);
    }
    await productStore.delete(id);
  }
}

export default new ProductService();
