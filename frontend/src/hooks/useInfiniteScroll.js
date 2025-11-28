import { useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";

export const useInfiniteScroll = ({
  listState,
  fetchThunk,
  resetAction,
  dependencies = [],
}) => {
  const dispatch = useDispatch();
  const { items, loading, error, page, hasMore } = listState;
  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchThunk({ page, limit: 20 });
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, fetchThunk]
  );

  // Tránh bị refresh khi thoát ra từ trang chi tiết
  // useEffect(() => {
  //   if (resetAction) {
  //     dispatch(resetAction());
  //   } 
  // }, [...dependencies, dispatch, resetAction]); 

  useEffect(() => {
    if (items.length === 0 && !loading && hasMore) {
      fetchThunk({ page: 1, limit: 20 });
    }
  }, [items.length, loading, hasMore, fetchThunk, page]);

  // useEffect(() => {
  //   return () => {
  //     if (resetAction) {
  //       dispatch(resetAction());
  //     }
  //   };
  // }, [dispatch, resetAction]);

  return { items, loading, error, hasMore, lastElementRef };
};
