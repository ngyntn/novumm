const { z } = require("zod");

const createComment = z.object({
  body: z.object({
    articleId: z.number({ required_error: "ID bài viết là bắt buộc" }).int(),
    content: z
      .string({ required_error: "Nội dung bình luận là bắt buộc" })
      .min(1, "Nội dung không được để trống"),
    parentId: z.number().int().nullable(),
  }),
});

const getComments = z.object({
  query: z.object({
    articleId: z.preprocess(
      (val) => (val ? parseInt(val, 10) : undefined),
      z.number({ required_error: "articleId là bắt buộc" })
    ),
    page: z.preprocess(
      (val) => (val ? parseInt(val, 10) : 1),
      z.number().min(1).default(1)
    ),
    limit: z.preprocess(
      (val) => (val ? parseInt(val, 10) : 10),
      z.number().min(1).max(100).default(10)
    ),
  }),
});

const getReplies = z.object({
  params: z.object({
    id: z.preprocess(
      (val) => parseInt(val, 10),
      z.number().int().min(1, "ID bình luận cha là bắt buộc")
    ),
  }),
  query: z.object({
    page: z.preprocess(
      (val) => (val ? parseInt(val, 10) : 1),
      z.number().min(1).default(1)
    ),
    limit: z.preprocess(
      (val) => (val ? parseInt(val, 10) : 5),
      z.number().min(1).max(100).default(5)
    ),
  }),
});

const updateComment = z.object({
  params: z.object({
    id: z.preprocess(
      (val) => parseInt(val, 10),
      z.number().int().min(1, "ID bình luận là bắt buộc")
    ),
  }),
  body: z.object({
    content: z
      .string({ required_error: "Nội dung là bắt buộc" })
      .min(1, "Nội dung không được để trống"),
  }),
});

const deleteComment = z.object({
  params: z.object({
    id: z.preprocess(
      (val) => parseInt(val, 10),
      z.number().int().min(1, "ID bình luận là bắt buộc")
    ),
  }),
});

module.exports = {
  createComment,
  getComments,
  getReplies,
  updateComment,
  deleteComment,
};
