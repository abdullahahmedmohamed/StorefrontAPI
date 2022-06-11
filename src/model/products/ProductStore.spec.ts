import productStore, { Product, ProductToSave } from './ProductStore';

describe('ProductStore Tests', () => {
  let createdID: number;
  const productToCreate: ProductToSave = {
    name: 'p101',
    price: 222,
  };
  it('[create] Should Create New product', async () => {
    const result = await productStore.create({ ...productToCreate });
    createdID = result.id;
    expect(result.id).toBeGreaterThan(0);
    expect(result.price).toBeCloseTo(productToCreate.price);
    expect(result.name).toBe(productToCreate.name);
  });

  describe('[isProductsExists] method', () => {
    it('Should get true as the product exists in database', async () => {
      const result = await productStore.isProductsExists([createdID]);
      expect(result).toBeTruthy();
    });

    it('Should get false as the product not exists in database', async () => {
      const result = await productStore.isProductsExists([733]);
      expect(result).toBeFalsy();
    });

    it('Should get false as the list of products Ids not exists in database', async () => {
      const result = await productStore.isProductsExists([52323, 43226, 733]);
      expect(result).toBeFalsy();
    });
  });

  describe('[getById] method', () => {
    it('Should get product by id', async () => {
      const result = (await productStore.getById(createdID)) as Product;
      expect(result.id).toBe(createdID);
      expect(result.price).toBeCloseTo(productToCreate.price);
      expect(result.name).toBe(productToCreate.name);
    });

    it('Should return null if product not exists', async () => {
      const result = await productStore.getById(15252);
      expect(result).toEqual(null);
    });
  });

  it('[getAll] Should get all products', async () => {
    const result = await productStore.getAll();
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
    expect(Object.keys(result[0]).sort()).toEqual(['id', 'name', 'price'].sort());
  });

  it('[update] Should update product', async () => {
    const updatedProduct: ProductToSave = { name: 'updated p101', price: 202 };
    await productStore.update(createdID, updatedProduct);
    const result = (await productStore.getById(createdID)) as Product;
    expect(result.id).toBe(createdID);
    expect(result.price).toBeCloseTo(updatedProduct.price);
    expect(result.name).toBe(updatedProduct.name);
  });

  it('[delete] Should delete product', async () => {
    await productStore.delete(createdID);
    const result = await productStore.getById(createdID);
    expect(result).toEqual(null);
  });
});
