import { Op, where } from "sequelize";

import { USER_TYPES } from "../../types";
import { UserModel } from "./model";

export const isUserExist = async (email: string, user_name?: string) => {
  try {
    const result = await UserModel?.findOne({
      where: { [Op?.or]: [{ email }, { user_name: user_name ?? email }] },
    });

    if (!!result) {
      return result;
    }

    return false;
  } catch (error: any) {
    console.error("user exist check error: ", error?.message);
    throw new Error(error?.message);
  }
};

export const createUser = async (
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  user_name: string,
  type: USER_TYPES,
  address?: string,
  mobile_number?: string
) => {
  try {
    const result = await UserModel.create({
      first_name,
      last_name,
      email,
      password,
      user_name,
      type,
      address,
      mobile_number,
    });

    if (!!result) {
      return result;
    }

    throw new Error("Somthing went wrong, Please try again later!");
  } catch (error: any) {
    console.error("Create user: ", error?.message);
    throw new Error(error?.message);
  }
};
