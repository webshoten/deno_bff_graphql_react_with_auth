import { builder, requireAuth } from "./builder.ts";
import { getKv } from "../../core/kv/index.ts";
import { getLearningHistoryRepository } from "../../core/kv/learningHistory.ts";
import { getWordRepository } from "../../core/kv/word.ts";

// デバッグ用の結果型
const DebugResultRef = builder.objectRef<{
  success: boolean;
  message: string;
  count: number;
}>("DebugResult");

DebugResultRef.implement({
  fields: (t) => ({
    success: t.exposeBoolean("success"),
    message: t.exposeString("message"),
    count: t.exposeInt("count"),
  }),
});

// 学習履歴詳細型（Word情報付き）
const LearningHistoryDetailRef = builder.objectRef<{
  id: string;
  wordId: string;
  wordJapanese: string;
  wordEnglish: string[];
  learningType: string;
  userId: string;
}>("LearningHistoryDetail");

LearningHistoryDetailRef.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    wordId: t.exposeID("wordId"),
    wordJapanese: t.exposeString("wordJapanese"),
    wordEnglish: t.exposeStringList("wordEnglish"),
    learningType: t.exposeString("learningType"),
    userId: t.exposeID("userId"),
  }),
});

// Debug Query
builder.queryFields((t) => ({
  // 学習履歴の件数を取得
  learningHistoryCount: t.field({
    type: "Int",
    args: {
      userId: t.arg.id({ required: false }),
    },
    resolve: async (_, args, context) => {
      requireAuth(context);
      const kv = await getKv();
      const learningHistoryRepo = getLearningHistoryRepository(kv);

      if (args.userId) {
        const histories = await learningHistoryRepo.getByUserId(
          String(args.userId),
        );
        return histories.length;
      }

      return await learningHistoryRepo.count();
    },
  }),

  // 学習履歴一覧を取得（Word情報付き）
  learningHistoryList: t.field({
    type: [LearningHistoryDetailRef],
    args: {
      userId: t.arg.id({ required: false }),
      limit: t.arg.int({ required: false }),
    },
    resolve: async (_, args, context) => {
      requireAuth(context);
      const kv = await getKv();
      const learningHistoryRepo = getLearningHistoryRepository(kv);
      const wordRepo = getWordRepository(kv);

      // 学習履歴を取得
      let histories = args.userId
        ? await learningHistoryRepo.getByUserId(String(args.userId))
        : await learningHistoryRepo.getAll();

      // 件数制限
      if (args.limit) {
        histories = histories.slice(0, args.limit);
      }

      // Word情報を付与
      const words = await wordRepo.getAll();
      const wordMap = new Map(words.map((w) => [w.id, w]));

      return histories.map((h) => {
        const word = wordMap.get(h.wordId);
        return {
          id: h.id,
          wordId: h.wordId,
          wordJapanese: word?.japanese ?? "不明",
          wordEnglish: word?.english ?? [],
          learningType: h.learningType,
          userId: h.userId,
        };
      });
    },
  }),
}));

// Debug Mutation
builder.mutationFields((t) => ({
  // 学習履歴をリセット（全件 or ユーザー単位）
  resetLearningHistory: t.field({
    type: DebugResultRef,
    args: {
      userId: t.arg.id({ required: false }),
    },
    resolve: async (_, args, context) => {
      requireAuth(context);
      const kv = await getKv();
      const learningHistoryRepo = getLearningHistoryRepository(kv);

      let deletedCount = 0;

      if (args.userId) {
        // ユーザー単位でリセット
        const histories = await learningHistoryRepo.getByUserId(
          String(args.userId),
        );
        for (const history of histories) {
          await learningHistoryRepo.delete(history.id);
          deletedCount++;
        }
        return {
          success: true,
          message: `ユーザー ${args.userId} の学習履歴をリセットしました`,
          count: deletedCount,
        };
      } else {
        // 全件リセット
        const histories = await learningHistoryRepo.getAll();
        for (const history of histories) {
          await learningHistoryRepo.delete(history.id);
          deletedCount++;
        }
        return {
          success: true,
          message: "全ての学習履歴をリセットしました",
          count: deletedCount,
        };
      }
    },
  }),
}));

