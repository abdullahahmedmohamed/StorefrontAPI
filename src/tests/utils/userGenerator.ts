import userService from '../../services/users/userService';

class UserGenerator {
  private userInfo: { id: number; bearerToken: string } | null = null;

  async getAuthenticatedUser() {
    if (this.userInfo) {
      return this.userInfo;
    }

    await this.generateNewUser();

    return this.userInfo!;
  }

  private async generateNewUser() {
    const result = await userService.register({
      firstName: 'TokenService',
      password: 'tokenservice',
      userName: 'tokenservice',
    });
    this.userInfo = {
      id: result.id,
      bearerToken: 'Bearer ' + result.token,
    };
  }
}

export default new UserGenerator();
