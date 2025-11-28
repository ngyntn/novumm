const { z } = require("zod");

const createArticle = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Tiêu đề là bắt buộc" })
      .min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
    content: z
      .string({ required_error: "Nội dung là bắt buộc" })
      .min(20, "Nội dung phải có ít nhất 20 ký tự"),
    tags: z.string().optional(),
    readTimeMinutes: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 5))
      .pipe(z.number().min(1, "Thời gian đọc phải ít nhất 1 phút")),
  }),
});

const getArticleBySlug = z.object({
  params: z.object({
    slug: z.string({ required_error: "Slug là bắt buộc" }),
  }),
});

const getArticles = z.object({
  query: z.object({
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

const getRecommendedArticles = z.object({
  query: z.object({
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

const getSearchArticles = z.object({
  query: z.object({
    page: z.preprocess(
      (val) => (val ? parseInt(val, 10) : 1),
      z.number().min(1).default(1)
    ),
    limit: z.preprocess(
      (val) => (val ? parseInt(val, 10) : 10),
      z.number().min(1).max(100).default(10)
    ),
    // query: z.preprocess(
    //   (val) => (val ? String(val) : "" ),
    // )
  }),
});

const updateArticle = z.object({
  params: z.object({
    id: z.string({ required_error: "ID bài viết là bắt buộc" }),
  }),
  body: z.object({
    title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự").optional(),
    content: z.string().min(20, "Nội dung phải có ít nhất 20 ký tự").optional(),
    tags: z.string().optional(),
  }),
});

const deleteArticle = z.object({
  params: z.object({
    id: z.string({ required_error: "ID bài viết là bắt buộc" }),
  }),
});

const getRelatedArticles = z.object({
  query: z.object({
    page: z.preprocess(
      (val) => (val ? parseInt(val, 10) : 1),
      z.number().min(1).default(1)
    ),
    limit: z.preprocess(
      (val) => (val ? parseInt(val, 10) : 3),
      z.number().min(1).max(10).default(3)
    ),
    tagIds: z
      .string({ required_error: "tagIds là bắt buộc" })
      .regex(
        /^(\d+,)*\d+$/,
        'tagIds phải là chuỗi số, cách nhau bằng dấu phẩy. Ví dụ: "1,2,3"'
      ),
    excludeId: z.preprocess(
      (val) => (val ? parseInt(val, 10) : 0),
      z.number().min(0).default(0)
    ),
  }),
});

const getAuthorArticles = z.object({
  query: z.object({
    page: z.preprocess(
      (val) => (val ? parseInt(val, 10) : 1),
      z.number().min(1).default(1)
    ),
    limit: z.preprocess(
      (val) => (val ? parseInt(val, 10) : 3),
      z.number().min(1).max(10).default(3)
    ),
    authorId: z
      .string({ required_error: "authorId là bắt buộc" })
      .regex(/^\d+$/, "authorId phải là một số"),
    excludeId: z.preprocess(
      (val) => (val ? parseInt(val, 10) : 0),
      z.number().min(0).default(0)
    ),
  }),
});

const interactArticle = z.object({
  params: z.object({
    id: z
      .string({ required_error: "ID bài viết là bắt buộc" })
      .regex(/^\d+$/, "ID bài viết phải là một số"),
  }),
});

module.exports = {
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleBySlug,
  getArticles,
  getRecommendedArticles,
  getSearchArticles,
  getRelatedArticles,
  getAuthorArticles,
  interactArticle,
};
