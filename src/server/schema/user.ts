import { builder, requireAuth } from "./builder.ts";
import { getKv } from "../../core/kv/index.ts";
import { getUserRepository, type User } from "../../core/kv/users.ts";

// User 型参照
const UserRef = builder.objectRef<{ id: string; name: string }>("User");

// User 型
UserRef.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
  }),
});

// User Query
builder.queryFields((t) => ({
  users: t.field({
    type: [UserRef],
    resolve: async (_, __, context) => {
      requireAuth(context);
      const kv = await getKv();
      const userRepo = getUserRepository(kv);
      return await userRepo.getAll();
    },
  }),
  user: t.field({
    type: UserRef,
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_, args, context) => {
      requireAuth(context);
      const kv = await getKv();
      const userRepo = getUserRepository(kv);
      return await userRepo.getById(String(args.id));
    },
  }),
}));

// User Mutation
builder.mutationFields((t) => ({
  createUser: t.field({
    type: UserRef,
    args: {
      name: t.arg.string({ required: true }),
    },
    resolve: async (_, args, context) => {
      requireAuth(context);
      const kv = await getKv();
      const userRepo = getUserRepository(kv);

      // IDを生成（既存の最大ID + 1）
      const existingUsers = await userRepo.getAll();
      let maxId = 0;
      for (const user of existingUsers) {
        const userId = parseInt(user.id, 10);
        if (!isNaN(userId) && userId > maxId) {
          maxId = userId;
        }
      }
      const id = (maxId + 1).toString();

      const user: User = {
        id,
        name: args.name,
      };

      await userRepo.create(user);
      return user;
    },
  }),
  deleteUser: t.field({
    type: UserRef,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_, args, context) => {
      requireAuth(context);
      const kv = await getKv();
      const userRepo = getUserRepository(kv);

      const user = await userRepo.getById(String(args.id));
      if (!user) {
        throw new Error(`User with id ${args.id} not found`);
      }

      await userRepo.delete(String(args.id));
      return user;
    },
  }),
}));

// 型定義をエクスポート（クライアントで使用）
export type UserType = User;

export type QueryType = {
  users: UserType[];
  user: UserType | null;
};

export type QueryUserArgs = {
  id: string;
};

// クエリ名の型
export type QueryName = "users" | "user";

// クエリの引数の型マップ
export type QueryArgsMap = {
  users: never;
  user: QueryUserArgs;
};

// クエリの戻り値の型マップ
export type QueryResultMap = {
  users: UserType[];
  user: UserType | null;
};

