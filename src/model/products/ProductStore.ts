import database from '../../database';

export type Product = {
  id: number;
  name: string;
  price: number;
};
export type ProductToSave = Omit<Product, 'id'>;

class ProductStore {
  async create(dto: ProductToSave): Promise<Product> {
    const sql = `INSERT INTO products( name, price) VALUES ( $1, $2) RETURNING *`;
    const result = await database.query<Product>(sql, [dto.name, dto.price]);
    return result.rows[0];
  }

  async getById(id: number): Promise<Product | null> {
    const { rows, rowCount } = await database.query<Product>(`SELECT id, name, price FROM products WHERE id=$1`, [id]);
    if (!rowCount) {
      return null;
    }
    return rows[0];
  }

  /** check if the product or list of product Ids exists in the database */
  async isProductsExists(productIds: number[]): Promise<boolean> {
    // converted sql example -> SELECT COUNT(*) FROM products WHERE Id = ANY('{1, 2, 3}'::int[])
    const sql = `SELECT COUNT(*) as count FROM products WHERE id = ANY($1::int[])`;
    const result = await database.query<{ count: number }>(sql, [productIds]);
    return result.rows[0].count == productIds.length;
  }

  async update(id: number, dto: ProductToSave): Promise<void> {
    const sql = `UPDATE products SET  name=$1, price=$2 WHERE id=$3`;
    await database.query<ProductToSave>(sql, [dto.name, dto.price, id]);
  }

  async delete(id: number): Promise<void> {
    const sql = `DELETE FROM products WHERE id=$1`;
    await database.query<ProductToSave>(sql, [id]);
  }

  async getAll(): Promise<Product[]> {
    const { rows } = await database.query<Product>(`SELECT id, name, price FROM products`);
    return rows;
  }
}

export default new ProductStore();
