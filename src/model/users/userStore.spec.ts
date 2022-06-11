import userStore from './userStore';

describe('UserSore Tests', () => {
  let createdID: number;
  const userToCreate: CreateUserDto = {
    firstName: 'UserSore',
    lastName: 'UserSore LastName',
    userName: 'userstore',
    password: 'Abdo123',
  };
  it('[create] Should Create New User "Register"', async () => {
    const result = await userStore.create({ ...userToCreate });
    createdID = result.id;
    expect(result.id).toBeGreaterThan(0);
    expect(result).toEqual({ id: result.id, ...userToCreate });
  });

  it('[getByUserName] Should Retrive User Info including password By userName', async () => {
    const result = await userStore.getByUserName(userToCreate.userName);
    expect(result).toEqual({ id: createdID, ...userToCreate });
  });

  it('[getById] Should Retrive User Info Without password By id', async () => {
    const result = await userStore.getById(createdID);
    const { password, ...info } = userToCreate;
    expect((result as UserDto).password).toBeFalsy();
    expect(result).toEqual({ id: createdID, ...info });
  });

  it('[getAll] Should Retrive All Users Without password', async () => {
    const result = await userStore.getAll();
    expect(result.length).toBeGreaterThan(0);
  });
});
