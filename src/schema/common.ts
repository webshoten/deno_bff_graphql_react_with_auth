import { builder } from "./builder.ts";

// 共通Query（認証不要なテスト用など）
builder.queryFields((t) => ({
  // 現在のログインユーザーを取得
  me: t.field({
    type: "String",
    nullable: true,
    resolve: (_, __, context) => {
      return context.currentUser?.email ?? null;
    },
  }),
  // テスト用クエリ
  test10: t.field({
    type: "String",
    resolve: () => {
      return "testっっっっs";
    },
  }),
}));


