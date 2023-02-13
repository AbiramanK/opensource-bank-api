import { AuthChecker, ResolverData } from "type-graphql";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AUTH_TOKEN_SECRET } from "../constants";
import { isUserExist } from "../app/User/doa";
import { BaseContext } from "apollo-server-types";
import { UserModel } from "../app/User/model";

export interface AuthContext extends BaseContext {
  token: string;
  user?: UserModel;
}

export const authChecker: AuthChecker<AuthContext> = async (
  { root, args, context, info }: ResolverData<AuthContext>,
  roles
) => {
  const user = await decodeToken(context?.token);

  if (roles?.length > 0 && !roles?.includes(user?.type!)) {
    throw new Error("User does not have access privileges");
  }

  context.user = user;
  return true;
};

interface AuthTokenTypes extends JwtPayload {
  email: string;
}

const decodeToken = async (token: string): Promise<UserModel> => {
  try {
    const decode: AuthTokenTypes = (await jwt.verify(
      token,
      AUTH_TOKEN_SECRET
    )) as AuthTokenTypes;

    const user = await isUserExist(decode?.email);

    if (!user) {
      throw new Error("User not autherized");
    }

    return user;
  } catch (error: any) {
    console.error("Decode token: ", error?.message);
    throw new Error(error?.message);
  }
};
