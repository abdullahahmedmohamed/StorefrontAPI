import { StatusCode } from '../../constants';
import ApiError from '../../errors/ApiError';
import userService from './userService';

describe('UserService Tests', () => {
  let userId: number;
  const user: CreateUserDto = {
    firstName: 'Abdo',
    lastName: 'Other Name',
    userName: 'abdo',
    password: 'Abdo123',
  };
  describe('[register] method tests', () => {
    it('Should Create New User And Return UserId, Full Name, ValidToken', async () => {
      const result = await userService.register({ ...user });
      const decodedUser = await userService.validateToken(result.token);
      userId = result.id;
      expect(result.id).toBeGreaterThan(0);
      expect(result.name).toEqual(user.firstName.trim() + ' ' + user.lastName?.trim());
      expect(decodedUser.id).toEqual(result.id);
    });

    describe('[userName] validation rules', () => {
      it('UNIQUE', async () => {
        await expectAsync(
          userService.register({
            firstName: 'Abdo222',
            lastName: 'Other Name222',
            userName: user.userName,
            password: 'Abdo1232222',
          })
        ).toBeRejected();
      });

      it('required', async () => {
        const { userName, ...input } = user;
        await expectAsync(userService.register(input as any)).toBeRejected();
      });

      it('min length 3 characters', async () => {
        const input = { ...user, userName: 'ab' };
        await expectAsync(userService.register(input)).toBeRejected();
      });

      it('max length 50 characters', async () => {
        const input = { ...user, userName: 'a'.repeat(51) };
        await expectAsync(userService.register(input)).toBeRejected();
      });
    });

    describe('[firstName] validation rules', () => {
      it('required', async () => {
        const { firstName, ...input } = user;
        await expectAsync(userService.register(input as any)).toBeRejected();
      });

      it('min length 3 characters', async () => {
        const input = { ...user, firstName: 'ab' };
        await expectAsync(userService.register(input)).toBeRejected();
      });

      it('max length 50 characters', async () => {
        const input = { ...user, firstName: 'a'.repeat(51) };
        await expectAsync(userService.register(input)).toBeRejected();
      });
    });

    describe('[password] validation rules', () => {
      it('required', async () => {
        const { password, ...input } = user;
        await expectAsync(userService.register(input as any)).toBeRejected();
      });

      it('min length 6 characters', async () => {
        const input = { ...user, password: '12345' };
        await expectAsync(userService.register(input)).toBeRejected();
      });

      it('max length 16 characters', async () => {
        const input = { ...user, password: 'a'.repeat(17) };
        await expectAsync(userService.register(input)).toBeRejected();
      });
    });
  });

  describe('[login] method tests', () => {
    it('Should Login with valid userName and password', async () => {
      const result = await userService.login({ userName: user.userName, password: user.password });
      const decodedUser = await userService.validateToken(result.token);
      expect(result.id).toBeGreaterThan(0);
      expect(result.name).toEqual(user.firstName.trim() + ' ' + user.lastName?.trim());
      expect(decodedUser.id).toEqual(result.id);
    });

    it('userName is required', async () => {
      await expectAsync(userService.login({ password: user.password } as any)).toBeRejected();
    });

    it('password is required', async () => {
      await expectAsync(userService.login({ userName: user.userName } as any)).toBeRejected();
    });

    it('Should Not Login with valid userName and invalid password', async () => {
      await expectAsync(
        userService.login({ userName: user.userName, password: user.password + 'sasda' })
      ).toBeRejected();
    });

    it('Should Not Login with invalid userName and valid password', async () => {
      await expectAsync(
        userService.login({ userName: user.userName + 'sa2da', password: user.password })
      ).toBeRejected();
    });
  });

  describe('[show] method tests', () => {
    it('Should return user by id without its password', async () => {
      const result = await userService.show(userId);
      expect(result).toEqual({
        firstName: user.firstName,
        lastName: user.lastName,
        id: userId,
        userName: user.userName,
      });
    });

    it('Should throw NotFound error if userId not exists', async () => {
      try {
        await userService.show(985000);
        expect(0).toEqual(1);
      } catch (error) {
        if (!(error instanceof ApiError)) throw error;
        expect(error.statusCode).toEqual(StatusCode.NotFound);
      }
    });
  });
});
