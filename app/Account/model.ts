import { Sequelize, sequelize } from "../../server/dbconfig";
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  HasOne,
  DataType,
} from "sequelize-typescript";
import { Field, ObjectType } from "type-graphql";
import { ACCOUNT_STATUS_TYPES } from "../../types";
import { UserModel } from "../User/model";

@Table({
  timestamps: true,
  tableName: "accounts",
  paranoid: true,
  underscored: true,
})
@ObjectType()
export class AccountModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  @Field({ nullable: false })
  public declare id?: number;

  @Column
  @ForeignKey(() => UserModel)
  @Field({ nullable: false })
  public declare user_id?: number;

  @Column({ unique: true, type: DataType.STRING(17) })
  @Field({ nullable: false })
  public declare account_number?: string;

  @Column({ defaultValue: "pre-active" })
  @Field({ nullable: false })
  public declare status?: ACCOUNT_STATUS_TYPES;

  @Column({ defaultValue: 10000 })
  @Field({ nullable: false })
  public declare daily_transaction_limit?: number;

  @Column({ defaultValue: DataType.NOW })
  @Field({ nullable: false })
  public declare created_at?: Date;

  @Column({ defaultValue: DataType.NOW })
  @Field({ nullable: false })
  public declare updated_at?: Date;

  @Column({ defaultValue: null })
  @Field({ nullable: true })
  public declare deleted_at?: Date;

  @Field({ nullable: false })
  @HasOne(() => UserModel, { foreignKey: "id", sourceKey: "user_id" })
  public declare user?: UserModel;
}

sequelize.addModels([AccountModel]);

UserModel.hasMany(AccountModel, {
  as: "accounts",
  foreignKey: "user_id",
  sourceKey: "id",
});
