import { useParams } from "react-router-dom";
// import { news } from "./Home";
import SearchResultItem from "../components/SearchResultItem";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNewsByKeySearch, fetchNewsByKeySearchV2 } from "../api/articleApi";
import { resetSearchResult } from "../store/newsSlice";
import Loader from "../components/Loader";

const SearchResult = () => {
    const { query } = useParams();
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const { searchedItems, searchedAuthors, searchedLoading, searchedError } = useSelector(state => state.news);

    useEffect(() => {
        // Reset và fetch khi query thay đổi (luôn page=1)
        dispatch(resetSearchResult());
        dispatch(fetchNewsByKeySearchV2({ keySearch: query, page: 1, limit })); // Force page=1
        setPage(1); // Reset page về 1
    }, [query]); // Chỉ deps query

    useEffect(() => {
        // Chỉ fetch thêm khi page >1 (không reset)
        if (page > 1) {
            dispatch(fetchNewsByKeySearchV2({ keySearch: query, page, limit }));
        }
    }, [page]); // Deps page

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center pt-24 pb-12 transition-colors">
            <div className="w-full max-w-4xl px-4">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                    Kết quả tìm kiếm cho: "{query}"
                </h1>
                {searchedItems.length > 0 && !searchedLoading && (
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
                        {searchedItems.map((item) => {
                            const author = searchedAuthors[item.userId];
                            return <SearchResultItem key={item.id} item={item} author={author} />;
                        })}
                    </div>
                )}
                {!searchedLoading && searchedItems.length > 0 && (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => setPage((prev) => prev + 1)}
                            className="px-6 py-2 rounded-full text-sm font-medium  
                 text-dark hover:shadow-lg 
                 hover:opacity-90 transition duration-200 
                 disabled:opacity-60 disabled:cursor-not-allowed dark:text-gray-100 dark:hover:shadow-white/50"
                            disabled={searchedLoading}
                        >
                            Xem thêm kết quả
                        </button>
                    </div>
                )}
                {searchedLoading && (
                    <Loader isLoading={searchedLoading} />
                )}
                {searchedError &&
                    <div className="text-center py-16">
                        <p className="text-gray-600">Không tìm thấy bài viết nào phù hợp.</p>
                    </div>
                }
            </div>
        </div>
    );
};

export default SearchResult;