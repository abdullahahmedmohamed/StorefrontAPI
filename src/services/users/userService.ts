import ApiError from '../../errors/ApiError';
import userStore from '../../model/users/userStore';
import validate from './validate';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../../logger';
import appConfig from '../../appConfig';

const { saltRound, jwtExpiresIn, passwordPepper, jwtKey } = appConfig.auth;
class UserService {
  async index(): Promise<ShowUserDto[]> {
    return await userStore.getAll();
  }

  async show(id: number): Promise<ShowUserDto> {
    const result = await userStore.getById(id);
    if (!result) {
      throw ApiError.NotFound();
    }
    return result;
  }

  async register(dto: CreateUserDto): Promise<SuccessLoginResponse> {
    const isValid = validate(dto);
    if (!isValid) {
      throw ApiError.BadRequestAjv(validate.errors!);
    }

    if (await userStore.isUserNameExists(dto.userName)) {
      throw ApiError.BadRequest([{ field: 'userName', msg: 'username already exists' }]);
    }

    dto.password = await bcrypt.hash(dto.password + passwordPepper, saltRound);
    dto.userName = dto.userName.toLowerCase();

    const user = await userStore.create(dto);
    return this.loginResponse(user);
  }

  async login({ userName, password }: LoginCredentials): Promise<SuccessLoginResponse> {
    if (!userName || typeof userName != 'string' || !password || typeof password != 'string') {
      throw ApiError.BadRequestSimple('Please Enter Valid Username and Password');
    }
    userName = userName.toLowerCase();
    const user = await userStore.getByUserName(userName);
    if (!user) {
      throw ApiError.BadRequest([{ field: 'userName', msg: 'username not exists' }]);
    }

    const valid = await bcrypt.compare(password + passwordPepper, user.password);

    if (!valid) {
      throw ApiError.BadRequest([{ field: 'password', msg: 'invalid password' }]);
    }

    return this.loginResponse(user);
  }

  private loginResponse(user: UserDto): SuccessLoginResponse {
    return {
      id: user.id,
      name: user.firstName.trim() + (user.lastName ? ' ' + user.lastName.trim() : ''),
      token: this.generateToken({ id: user.id, firstName: user.firstName, lastName: user.lastName }),
    };
  }

  private generateToken(dto: Omit<ShowUserDto, 'userName'>): string {
    return jwt.sign(dto, jwtKey, { subject: dto.id.toString(), algorithm: 'HS256', expiresIn: jwtExpiresIn });
  }

  validateToken(token: string): Promise<ShowUserDto> {
    return new Promise<ShowUserDto>((resolve, reject) => {
      jwt.verify(token, jwtKey, { algorithms: ['HS256'] }, (error: any, user: any) => {
        if (error) {
          logger.info('Forbidden - UnAuthorized:JWT Validation', { error });
          return reject(ApiError.Forbidden());
        }

        resolve(user as ShowUserDto);
      });
    });
  }
}

export default new UserService();
