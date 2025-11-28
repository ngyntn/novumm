import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import NewsDetail from "./pages/NewsDetail";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./pages/Login";
import SearchResult from "./pages/SearchResult";
import { useDispatch, Provider, useSelector } from "react-redux";
import store from "./store/store";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";
import EditProfile from "./pages/EditProfile";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import ReportManagement from "./pages/admin/ReportManagement";
// import { fetchCurrentUser } from "./api/userApi.js";
import { loadUserFromStorage } from "./store/userSlice";
import Notifications from "./pages/Notifications";
import Loader from "./components/Loader";
import { initSocket, getSocket, disconnectSocket } from "./utils/socket";

const ProtectedLayout = () => {
  const { currentUser, status } = useSelector((state) => state.user);

  if (status === "loading" || status === "idle") {
    return <Loader isLoading={true} />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const AdminProtectedLayout = () => {
  const { currentUser, status } = useSelector((state) => state.user);

  if (status === "loading" || status === "idle") {
    return <Loader isLoading={true} />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

function LayoutWithNavbar() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <Outlet />
      </div>
    </>
  );
}

function App() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    // dispatch(fetchCurrentUser());
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      initSocket(currentUser.id, dispatch);
    }

    return () => {
      disconnectSocket();
    };
  }, [currentUser, dispatch]);

  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Trang chi tiết bài viết vẫn nên công khai để chia sẻ */}

        <Route element={<ProtectedLayout />}>
          <Route element={<LayoutWithNavbar />}>
            <Route index element={<Home />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/news/:slug" element={<NewsDetail />} />
            <Route path="/search/:query" element={<SearchResult />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/edit/:slug" element={<EditPost />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Route>

        <Route element={<AdminProtectedLayout />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="reports" element={<ReportManagement />} />
          </Route>
        </Route>

        {/* <Route path="*" element={<div>404 - Không tìm thấy trang</div>} /> */}
      </Routes>
    </Router>
  );
}

function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default AppWrapper;
