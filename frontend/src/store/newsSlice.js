import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRecommendedNews,
  fetchDetailNews,
  fetchNewsByKeySearch,
  createNews,
  updateNews,
  deleteNews,
  fetchFeedNews,
  updateArticleLike,
  toggleBookmark,
  fetchAuthorArticles,
  fetchRelatedArticlesByTag,
  fetchRecommendedNewsV2,
  fetchNewsByKeySearchV2,
} from "../api/articleApi";

import {
  fetchComments,
  postComment,
  updateComment,
  deleteComment,
} from "../api/commentApi";

const deleteCommentFromState = (comments, deletedInfo) => {
  const { id: deletedId, parentId } = deletedInfo;

  if (parentId) {
    const parent = comments.find((c) => c.id === parentId);
    if (parent && parent.replies) {
      parent.replies = parent.replies.filter((r) => r.id !== deletedId);
    }
  } else {
    return comments.filter((c) => c.id !== deletedId);
  }
  return comments;
};

const updateCommentInState = (comments, updatedComment) => {
  if (updatedComment.parentId) {
    const parent = comments.find((c) => c.id === updatedComment.parentId);
    if (parent && parent.replies) {
      parent.replies = parent.replies.map((r) =>
        r.id === updatedComment.id ? updatedComment : r
      );
    }
  } else {
    return comments.map((c) =>
      c.id === updatedComment.id ? updatedComment : c
    );
  }
  return comments;
};

const initialState = {
  items: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,

  feed: {
    items: [],
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
  },

  item: null,
  itemLoading: false,
  itemError: null,

  comments: {
    items: [],
    page: 1,
    hasMore: true,
    loading: false,
    error: null,
  },

  authorArticles: [],
  authorArticlesLoading: false,
  relatedArticles: [],
  relatedArticlesLoading: false,

  searchedItems: [],
  searchedAuthors: {},
  searchedLoading: false,
  searchedError: null,

  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    resetHomeNews: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
      state.page = 1;
      state.hasMore = true;
    },
    resetFeed: (state) => {
      state.feed.items = [];
      state.feed.loading = false;
      state.feed.error = null;
      state.feed.page = 1;
      state.feed.hasMore = true;
    },
    resetNewsDetail: (state) => {
      state.item = null;
      state.itemLoading = false;
      state.itemError = null;
      state.comments = {
        items: [],
        page: 1,
        hasMore: true,
        loading: false,
        error: null,
      };
      state.authorArticles = [];
      state.authorArticlesLoading = false;
      state.relatedArticles = [];
      state.relatedArticlesLoading = false;
    },
    resetArticleStatus: (state) => {
      state.createStatus = "idle";
      state.updateStatus = "idle";
      state.deleteStatus = "idle";
    },
    resetSearchResult: (state) => {
      state.searchedItems = [];
      state.searchedLoading = false;
      state.searchedError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Recommended News
      .addCase(fetchRecommendedNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecommendedNews.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.articles) {
          action.payload.articles.forEach((article) => {
            if (!state.items.find((item) => item.id === article.id)) {
              state.items.push(article);
            }
          });

          const { pagination } = action.payload;
          if (pagination && typeof pagination.currentPage === "number") {
            state.page = pagination.currentPage + 1;
            state.hasMore = pagination.currentPage < pagination.totalPages;
          } else {
            state.hasMore = false;
            console.error(
              "Lỗi: Dữ liệu phân trang không hợp lệ từ API (Recommended)",
              action.payload
            );
          }
        } else {
          state.hasMore = false;
        }
      })
      .addCase(fetchRecommendedNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Recommended News V2
      .addCase(fetchRecommendedNewsV2.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecommendedNewsV2.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.articles) {
          action.payload.articles.forEach((article) => {
            if (!state.items.find((item) => item.id === article.id)) {
              state.items.push(article);
            }
          });

          const { pagination } = action.payload;
          if (pagination && typeof pagination.currentPage === "number") {
            state.page = pagination.currentPage + 1;
            state.hasMore = pagination.currentPage < pagination.totalPages;
          } else {
            state.hasMore = false;
            console.error(
              "Lỗi: Dữ liệu phân trang không hợp lệ từ API (Recommended)",
              action.payload
            );
          }
        } else {
          state.hasMore = false;
        }
      })
      .addCase(fetchRecommendedNewsV2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Feed News
      .addCase(fetchFeedNews.pending, (state) => {
        state.feed.loading = true;
      })
      .addCase(fetchFeedNews.fulfilled, (state, action) => {
        state.feed.loading = false;
        action.payload.articles.forEach((article) => {
          if (!state.feed.items.find((item) => item.id === article.id)) {
            state.feed.items.push(article);
          }
        });
        state.feed.page += 1;
        state.feed.hasMore = action.payload.hasMore;
        state.feed.loading = false;
        if (action.payload && action.payload.articles) {
          action.payload.articles.forEach((article) => {
            if (!state.feed.items.find((item) => item.id === article.id)) {
              state.feed.items.push(article);
            }
          });

          const { pagination } = action.payload;
          if (pagination && typeof pagination.currentPage === "number") {
            state.feed.page = pagination.currentPage + 1;
            state.feed.hasMore = pagination.currentPage < pagination.totalPages;
          } else {
            state.feed.hasMore = false;
            console.error(
              "Lỗi: Dữ liệu phân trang không hợp lệ từ API (Feed)",
              action.payload
            );
          }
        } else {
          state.feed.hasMore = false;
        }
      })
      .addCase(fetchFeedNews.rejected, (state, action) => {
        state.feed.loading = false;
        state.feed.error = action.payload;
      })
      // Detail News
      .addCase(fetchDetailNews.pending, (state) => {
        state.itemLoading = true;
        state.itemError = null;
      })
      .addCase(fetchDetailNews.fulfilled, (state, action) => {
        state.itemLoading = false;
        state.item = action.payload;
      })
      .addCase(fetchDetailNews.rejected, (state, action) => {
        state.itemLoading = false;
        state.itemError = action.error.message;
        console.log(
          "NewsSlice.js: Error fetching detail news",
          action.error.message
        );
      })
      // Author Articles
      .addCase(fetchAuthorArticles.pending, (state) => {
        state.authorArticlesLoading = true;
      })
      .addCase(fetchAuthorArticles.fulfilled, (state, action) => {
        state.authorArticlesLoading = false;
        state.authorArticles = action.payload;
      })
      .addCase(fetchAuthorArticles.rejected, (state, action) => {
        state.authorArticlesLoading = false;
        console.error("Failed to fetch author articles:", action.payload);
      })

      //   Related Articles by Tag
      .addCase(fetchRelatedArticlesByTag.pending, (state) => {
        state.relatedArticlesLoading = true;
      })
      .addCase(fetchRelatedArticlesByTag.fulfilled, (state, action) => {
        state.relatedArticlesLoading = false;
        state.relatedArticles = action.payload;
      })
      .addCase(fetchRelatedArticlesByTag.rejected, (state, action) => {
        state.relatedArticlesLoading = false;
        console.error("Failed to fetch related articles:", action.payload);
      })
      // Create News
      .addCase(createNews.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.items.unshift(action.payload);
      })
      .addCase(createNews.rejected, (state) => {
        state.createStatus = "failed";
      })
      // Update News
      .addCase(updateNews.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.item = action.payload;
      })
      .addCase(updateNews.rejected, (state) => {
        state.updateStatus = "failed";
      })
      // Delete
      .addCase(deleteNews.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.item = null;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteNews.rejected, (state) => {
        state.deleteStatus = "failed";
      })
      // Search News
      .addCase(fetchNewsByKeySearch.pending, (state) => {
        state.searchedLoading = true;
        state.searchedError = null;
      })
      .addCase(fetchNewsByKeySearch.fulfilled, (state, action) => {
        state.searchedLoading = false;
        const { articles, authors } = action.payload;
        state.searchedItems = articles;
        state.searchedAuthors = authors;
      })
      .addCase(fetchNewsByKeySearch.rejected, (state, action) => {
        state.searchedLoading = false;
        state.searchedError = action.error.message;
        console.log(
          "NewsSlice.js: Error fetching searched news",
          action.error.message
        );
      })

      // Search News
      .addCase(fetchNewsByKeySearchV2.pending, (state) => {
        state.searchedLoading = true;
        state.searchedError = null;
      })
      .addCase(fetchNewsByKeySearchV2.fulfilled, (state, action) => {
        state.searchedLoading = false;
        console.log("Search results payload:", action.payload);
        const { articles, authors, page } = action.payload;
        console.log("Fetched articles:", articles);
        if (page && page === 1) {
          // Thay thế cho page 1
          state.searchedItems = articles;
          state.searchedAuthors = authors;
        } else {
          // Append cho page >1
          console.log("Appending articles for page:", page);
          state.searchedItems = [...state.searchedItems, ...articles];
          state.searchedAuthors = { ...state.searchedAuthors, ...authors };
        }
      })
      .addCase(fetchNewsByKeySearchV2.rejected, (state, action) => {
        state.searchedLoading = false;
        state.searchedError = action.error.message;
        console.log(
          "NewsSlice.js: Error fetching searched news",
          action.error.message
        );
      })
      // Article Like
      .addCase(updateArticleLike.fulfilled, (state, action) => {
        if (state.item && state.item.id === action.payload.id) {
          state.item.likeCount = action.payload.likeCount;
        }
      })
      // Bookmark
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        if (state.article) {
          state.article.isBookmarked = action.payload.isBookmarked;
        }
      })
      .addCase(toggleBookmark.rejected, (state, action) => {
        console.error("Bookmark failed:", action.payload);
      })
      // Comments
      .addCase(fetchComments.pending, (state) => {
        state.comments.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { comments, pagination } = action.payload;

        if (pagination.currentPage === 1) {
          state.comments.items = comments;
        } else {
          const newComments = comments.filter(
            (c) => !state.comments.items.find((ic) => ic.id === c.id)
          );
          state.comments.items.push(...newComments);
        }

        state.comments.page = pagination.currentPage + 1;
        state.comments.hasMore = pagination.currentPage < pagination.totalPages;
        state.comments.loading = false;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.comments.loading = false;
        state.comments.error = action.payload;
      })

      .addCase(postComment.fulfilled, (state, action) => {
        const newComment = action.payload;

        if (newComment.parentId) {
          const parentComment = state.comments.items.find(
            (c) => c.id === newComment.parentId
          );
          if (parentComment) {
            if (!parentComment.replies) {
              parentComment.replies = [];
            }
            parentComment.replies.push(newComment);
          }
        } else {
          state.comments.items.unshift(newComment);
        }

        if (state.item) {
          state.item.commentsCount += 1;
        }
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        state.comments.items = updateCommentInState(
          state.comments.items,
          updatedComment
        );
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const deletedInfo = action.payload;
        let deletedCount = 1;
        if (deletedInfo.parentId == null) {
          const parentComment = state.comments.items.find(
            (c) => c.id === deletedInfo.id
          );
          if (parentComment && parentComment.replies) {
            deletedCount += parentComment.replies.length;
          }
        }
        state.comments.items = deleteCommentFromState(
          state.comments.items,
          deletedInfo
        );
        if (state.item) {
          state.item.commentsCount -= deletedCount;
        }
      });
  },
});

export const {
  resetNewsDetail,
  resetFeed,
  resetSearchResult,
  resetHomeNews,
  resetArticleStatus,
} = newsSlice.actions;
export default newsSlice.reducer;
