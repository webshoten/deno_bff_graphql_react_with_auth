import { builder, requireAuth } from "./builder.ts";
import { getKv } from "../../core/kv/index.ts";
import { getWordRepository } from "../../core/kv/word.ts";
import { getLearningHistoryRepository } from "../../core/kv/learningHistory.ts";

// Word 型参照
const WordRef = builder.objectRef<
  {
    id: string;
    japanese: string;
    english: string[];
    difficulty: number;
    frequency: number;
    situation: string;
  }
>("Word");

// Word 型
WordRef.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    japanese: t.exposeString("japanese"),
    english: t.exposeStringList("english"),
    difficulty: t.exposeInt("difficulty"),
    frequency: t.exposeInt("frequency"),
    situation: t.exposeString("situation"),
  }),
});

// Word Query
builder.queryFields((t) => ({
  words: t.field({
    type: [WordRef],
    resolve: async (_, __, context) => {
      requireAuth(context);
      const kv = await getKv();
      const wordRepo = getWordRepository(kv);
      return await wordRepo.getAll();
    },
  }),
  wordsByDifficulty: t.field({
    type: [WordRef],
    args: {
      difficulty: t.arg.int({ required: true }),
    },
    resolve: async (_, args, context) => {
      requireAuth(context);
      const kv = await getKv();
      const wordRepo = getWordRepository(kv);
      return await wordRepo.getByDifficulty(args.difficulty);
    },
  }),
  // 学習回数が少ない単語を取得（学習用）
  wordsForStudy: t.field({
    type: [WordRef],
    args: {
      userId: t.arg.id({ required: true }),
      limit: t.arg.int({ required: false }),
    },
    resolve: async (_, args, context) => {
      requireAuth(context);
      const kv = await getKv();
      const wordRepo = getWordRepository(kv);
      const learningHistoryRepo = getLearningHistoryRepository(kv);

      // 全単語と学習履歴を取得
      const words = await wordRepo.getAll();
      const histories = await learningHistoryRepo.getByUserId(
        String(args.userId),
      );

      // 各単語の学習回数をカウント
      const wordStudyCount = new Map<string, number>();
      for (const word of words) {
        const count = histories.filter((h) => h.wordId === word.id).length;
        wordStudyCount.set(word.id, count);
      }

      // 学習回数が少ない順にソート
      words.sort((a, b) => {
        return (wordStudyCount.get(a.id) || 0) -
          (wordStudyCount.get(b.id) || 0);
      });

      return words.slice(0, args.limit ?? 12);
    },
  }),
}));

