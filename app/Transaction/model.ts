import { Sequelize, sequelize } from "../../server/dbconfig";
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  HasOne,
  ForeignKey,
  DataType,
} from "sequelize-typescript";
import { Field, ObjectType } from "type-graphql";
import { TRANSACTION_STATUS_TYPES, TRANSACTION_TYPES } from "../../types";
import { AccountModel } from "../Account/model";

@Table({
  timestamps: true,
  tableName: "transactions",
  paranoid: true,
  underscored: true,
})
@ObjectType()
export class TransactionModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  @Field({ nullable: false })
  public declare id?: number;

  @Column
  @ForeignKey(() => AccountModel)
  @Field({ nullable: false })
  public declare account_id?: number;

  @Column
  @Field({ nullable: false })
  public declare type?: TRANSACTION_TYPES;

  @Column
  @Field({ nullable: false })
  public declare amount?: number;

  @Column
  @Field({ nullable: false })
  public declare status?: TRANSACTION_STATUS_TYPES;

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
  @HasOne(() => AccountModel, { foreignKey: "id", sourceKey: "account_id" })
  public declare account?: AccountModel;
}

sequelize.addModels([TransactionModel]);
