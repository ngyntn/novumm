import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Home } from "lucide-react";
import UserMenu from "./UserMenu";
import NotificationBell from "./NotificationBell";
import { useDispatch } from "react-redux";

function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const dispatch = useDispatch();

  const handleSearch = () => {
    if (query.trim() !== "") {
      localStorage.setItem('lastSearchQuery', query);
      navigate(`/search/${query}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogoClick = () => {
    dispatch(resetHomeNews());
    setQuery('');
    localStorage.removeItem('lastSearchQuery');
  };

  useEffect(() => {
    if (location.pathname.startsWith('/search/')) {
      const lastQuery = localStorage.getItem('lastSearchQuery') || '';
      setQuery(lastQuery || params.query || '');
    } else {
      setQuery('');
      localStorage.removeItem('lastSearchQuery');
    }
  }, [location.pathname]);

  return (
    <div className="fixed top-0 left-0 w-full bg-white dark:bg-[rgb(24_34_45)] z-50 py-2 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-12">
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center gap-2" onClick={handleLogoClick}>
            <img
              src="/logo_dark.png"
              alt="Logo Dark"
              className="h-12 w-auto hidden dark:block"
            />
            <img
              src="/logo_light.png"
              alt="Logo Light"
              className="h-12 w-auto dark:hidden"
            />
            <img
              src="/name_dark.png"
              alt="Tên ứng dụng Dark"
              className="h-12 w-auto hidden dark:block"
            />
            <img
              src="/name_light.png"
              alt="Tên ứng dụng Light"
              className="h-12 w-auto hidden sm:block dark:hidden"
            />
          </Link>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="flex-1 flex justify-center px-4">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Bạn muốn đọc gì hôm nay?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              className="input input-bordered border w-full pl-4 pr-10 py-2 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors"
            />
            <button
              onClick={handleSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Các nút điều hướng */}
        <div className="flex-shrink-0 flex items-center gap-4">
          <Link
            to="/"
            title="Home"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Home size={24} />
          </Link>
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
