import { Sequelize, sequelize } from "../../server/dbconfig";
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import { Field, ObjectType } from "type-graphql";
import { USER_TYPES } from "./../../types";
@Table({
  timestamps: true,
  tableName: "users",
  paranoid: true,
  underscored: true,
})
@ObjectType()
export class UserModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  @Field({ nullable: false })
  public declare id?: number;

  @Column
  @Field({ nullable: false })
  public declare first_name?: string;

  @Column
  @Field({ nullable: false })
  public declare last_name?: string;

  @Column
  @Field({ nullable: false })
  public declare email?: string;

  @Column
  public declare password?: string;

  @Column
  @Field({ nullable: false })
  public declare user_name?: string;

  @Column
  @Field({ nullable: false })
  public declare type?: USER_TYPES;

  @Column({ defaultValue: true })
  @Field({ nullable: false })
  public declare is_active?: boolean;

  @Column({ defaultValue: null })
  @Field({ nullable: true })
  public declare address?: string;

  @Column({ defaultValue: null })
  @Field({ nullable: true })
  public declare mobile_number?: string;

  @Column({ defaultValue: null })
  @Field({ nullable: true })
  public declare number_of_accounts?: number;

  @Column
  @Field({ nullable: false })
  public declare created_at?: Date;

  @Column
  @Field({ nullable: false })
  public declare updated_at?: Date;

  @Column
  @Field({ nullable: true })
  public declare deleted_at?: Date;
}

sequelize.addModels([UserModel]);
