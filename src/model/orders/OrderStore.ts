import database from '../../database';
import format from 'pg-format';

export type Order = {
  id: number;
  userId: number;
  status: 'active' | 'complete';
};
export type OrderProduct = { id: number; productId: number; quantity: number };
export type OrderProductDto = Omit<OrderProduct, 'id'>;
export type OrderDto = {
  id: number;
  userId: number;
  status: 'active' | 'complete';
  products: OrderProductDto[];
};
export type OrderToSave = Omit<Order, 'id'>;

class OrderStore {
  async insertOrder(dto: Omit<Order, 'id'>): Promise<Order> {
    const sql = `INSERT INTO orders( "userId", "status") VALUES ($1, $2) RETURNING *`;
    const { rows } = await database.query<Order>(sql, [dto.userId, dto.status]);
    return rows[0];
  }

  async insertOrderProducts(orderId: number, products: OrderProductDto[]): Promise<OrderProduct[]> {
    const sql = format(
      'INSERT INTO order_products( "orderId", "productId", quantity) VALUES %L RETURNING  id,"productId", quantity',
      products.map((p) => [orderId, p.productId, p.quantity])
    );

    const { rows } = await database.query<OrderProduct>(sql);
    return rows;
  }

  async getOrderProducts(orderId: number): Promise<OrderProduct[]> {
    const sql = `SELECT id,"productId",quantity FROM order_products WHERE "orderId"=$1`;
    const result = await database.query<OrderProduct>(sql, [orderId]);
    return result.rows;
  }

  async deleteOrderProducts(orderId: number): Promise<void> {
    const sql = `DELETE FROM order_products WHERE "orderId"=$1`;
    await database.query(sql, [orderId]);
  }

  /** check if the product is referenced order or not */
  async isProductReferenced(productId: number): Promise<boolean> {
    const sql = `SELECT COUNT(*) as count FROM order_products WHERE "productId"=$1`;
    const result = await database.query<{ count: number }>(sql, [productId]);
    return result.rows[0].count > 0;
  }

  async isOrderExists(orderId: number): Promise<boolean> {
    const sql = `SELECT COUNT(*) as count FROM orders WHERE id=$1`;
    const result = await database.query<{ count: number }>(sql, [orderId]);
    return result.rows[0].count > 0;
  }

  async setOrderStatus(id: number, status: Order['status']): Promise<void> {
    const sql = `UPDATE orders SET "status"=$1 WHERE id=$2`;
    await database.query(sql, [status, id]);
  }

  async getOrderWithProducts(id: number): Promise<OrderDto | null> {
    const sql = `SELECT o.id, "userId", "status" , "productId", quantity  
    FROM orders as o inner join order_products as p on o.id= p."orderId" 
    Where o.id = $1`;

    const { rows, rowCount } = await database.query<Order & OrderProductDto>(sql, [id]);

    if (!rowCount) {
      return null;
    }
    const { userId, status } = rows[0];

    return {
      id,
      userId,
      status,
      products: rows.map((r) => ({ productId: r.productId, quantity: r.quantity })),
    };
  }
  async updateOrder(id: number, dto: Omit<Order, 'id'>): Promise<void> {
    const sql = `UPDATE orders SET "userId"=$1, "status"=$2 WHERE id=$3`;
    await database.query(sql, [dto.userId, dto.status, id]);
  }

  async deleteOrder(id: number): Promise<void> {
    // [CASCADE DELETE] when an order gets deleted its relations in order_products will be deleted automatically
    const sql = `DELETE FROM orders WHERE id=$1`;
    await database.query(sql, [id]);
  }

  async getAllOrders(): Promise<Order[]> {
    const { rows } = await database.query<Order>(`SELECT * FROM orders`);
    return rows;
  }
}

export default new OrderStore();
