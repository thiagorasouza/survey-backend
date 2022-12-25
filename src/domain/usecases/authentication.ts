import { AuthenticationModel } from "../models/authentication";

export interface AuthenticationRequestModel {
  email: string;
  password: string;
}

export type AuthenticationResponseModel = AuthenticationModel;

export interface Authentication {
  auth(
    authentication: AuthenticationRequestModel
  ): Promise<AuthenticationResponseModel>;
}
