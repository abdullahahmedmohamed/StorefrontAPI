import database from '../../database';

class UserStore {
  async create(dto: CreateUserDto): Promise<UserDto> {
    const sql = `INSERT INTO users ("userName", "password", "firstName", "lastName") VALUES  ($1,$2,$3,$4) RETURNING *`;
    const result = await database.query<UserDto>(sql, [
      dto.userName,
      dto.password,
      dto.firstName,
      dto.lastName ?? null,
    ]);
    return result.rows[0];
  }

  async getByUserName(userName: UserDto['userName']): Promise<UserDto | null> {
    const { rows, rowCount } = await database.query<UserDto>(
      `SELECT "id", "userName", "password", "firstName", "lastName" FROM users WHERE "userName" = $1`,
      [userName]
    );

    if (!rowCount) {
      return null;
    }
    return rows[0];
  }

  async isUserNameExists(userName: UserDto['userName']): Promise<boolean> {
    const { rows } = await database.query<{ num: number }>(`SELECT Count(*) as num FROM users WHERE "userName" = $1`, [
      userName,
    ]);

    return rows[0].num > 0;
  }

  async getById(id: UserDto['id']): Promise<ShowUserDto | null> {
    const { rows, rowCount } = await database.query<ShowUserDto>(
      `SELECT "id", "userName", "firstName", "lastName" FROM users WHERE "id" = $1`,
      [id]
    );

    if (!rowCount) {
      return null;
    }
    return rows[0];
  }

  async getAll(): Promise<ShowUserDto[]> {
    const { rows } = await database.query<ShowUserDto>(`SELECT "id", "userName", "firstName", "lastName" FROM users`);
    return rows;
  }
}

export default new UserStore();
