// 認証ユーザーのKVS操作

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// 認証ユーザー作成時の入力型
export type CreateAuthUserInput = {
  name: string;
  email: string;
  passwordHash: string;
};

export function getAuthUserRepository(kv: Deno.Kv) {
  const prefix = ["auth_users"];

  return {
    // 全ユーザーを取得
    async getAll(): Promise<AuthUser[]> {
      const users: AuthUser[] = [];
      for await (const entry of kv.list<AuthUser>({ prefix })) {
        // by_emailインデックスを除外
        if (entry.key.length === 2) {
          users.push(entry.value);
        }
      }
      return users;
    },

    // IDでユーザーを取得
    async getById(id: string): Promise<AuthUser | null> {
      const key = [...prefix, id];
      const result = await kv.get<AuthUser>(key);
      return result.value;
    },

    // メールアドレスでユーザーを取得
    async getByEmail(email: string): Promise<AuthUser | null> {
      const emailIndexKey = [...prefix, "by_email", email];
      const result = await kv.get<string>(emailIndexKey);
      if (!result.value) {
        return null;
      }
      return await this.getById(result.value);
    },

    // ユーザーを作成
    async create(input: CreateAuthUserInput): Promise<AuthUser> {
      const id = crypto.randomUUID();
      const now = new Date();
      const user: AuthUser = {
        id,
        name: input.name,
        email: input.email,
        passwordHash: input.passwordHash,
        emailVerified: false,
        createdAt: now,
        updatedAt: now,
      };
      const key = [...prefix, id];
      const emailIndexKey = [...prefix, "by_email", input.email];

      // ユーザーとメールインデックスを同時に保存
      await kv.atomic()
        .set(key, user)
        .set(emailIndexKey, id)
        .commit();

      return user;
    },

    // ユーザーを更新
    async update(user: AuthUser): Promise<void> {
      const key = [...prefix, user.id];
      user.updatedAt = new Date();
      await kv.set(key, user);
    },

    // メール認証状態を更新
    async updateEmailVerified(id: string, verified: boolean): Promise<void> {
      const user = await this.getById(id);
      if (!user) {
        throw new Error(`AuthUser with id ${id} not found`);
      }
      user.emailVerified = verified;
      user.updatedAt = new Date();
      const key = [...prefix, id];
      await kv.set(key, user);
    },

    // ユーザーを削除
    async delete(id: string): Promise<void> {
      const user = await this.getById(id);
      if (!user) {
        return;
      }
      const key = [...prefix, id];
      const emailIndexKey = [...prefix, "by_email", user.email];

      // ユーザーとメールインデックスを同時に削除
      await kv.atomic()
        .delete(key)
        .delete(emailIndexKey)
        .commit();
    },

    // ユーザー数を取得
    async count(): Promise<number> {
      let count = 0;
      for await (const entry of kv.list({ prefix })) {
        // by_emailインデックスを除外
        if (entry.key.length === 2) {
          count++;
        }
      }
      return count;
    },
  };
}
