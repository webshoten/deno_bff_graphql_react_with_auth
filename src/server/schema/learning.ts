import { builder, requireAuth } from "./builder.ts";
import { getKv } from "../../core/kv/index.ts";
import { getLearningHistoryRepository } from "../../core/kv/learningHistory.ts";

// LearningType Enum
const LearningTypeEnum = builder.enumType("LearningType", {
  values: {
    passiveLearning: { value: "passiveLearning" },
    choiceTest: { value: "choiceTest" },
    writingTest: { value: "writingTest" },
  } as const,
});

// LearningHistory 型参照
const LearningHistoryRef = builder.objectRef<
  { id: string; userId: string; wordId: string; learningType: string }
>("LearningHistory");

// LearningHistory 型
LearningHistoryRef.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    userId: t.exposeID("userId"),
    wordId: t.exposeID("wordId"),
    learningType: t.exposeString("learningType"),
  }),
});

// Learning Mutation
builder.mutationFields((t) => ({
  createLearningHistory: t.field({
    type: [LearningHistoryRef],
    args: {
      userId: t.arg.id({ required: true }),
      wordId: t.arg.id({ required: true }),
      learningType: t.arg({ type: LearningTypeEnum, required: true }),
    },
    resolve: async (_, args, context) => {
      requireAuth(context);
      const kv = await getKv();
      const learningHistoryRepo = getLearningHistoryRepository(kv);

      await learningHistoryRepo.create({
        id: crypto.randomUUID(),
        userId: args.userId,
        wordId: args.wordId,
        learningType: args.learningType,
      });

      const learningHistory = await learningHistoryRepo.getByUserId(
        args.userId,
      );
      return learningHistory;
    },
  }),
}));

