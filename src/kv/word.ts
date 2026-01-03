// WordのKVS操作

export type Word = {
  id: string;
  japanese: string;
  english: string[];
  difficulty: number; // 1-5（難易度）
  frequency: number; // 使用頻度
  situation: string; // シチュエーション（場面）
};

export function getWordRepository(kv: Deno.Kv) {
  const prefix = ["words"];

  return {
    // 全ワードを取得
    async getAll(): Promise<Word[]> {
      const words: Word[] = [];
      for await (const entry of kv.list<Word>({ prefix })) {
        words.push(entry.value);
      }
      return words;
    },

    // IDでワードを取得
    async getById(id: string): Promise<Word | null> {
      const key = [...prefix, id];
      const result = await kv.get<Word>(key);
      return result.value;
    },

    // ワードを作成
    async create(word: Word): Promise<void> {
      const key = [...prefix, word.id];
      await kv.set(key, word);
    },

    // ユーザーを更新
    async update(word: Word): Promise<void> {
      const key = [...prefix, word.id];
      await kv.set(key, word);
    },

    // ワードを削除
    async delete(id: string): Promise<void> {
      const key = [...prefix, id];
      await kv.delete(key);
    },

    // ワード数を取得
    async count(): Promise<number> {
      let count = 0;
      for await (const _entry of kv.list({ prefix })) {
        count++;
      }
      return count;
    },

    // 難易度でワードを取得
    async getByDifficulty(difficulty: number): Promise<Word[]> {
      const words: Word[] = [];
      for await (
        const entry of kv.list<Word>({
          prefix,
        })
      ) {
        words.push(entry.value);
      }
      return words.filter((word) => word.difficulty === difficulty);
    },
  };
}
