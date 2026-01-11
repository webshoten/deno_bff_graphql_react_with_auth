import SchemaBuilder from "@pothos/core";
import type { DecodedToken } from "../firebase/verify-token.ts";

// GraphQL コンテキスト型
export type GraphQLContext = {
  currentUser: DecodedToken | null;
  baseUrl: string;
};

// 認証チェック（未認証ならエラー）
export function requireAuth(context: GraphQLContext): DecodedToken {
  if (!context.currentUser) {
    throw new Error("認証が必要です");
  }
  return context.currentUser;
}

export const builder = new SchemaBuilder<{ Context: GraphQLContext }>({});

// Query型の基盤を定義（他のファイルで拡張する）
builder.queryType({});

// Mutation型の基盤を定義（他のファイルで拡張する）
builder.mutationType({});

