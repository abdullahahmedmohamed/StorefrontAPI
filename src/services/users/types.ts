type UserDto = {
  id: number;
  userName: string;
  firstName: string;
  lastName?: string;
  password: string;
};

type CreateUserDto = Omit<UserDto, 'id'>;
type ShowUserDto = Omit<UserDto, 'password'>;

type SuccessLoginResponse = {
  name: string; // user name
  id: number;
  token: string;
};

type LoginCredentials = Pick<UserDto, 'userName' | 'password'>;
