// WordのKVS操作

export type LearningHistory = {
  id: string;
  userId: string;
  wordId: string;
  learningType: string;
};

export function getLearningHistoryRepository(kv: Deno.Kv) {
  const prefix = ["learningHistory"];

  return {
    async getAll(): Promise<LearningHistory[]> {
      const learningHistories: LearningHistory[] = [];
      for await (const entry of kv.list<LearningHistory>({ prefix })) {
        learningHistories.push(entry.value);
      }
      return learningHistories;
    },

    async getById(id: string): Promise<LearningHistory | null> {
      const key = [...prefix, id];
      const result = await kv.get<LearningHistory>(key);
      return result.value;
    },

    async getByUserId(userId: string): Promise<LearningHistory[]> {
      const learningHistories: LearningHistory[] = [];
      for await (const entry of kv.list<LearningHistory>({ prefix })) {
        learningHistories.push(entry.value);
      }
      const learningHistoriesByUserId = learningHistories.filter((
        learningHistory,
      ) => learningHistory.userId === userId);
      return learningHistoriesByUserId;
    },

    async create(learningHistory: LearningHistory): Promise<void> {
      const key = [...prefix, learningHistory.id];
      await kv.set(key, learningHistory);
    },

    async update(learningHistory: LearningHistory): Promise<void> {
      const key = [...prefix, learningHistory.id];
      await kv.set(key, learningHistory);
    },

    async delete(id: string): Promise<void> {
      const key = [...prefix, id];
      await kv.delete(key);
    },

    async count(): Promise<number> {
      let count = 0;
      for await (const _entry of kv.list({ prefix })) {
        count++;
      }
      return count;
    },
  };
}
