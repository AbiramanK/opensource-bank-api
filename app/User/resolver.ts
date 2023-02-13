import {
  Resolver,
  Mutation,
  InputType,
  ObjectType,
  Field,
  Arg,
  Authorized,
  Query,
} from "type-graphql";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser, getAllUsersWithBankAccounts, isUserExist } from "./doa";
import {
  AUTH_TOKEN_EXP,
  AUTH_TOKEN_SECRET,
  PASSWORD_ENCRYPTION_SALT_ROUNDS,
} from "./../../constants";
import { USER_TYPES } from "../../types";
import { UserModel } from "./model";
import { AccountModel } from "../Account/model";

@InputType()
class RegistrationInput {
  @Field({ nullable: false })
  firstName: string;

  @Field({ nullable: false })
  lastName: string;

  @Field({ nullable: false })
  email: string;

  @Field({ nullable: false })
  password: string;

  @Field({ nullable: false })
  userName: string;

  @Field({ nullable: false })
  type: USER_TYPES;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  mobileNumber: string;
}

@InputType()
class LoginInput {
  @Field({ nullable: false })
  email: string;

  @Field({ nullable: false })
  password: string;
}

@ObjectType()
class AuthenticationOutput {
  @Field({ nullable: false })
  id: number;

  @Field({ nullable: false })
  firstName: string;

  @Field({ nullable: false })
  lastName: string;

  @Field({ nullable: false })
  email: string;

  @Field({ nullable: false })
  userName: string;

  @Field({ nullable: false })
  type: USER_TYPES;

  @Field({ nullable: false })
  isActive: boolean;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  mobileNumber: string;

  @Field({ nullable: true })
  numberOfAccounts: number;

  @Field({ nullable: false })
  token: string;
}

@ObjectType()
class GetAllUsersWithBankAccounts extends UserModel {
  @Field(() => [AccountModel], { nullable: false })
  accounts: [AccountModel];
}

@Resolver()
export class UserResolver {
  @Mutation(() => AuthenticationOutput)
  async register(
    @Arg("input") input: RegistrationInput
  ): Promise<AuthenticationOutput> {
    const {
      firstName,
      lastName,
      email,
      password,
      type,
      userName,
      address,
      mobileNumber,
    } = input;

    if (await isUserExist(email, userName)) {
      throw new Error("User already exist!");
    }

    const token: string = jwt.sign({ email: input?.email }, AUTH_TOKEN_SECRET, {
      expiresIn: AUTH_TOKEN_EXP,
    });

    try {
      const hashedPassword: string = await bcrypt.hash(
        password,
        PASSWORD_ENCRYPTION_SALT_ROUNDS
      );

      const result = await createUser(
        firstName,
        lastName,
        email,
        hashedPassword,
        userName,
        type,
        address,
        mobileNumber
      );

      return {
        id: result?.id!,
        firstName: result?.first_name!,
        lastName: result?.last_name!,
        email: result?.email!,
        userName: result?.user_name!,
        type: result?.type!,
        isActive: result?.is_active!,
        address: result?.address! ?? "",
        mobileNumber: result?.mobile_number! ?? "",
        numberOfAccounts: result?.number_of_accounts!,
        token,
      };
    } catch (error: any) {
      console.error(`Password encryption failed: ${error?.message}`);
      throw new Error(error?.message);
    }
  }

  @Mutation(() => AuthenticationOutput)
  async login(@Arg("input") input: LoginInput): Promise<AuthenticationOutput> {
    const { email, password } = input;

    const user: UserModel | false = await isUserExist(email);
    if (!user) {
      throw new Error("User not found!");
    }

    try {
      const valid: boolean = await bcrypt.compare(password, user?.password!);
      if (valid) {
        const token: string = jwt.sign(
          { email: input?.email },
          AUTH_TOKEN_SECRET,
          { expiresIn: AUTH_TOKEN_EXP }
        );

        return {
          id: user?.id!,
          firstName: user?.first_name!,
          lastName: user?.last_name!,
          email: user?.email!,
          userName: user?.user_name!,
          type: user?.type!,
          isActive: user?.is_active!,
          address: user?.address! ?? "",
          mobileNumber: user?.mobile_number! ?? "",
          numberOfAccounts: user?.number_of_accounts!,
          token,
        };
      } else {
        throw new Error(`UserName/Email or Password is incorrect`);
      }
    } catch (error: any) {
      console.error("Password comapre failed: ", error?.message);
      throw new Error(error?.message);
    }
  }

  @Authorized("banker")
  @Query(() => [GetAllUsersWithBankAccounts])
  async get_all_users_with_bank_accounts(): Promise<
    GetAllUsersWithBankAccounts[]
  > {
    const users = (await getAllUsersWithBankAccounts()) as [
      GetAllUsersWithBankAccounts
    ];
    return users;
  }
}
