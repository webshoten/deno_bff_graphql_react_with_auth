// Deno KVの初期化と初期データ投入

import { getUserRepository } from "./users.ts";
import { getPostRepository } from "./posts.ts";
import { getWordRepository } from "./word.ts";

let kv: Deno.Kv | null = null;

// KVストアを取得（シングルトン）
export async function getKv(): Promise<Deno.Kv> {
  if (!kv) {
    kv = await Deno.openKv();
  }
  return kv;
}

// 初期データを投入
export async function initializeData() {
  const kv = await getKv();
  const userRepo = getUserRepository(kv);
  const postRepo = getPostRepository(kv);
  const wordRepo = getWordRepository(kv);

  // 既にデータが存在するかチェック
  const existingUsers = await userRepo.getAll();
  if (existingUsers.length > 0) {
    console.log("📦 初期データは既に投入済みです");
  } else {
    console.log("📦 初期データを投入中...");

    // Usersの初期データ
    await userRepo.create({ id: "1", name: "Taro" });
    await userRepo.create({ id: "2", name: "Hanako" });
    await userRepo.create({ id: "3", name: "SABURO" });
  }

  const existingPosts = await postRepo.getAll();
  if (existingPosts.length > 0) {
    console.log("📦 初期データは既に投入済みです");
  } else {
    // Postsの初期データ
    await postRepo.create({
      id: "1",
      title: "First Post",
      content: "This is the first post",
    });
    await postRepo.create({
      id: "2",
      title: "Second Post",
      content: "This is the second post",
    });
  }

  const existingWords = await wordRepo.getAll();
  if (existingWords.length > 0) {
    console.log("📦 初期データは既に投入済みです");
  } else {
    // Wordsの初期データ（サンプル：10件 - 単語・慣用句）
    const words = [
      // ビジネス (business)
      {
        id: "1",
        japanese: "締め切り",
        english: ["deadline"],
        difficulty: 2,
        frequency: 1,
        situation: "business",
      },
      {
        id: "2",
        japanese: "進捗",
        english: ["progress", "status"],
        difficulty: 3,
        frequency: 1,
        situation: "business",
      },
      {
        id: "3",
        japanese: "承認する",
        english: ["approve"],
        difficulty: 3,
        frequency: 1,
        situation: "business",
      },

      // 旅行 (travel)
      {
        id: "4",
        japanese: "片道",
        english: ["one way", "one-way"],
        difficulty: 2,
        frequency: 1,
        situation: "travel",
      },
      {
        id: "5",
        japanese: "往復",
        english: ["round trip", "round-trip"],
        difficulty: 3,
        frequency: 1,
        situation: "travel",
      },
      {
        id: "6",
        japanese: "乗り換え",
        english: ["transfer", "connection"],
        difficulty: 3,
        frequency: 1,
        situation: "travel",
      },

      // 日常 (daily) - 慣用句
      {
        id: "7",
        japanese: "一石二鳥",
        english: ["kill two birds with one stone"],
        difficulty: 4,
        frequency: 2,
        situation: "daily",
      },
      {
        id: "8",
        japanese: "時は金なり",
        english: ["time is money"],
        difficulty: 2,
        frequency: 2,
        situation: "daily",
      },

      // ショッピング (shopping)
      {
        id: "9",
        japanese: "割引",
        english: ["discount"],
        difficulty: 2,
        frequency: 1,
        situation: "shopping",
      },
      {
        id: "10",
        japanese: "在庫切れ",
        english: ["out of stock", "sold out"],
        difficulty: 3,
        frequency: 1,
        situation: "shopping",
      },
    ];

    for (const word of words) {
      await wordRepo.create(word);
    }

    console.log(`✅ 初期データの投入が完了しました（単語: ${words.length}件）`);
  }
}
