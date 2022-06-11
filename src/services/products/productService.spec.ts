import { StatusCode } from '../../constants';
import ApiError from '../../errors/ApiError';
import { Product, ProductToSave } from '../../model/products/ProductStore';
import productService from './productService';

describe('ProductService Tests', () => {
  let id: number;
  const product: ProductToSave = {
    name: 'ppp1111p',
    price: 432.0,
  };
  describe('[create] method tests', () => {
    it('Should create new product', async () => {
      const result = await productService.create({ ...product });
      id = result.id;
      expect(result.id).toBeGreaterThan(0);
      expect(result.price).toBeCloseTo(product.price);
      expect(result.name).toBe(product.name);
    });

    describe('[name] validation rules', () => {
      it('required', async () => {
        const { name, ...input } = product;
        await expectAsync(productService.create(input as any)).toBeRejected();
      });

      it('max length 50 characters', async () => {
        const input = { ...product, name: 'a'.repeat(51) };
        await expectAsync(productService.create(input)).toBeRejected();
      });
    });

    describe('[price] validation rules', () => {
      it('required', async () => {
        const { price, ...input } = product;
        await expectAsync(productService.create(input as any)).toBeRejected();
      });

      it('minimum is 0', async () => {
        const input = { ...product, price: -1 };
        await expectAsync(productService.create(input)).toBeRejected();
      });
    });
  });

  describe('[show] method tests', () => {
    it('Should return product by id', async () => {
      const result = await productService.show(id);
      expect(result.id).toBe(id);
      expect(result.price).toBeCloseTo(product.price);
      expect(result.name).toBe(product.name);
    });

    it('Should throw NotFound error if product id not exists', async () => {
      try {
        await productService.show(985000);
        expect(0).toEqual(1);
      } catch (error) {
        if (!(error instanceof ApiError)) throw error;
        expect(error.statusCode).toEqual(StatusCode.NotFound);
      }
    });
  });

  describe('[update] method tests', () => {
    it('Should update product', async () => {
      const updatedProduct = { name: 'nnew name', price: 42.6 };
      await productService.update(id, updatedProduct);

      const result = (await productService.show(id)) as Product;
      expect(result.id).toBe(id);
      expect(result.price).toBeCloseTo(updatedProduct.price);
      expect(result.name).toBe(updatedProduct.name);
    });

    describe('[name] validation rules', () => {
      it('required', async () => {
        const { name, ...input } = product;
        await expectAsync(productService.create(input as any)).toBeRejected();
      });

      it('max length 50 characters', async () => {
        const input = { ...product, name: 'a'.repeat(51) };
        await expectAsync(productService.create(input)).toBeRejected();
      });
    });

    describe('[price] validation rules', () => {
      it('required', async () => {
        const { price, ...input } = product;
        await expectAsync(productService.create(input as any)).toBeRejected();
      });

      it('minimum is 0', async () => {
        const input = { ...product, price: -1 };
        await expectAsync(productService.create(input)).toBeRejected();
      });
    });
  });

  it('[index] Should return list of products', async () => {
    const result = await productService.index();
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });

  it('[delete] Should delete product', async () => {
    await productService.delete(id);
    await expectAsync(productService.show(id)).toBeRejected();
  });
});
