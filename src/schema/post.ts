import { builder, requireAuth } from "./builder.ts";
import { getKv } from "../kv/index.ts";
import { getPostRepository } from "../kv/posts.ts";

// Post 型参照
const PostRef = builder.objectRef<
  { id: string; title: string; content: string }
>("Post");

// Post 型
PostRef.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    content: t.exposeString("content"),
  }),
});

// Post Query
builder.queryFields((t) => ({
  posts: t.field({
    type: [PostRef],
    resolve: async (_, __, context) => {
      requireAuth(context);
      const kv = await getKv();
      const postRepo = getPostRepository(kv);
      return await postRepo.getAll();
    },
  }),
  post: t.field({
    type: PostRef,
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_, args, context) => {
      requireAuth(context);
      const kv = await getKv();
      const postRepo = getPostRepository(kv);
      return await postRepo.getById(String(args.id));
    },
  }),
  postCount: t.field({
    type: "Int",
    resolve: async (_, __, context) => {
      requireAuth(context);
      const kv = await getKv();
      const postRepo = getPostRepository(kv);
      return await postRepo.count();
    },
  }),
}));

