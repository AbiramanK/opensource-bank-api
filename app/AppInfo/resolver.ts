import { Field, ObjectType, Query, Resolver } from "type-graphql";

@ObjectType()
export class AppInfo {
  @Field()
  appName!: String;

  @Field()
  appVersion!: string;
}

@Resolver()
class AppInfoResolver {
  @Query(() => AppInfo)
  async info() {
    return {
      appName: process.env.NODE_APP_NAME,
      appVersion: process.env.NODE_APP_VERSION,
    };
  }
}
