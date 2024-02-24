export enum UserRoleEnum {
  ROLE_ADMIN = "ROLE_ADMIN",
  ROLE_USER = "ROLE_USER",
}

export type Authority = {
  authority: UserRoleEnum;
};

export type LoginResponseData = {
  userId: number;
  authorities: Array<Authority>;
  token: String | null | undefined;
};

export type LogoutResponseData = {
  name: String;
};
