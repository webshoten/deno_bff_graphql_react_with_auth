// ドメイン別スキーマをインポート（副作用でbuilderに登録される）
import "./common.ts";
import "./user.ts";
import "./post.ts";
import "./word.ts";
import "./learning.ts";

// 最後にbuilderをインポートしてスキーマを生成
import { builder } from "./builder.ts";

export const schema = builder.toSchema({});

// 型定義を再エクスポート
export type { GraphQLContext } from "./builder.ts";
export type {
  QueryArgsMap,
  QueryName,
  QueryResultMap,
  QueryType,
  QueryUserArgs,
  UserType,
} from "./user.ts";
