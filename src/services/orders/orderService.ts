import ApiError from '../../errors/ApiError';
import orderStore, { Order, OrderDto } from '../../model/orders/OrderStore';
import productStore from '../../model/products/ProductStore';
import validate from './validate';

class OrderService {
  async index(): Promise<Order[]> {
    return await orderStore.getAllOrders();
  }

  async show(id: number): Promise<OrderDto> {
    const result = await orderStore.getOrderWithProducts(id);
    if (!result) {
      throw ApiError.NotFound();
    }
    return result;
  }

  async create(dto: Omit<OrderDto, 'id'>): Promise<OrderDto> {
    const isValid = validate(dto);
    if (!isValid) {
      throw ApiError.BadRequestAjv(validate.errors!);
    }
    const isValidProductIds = await productStore.isProductsExists(dto.products.map((p) => p.productId));

    if (!isValidProductIds) {
      throw ApiError.BadRequestSimple(
        'one or more (productId) that supplied in the request are invalid or not exists any more'
      );
    }
    const order = await orderStore.insertOrder({ userId: dto.userId, status: dto.status });
    const products = await orderStore.insertOrderProducts(order.id, dto.products);
    return {
      ...order,
      products,
    };
  }

  async update(id: number, dto: Omit<OrderDto, 'id'>): Promise<void> {
    const isValid = validate(dto);
    if (!isValid) {
      throw ApiError.BadRequestAjv(validate.errors!);
    }

    const orderExists = await orderStore.isOrderExists(id);

    if (!orderExists) {
      throw ApiError.BadRequestSimple(`can't find order with id (${id})`);
    }

    const isValidProductIds = await productStore.isProductsExists(dto.products.map((p) => p.productId));
    if (!isValidProductIds) {
      throw ApiError.BadRequestSimple(
        'one or more (productId) that supplied in the request are invalid or not exists any more'
      );
    }
    await orderStore.deleteOrderProducts(id);
    await orderStore.updateOrder(id, { userId: dto.userId, status: dto.status });
    await orderStore.insertOrderProducts(id, dto.products);
  }

  async delete(id: number): Promise<void> {
    await orderStore.deleteOrder(id);
  }
}

export default new OrderService();
