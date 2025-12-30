import SchemaBuilder from "@pothos/core";
import { getKv } from "../kv/index.ts";
import { getUserRepository, type User } from "../kv/users.ts";
import { getPostRepository } from "../kv/posts.ts";
import { type AuthUser, getAuthUserRepository } from "../kv/auth-users.ts";
import { createAuthService } from "../auth/service.ts";

// GraphQL コンテキスト型
export type GraphQLContext = {
  currentUser: AuthUser | null;
};

const builder = new SchemaBuilder<{ Context: GraphQLContext }>({});

// User 型参照
const UserRef = builder.objectRef<{ id: string; name: string }>("User");

// User 型
UserRef.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
  }),
});

// Post 型参照
const PostRef = builder.objectRef<
  { id: string; title: string; content: string }
>("Post");

// Post 型
PostRef.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    content: t.exposeString("content"),
  }),
});

// AuthUser 型参照（認証ユーザー）
const AuthUserRef = builder.objectRef<AuthUser>("AuthUser");

// AuthUser 型
AuthUserRef.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    email: t.exposeString("email"),
    emailVerified: t.exposeBoolean("emailVerified"),
    createdAt: t.field({
      type: "String",
      resolve: (user) => user.createdAt.toISOString(),
    }),
  }),
});

// AuthResult 型参照（signup/login共通）
const AuthResultRef = builder.objectRef<{
  success: boolean;
  message: string;
  user: AuthUser | null;
}>("AuthResult");

// AuthResult 型
AuthResultRef.implement({
  fields: (t) => ({
    success: t.exposeBoolean("success"),
    message: t.exposeString("message"),
    user: t.field({
      type: AuthUserRef,
      nullable: true,
      resolve: (result) => result.user,
    }),
  }),
});

// VerifyEmailResult の参照
const VerifyEmailResultRef = builder.objectRef<{
  success: boolean;
  message: string;
}>("VerifyEmailResult");

// VerifyEmailResult 型
VerifyEmailResultRef.implement({
  fields: (t) => ({
    success: t.exposeBoolean("success"),
    message: t.exposeString("message"),
  }),
});

// Query 型
builder.queryType({
  fields: (t) => ({
    // 現在のログインユーザーを取得
    me: t.field({
      type: AuthUserRef,
      nullable: true,
      resolve: (_, __, context) => {
        return context.currentUser;
      },
    }),
    users: t.field({
      type: [UserRef],
      resolve: async () => {
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
      resolve: async (_, args) => {
        const kv = await getKv();
        const userRepo = getUserRepository(kv);
        return await userRepo.getById(String(args.id));
      },
    }),
    posts: t.field({
      type: [PostRef],
      resolve: async () => {
        const kv = await getKv();
        const postRepo = getPostRepository(kv);
        return await postRepo.getAll();
      },
    }),
    post: t.field({
      type: PostRef,
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (_, args) => {
        const kv = await getKv();
        const postRepo = getPostRepository(kv);
        return await postRepo.getById(String(args.id));
      },
    }),
    postCount: t.field({
      type: "Int",
      resolve: async () => {
        const kv = await getKv();
        const postRepo = getPostRepository(kv);
        return await postRepo.count();
      },
    }),
    // 認証ユーザー一覧
    authUsers: t.field({
      type: [AuthUserRef],
      resolve: async () => {
        const kv = await getKv();
        const authUserRepo = getAuthUserRepository(kv);
        return await authUserRepo.getAll();
      },
    }),
  }),
});

// Mutation 型
builder.mutationType({
  fields: (t) => ({
    createUser: t.field({
      type: UserRef,
      args: {
        name: t.arg.string({ required: true }),
      },
      resolve: async (_, args) => {
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
      resolve: async (_, args) => {
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
    // サインアップ（ユーザー登録）
    signup: t.field({
      type: AuthResultRef,
      args: {
        name: t.arg.string({ required: true }),
        email: t.arg.string({ required: true }),
        password: t.arg.string({ required: true }),
      },
      resolve: async (_, args) => {
        const kv = await getKv();
        const authUserRepo = getAuthUserRepository(kv);
        const authService = createAuthService({ authUserRepo });

        return await authService.signup({
          name: args.name,
          email: args.email,
          password: args.password,
        });
      },
    }),
    // ログイン
    login: t.field({
      type: AuthResultRef,
      args: {
        email: t.arg.string({ required: true }),
        password: t.arg.string({ required: true }),
      },
      resolve: async (_, args) => {
        const kv = await getKv();
        const authUserRepo = getAuthUserRepository(kv);
        const authService = createAuthService({ authUserRepo });

        return await authService.login({
          email: args.email,
          password: args.password,
        });
      },
    }),
    // 認証ユーザー削除
    deleteAuthUser: t.field({
      type: AuthUserRef,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (_, args) => {
        const kv = await getKv();
        const authUserRepo = getAuthUserRepository(kv);

        const user = await authUserRepo.getById(String(args.id));
        if (!user) {
          throw new Error(`AuthUser with id ${args.id} not found`);
        }

        await authUserRepo.delete(String(args.id));
        return user;
      },
    }),
    // メール認証
    verifyEmail: t.field({
      type: VerifyEmailResultRef,
      args: {
        token: t.arg.string({ required: true }),
      },
      resolve: async (_, args) => {
        const kv = await getKv();
        const authUserRepo = getAuthUserRepository(kv);
        const authService = createAuthService({ authUserRepo });

        return await authService.verifyEmail(args.token);
      },
    }),
  }),
});

export const schema = builder.toSchema({});

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
