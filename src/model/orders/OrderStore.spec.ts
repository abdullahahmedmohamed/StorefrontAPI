import productService from '../../services/products/productService';
import userGenerator from '../../tests/utils/userGenerator';
import orderStore, { OrderDto, OrderProduct, OrderProductDto, OrderToSave } from './OrderStore';

describe('OrderStore Tests', () => {
  let orderId: number;
  const status: OrderDto['status'] = 'active';
  let user: Awaited<ReturnType<typeof userGenerator.getAuthenticatedUser>>;
  let products: OrderProductDto[];
  beforeAll(async () => {
    const p1 = await productService.create({ name: 'orderstore_test_1', price: 1 });
    const p2 = await productService.create({ name: 'orderstore_test_2', price: 2 });
    const p3 = await productService.create({ name: 'orderstore_test_3', price: 3 });
    user = await userGenerator.getAuthenticatedUser();
    products = [p1, p2, p3].map((p) => ({ productId: p.id, quantity: Math.ceil(Math.random() * 100) }));
  });

  it('[insertOrder] Should create new order', async () => {
    const input = { status, userId: user.id };
    const result = await orderStore.insertOrder(input);
    orderId = result.id;
    expect(result.id).toBeGreaterThan(0);
    expect(result).toEqual({ id: orderId, ...input });
  });

  it('[insertOrderProducts] Should insert products for specific order', async () => {
    const result = await orderStore.insertOrderProducts(orderId, [...products]);
    expect(result.length).toEqual(products.length);
    products.forEach((pro) => {
      const match = result.find((x) => x.productId == pro.productId) as OrderProduct;
      expect(match).toBeTruthy();
      expect(match.id).toBeGreaterThan(0);
      expect(match.quantity).toBe(pro.quantity);
    });
  });

  it('[getOrderProducts] Should get All products for specific order', async () => {
    const result = await orderStore.getOrderProducts(orderId);
    expect(result.length).toEqual(products.length);
    console.log({
      result,
      products,
    });

    products.forEach((pro) => {
      const match = result.find((x) => x.productId == pro.productId) as OrderProduct;
      expect(match).toBeTruthy();
      expect(match.id).toBeGreaterThan(0);
      expect(match.quantity).toBe(pro.quantity);
    });
  });

  describe('[isProductReferenced] method', () => {
    it('Should get true as the product is referenced by order', async () => {
      const result = await orderStore.isProductReferenced(products[0].productId);
      expect(result).toBeTruthy();
    });

    it('Should get false as the product not referenced by order', async () => {
      const result = await orderStore.isProductReferenced(52323);
      expect(result).toBeFalsy();
    });
  });

  describe('[isOrderExists] method', () => {
    it('Should get true as the order exists in database', async () => {
      const result = await orderStore.isOrderExists(orderId);
      expect(result).toBeTruthy();
    });

    it('Should get false as the order not exists in database', async () => {
      const result = await orderStore.isOrderExists(52323);
      expect(result).toBeFalsy();
    });
  });

  describe('[setOrderStatus] method', () => {
    it('Should update order status as [active|complete]', async () => {
      await expectAsync(orderStore.setOrderStatus(orderId, status)).toBeResolved();
    });

    it('Should throw error if order status not in [active|complete]', async () => {
      await expectAsync(orderStore.setOrderStatus(orderId, 'anything' as any)).toBeRejected();
    });
  });

  it('[getOrderWithProducts] Should get All products for specific order', async () => {
    const result = (await orderStore.getOrderWithProducts(orderId)) as OrderDto;
    expect(result.status).toEqual(status);
    expect(result.id).toEqual(orderId);
    expect(result.userId).toEqual(user.id);
    expect(result.products.length).toEqual(products.length);
  });

  it('[getAllOrders] Should get all orders', async () => {
    const result = await orderStore.getAllOrders();
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
    expect(Object.keys(result[0]).sort()).toEqual(['id', 'userId', 'status'].sort());
  });

  it('[updateOrder] Should update order', async () => {
    const updatedProduct = { userId: user.id, status: 'complete' } as Parameters<typeof orderStore.updateOrder>[1];
    await orderStore.updateOrder(orderId, updatedProduct);
    const result = (await orderStore.getOrderWithProducts(orderId)) as OrderDto;
    expect(result.id).toBe(orderId);
    expect(result.userId).toBeCloseTo(updatedProduct.userId);
    expect(result.status).toBe(updatedProduct.status);
  });

  it('[deleteOrderProducts] Should delete product', async () => {
    await orderStore.deleteOrderProducts(orderId);
    const result = await orderStore.getOrderProducts(orderId);
    expect(result.length).toEqual(0);
  });

  it('[delete] Should delete product', async () => {
    await orderStore.deleteOrder(orderId);
    const result = await orderStore.getOrderWithProducts(orderId);
    expect(result).toEqual(null);
  });
});
