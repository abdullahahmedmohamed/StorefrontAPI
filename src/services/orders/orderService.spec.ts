import { StatusCode } from '../../constants';
import ApiError from '../../errors/ApiError';
import { OrderDto, OrderProduct } from '../../model/orders/OrderStore';
import userGenerator from '../../tests/utils/userGenerator';
import productService from '../products/productService';
import orderService from './orderService';

describe('OrderService Tests', () => {
  let orderId: number;
  let order: Omit<OrderDto, 'id'>;
  beforeAll(async () => {
    const p1 = await productService.create({ name: 'orderservice_test_1', price: 1 });
    const p2 = await productService.create({ name: 'orderservice_test_2', price: 2 });
    const p3 = await productService.create({ name: 'orderservice_test_3', price: 3 });
    const user = await userGenerator.getAuthenticatedUser();
    const products = [p1, p2, p3].map((p) => ({ productId: p.id, quantity: Math.ceil(Math.random() * 100) }));
    order = {
      userId: user.id,
      status: 'active',
      products,
    };
  });
  describe('[create] method tests', () => {
    it('Should create new order', async () => {
      const result = await orderService.create({ ...order });
      orderId = result.id;
      expect(result.id).toBeGreaterThan(0);
      expect(result.products.length).toBe(order.products.length);
    });

    it('Should throw error if one or more productsId is invalid or not exists', async () => {
      const input = { ...order };
      input.products = [...input.products, { productId: 334, quantity: 43 }];
      await expectAsync(orderService.create(input)).toBeRejected();
    });

    describe('[userId] validation rules', () => {
      it('required', async () => {
        const { userId, ...input } = order;
        await expectAsync(orderService.create(input as any)).toBeRejected();
      });

      it('minimum value is 1', async () => {
        const input = { ...order, userId: 0 };
        await expectAsync(orderService.create(input)).toBeRejected();
      });
    });

    describe('[status] validation rules', () => {
      it('required', async () => {
        const { status, ...input } = order;
        await expectAsync(orderService.create(input as any)).toBeRejected();
      });

      it('status value should be [active] or [complete]', async () => {
        const input = { ...order, status: 'somthing Else' };
        await expectAsync(orderService.create(input as any)).toBeRejected();
      });
    });

    describe('[products] validation rules', () => {
      it('products array is required', async () => {
        const { products, ...input } = order;
        await expectAsync(orderService.create(input as any)).toBeRejected();
      });

      it('product.productId is required', async () => {
        const unvalidProducts = order.products.map((p) => {
          const { productId, ...rest } = p;
          return rest;
        });
        const input = { ...order, products: unvalidProducts };

        await expectAsync(orderService.create(input as any)).toBeRejected();
      });

      it('product.quantity is required', async () => {
        const unvalidProducts = order.products.map((p) => {
          const { quantity, ...rest } = p;
          return rest;
        });
        const input = { ...order, products: unvalidProducts };

        await expectAsync(orderService.create(input as any)).toBeRejected();
      });

      it('product.quantity minimum value is 1', async () => {
        const unvalidProducts = order.products.map((p) => ({ ...p, quantity: 0 }));
        const input = { ...order, products: unvalidProducts };

        await expectAsync(orderService.create(input as any)).toBeRejected();
      });
    });
  });

  describe('[show] method tests', () => {
    it('Should return product by id', async () => {
      const result = await orderService.show(orderId);
      expect(result.id).toBe(orderId);
      expect(result.status).toBe(order.status);
      expect(result.userId).toBe(order.userId);
      expect(result.products.length).toBe(order.products.length);
    });

    it('Should throw NotFound error if product id not exists', async () => {
      try {
        await orderService.show(985000);
        expect(0).toEqual(1);
      } catch (error) {
        if (!(error instanceof ApiError)) throw error;
        expect(error.statusCode).toEqual(StatusCode.NotFound);
      }
    });
  });

  describe('[update] method tests', () => {
    it('Should update the order', async () => {
      const input = { ...order };
      input.status = 'complete';
      input.products = order.products.map((p) => ({ ...p, quantity: p.quantity + 2 }));
      await orderService.update(orderId, { ...input });
      const result = await orderService.show(orderId);
      expect(result.status).toBe(input.status);
      expect(result.products.length).toBe(order.products.length);
      input.products.forEach((pro) => {
        const match = result.products.find((x) => x.productId == pro.productId) as OrderProduct;
        expect(match).toBeTruthy();
        expect(match.quantity).toBe(pro.quantity);
      });
    });

    it('Should throw error if one or more productsId is invalid or not exists', async () => {
      const input = { ...order };
      input.products = [...input.products, { productId: 532, quantity: 43 }];
      await expectAsync(orderService.create(input)).toBeRejected();
    });

    describe('[userId] validation rules', () => {
      it('required', async () => {
        const { userId, ...input } = order;
        await expectAsync(orderService.create(input as any)).toBeRejected();
      });

      it('minimum value is 1', async () => {
        const input = { ...order, userId: 0 };
        await expectAsync(orderService.create(input)).toBeRejected();
      });
    });

    describe('[status] validation rules', () => {
      it('required', async () => {
        const { status, ...input } = order;
        await expectAsync(orderService.create(input as any)).toBeRejected();
      });

      it('status value should be [active] or [complete]', async () => {
        const input = { ...order, status: 'somthing Else' };
        await expectAsync(orderService.create(input as any)).toBeRejected();
      });
    });

    describe('[products] validation rules', () => {
      it('products array is required', async () => {
        const { products, ...input } = order;
        await expectAsync(orderService.create(input as any)).toBeRejected();
      });

      it('product.productId is required', async () => {
        const unvalidProducts = order.products.map((p) => {
          const { productId, ...rest } = p;
          return rest;
        });
        const input = { ...order, products: unvalidProducts };

        await expectAsync(orderService.create(input as any)).toBeRejected();
      });

      it('product.quantity is required', async () => {
        const unvalidProducts = order.products.map((p) => {
          const { quantity, ...rest } = p;
          return rest;
        });
        const input = { ...order, products: unvalidProducts };

        await expectAsync(orderService.create(input as any)).toBeRejected();
      });

      it('product.quantity minimum value is 1', async () => {
        const unvalidProducts = order.products.map((p) => ({ ...p, quantity: 0 }));
        const input = { ...order, products: unvalidProducts };

        await expectAsync(orderService.create(input as any)).toBeRejected();
      });
    });
  });

  it('[index] Should return list of products', async () => {
    const result = await orderService.index();
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });
  it('[delete] Should delete order', async () => {
    await orderService.delete(orderId);
    await expectAsync(orderService.show(orderId)).toBeRejected();
  });
});
