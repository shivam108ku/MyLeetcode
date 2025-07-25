import { Navigate, Route, Routes } from "react-router";
import {
  Login,
  Home,
  ResetPasswordPage,
  ForgorPasswordPage,
  EmailVerificationPage,
  Signup,
} from "./pages/ImportPages";

import ClickSpark from "./ui/ClickSpark";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import LoadinSpinner from "./components/LoadinSpinner";
import AuthContent from "./mainAuthContent/AuthContent";
import ProblemArea from "./mainAuthContent/MainContent/mainComponent/ProblemArea";
import GoalTracker from "./mainAuthContent/MainContent/mainComponent/GoalTracker";
import GroupCoding from "./mainAuthContent/MainContent/mainComponent/GroupCoding";
import Feed from "./mainAuthContent/MainContent/mainComponent/Feed";
import Dashboard from "./mainAuthContent/MainContent/mainComponent/Dashboard";
import InterviewPrep from "./mainAuthContent/MainContent/mainComponent/InterviewPrep";
import AlgoVisualiser from "./mainAuthContent/MainContent/mainComponent/AlgoVisualiser";
import AdminPannel from "./mainAuthContent/MainContent/adminPannel/AdminPannel";
import ProblemSolvingPage from "./mainAuthContent/MainContent/mainComponent/ProblemSolvingPage";
import AdminPanel from "./mainAuthContent/MainContent/adminPannel/AdminPannel";
import Admin from "./mainAuthContent/MainContent/adminPannel/Admin";
import AdminDelete from "./mainAuthContent/MainContent/adminPannel/AdminDelete";
import DsaArena from "./mainAuthContent/MainContent/mainComponent/DsaArena";
import Blog from "./mainAuthContent/MainContent/adminPannel/Blog";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
};
// RedirectAuthUser

const RedirectAuthUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/problems-page" replace />;
  }
  return children;
};

const MainRoute = () => {
  // eslint-disable-next-line no-unused-vars
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadinSpinner />;

  return (
    <div
      className="min-h-[100vh] text-white bg-gradient-to-br from-black via-black/87 to-black
     flex items-center justify-center relative overflow-hidden"
    >
      <ClickSpark
        sparkColor="#fff"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        <Routes>
          <Route
            path="/"
            element={
              <RedirectAuthUser>
                <Home />
              </RedirectAuthUser>
            }
          />

          <Route
            path="/problems-page"
            element={
              <ProtectedRoute>
                <AuthContent />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="problems" element={<ProblemArea />} />
            <Route path="goal-tracker" element={<GoalTracker />} />
            <Route path="group-coding" element={<GroupCoding />} />
            <Route path="feed" element={<Feed />} />
            <Route path="help" element={<DsaArena />} />
            <Route path="interview-prep" element={<InterviewPrep />} />
            <Route path="algo-visualiser" element={<AlgoVisualiser />} />
            <Route
              path="problems/:problemId"
              element={<ProblemSolvingPage />}
            />
          </Route>

          <Route
            path="/signup"
            element={
              <RedirectAuthUser>
                <Signup />
              </RedirectAuthUser>
            }
          />

          <Route
            path="/login"
            element={
              <RedirectAuthUser>
                <Login />
              </RedirectAuthUser>
            }
          />
          <Route
            path="/verify-email"
            element={
              <RedirectAuthUser>
                <EmailVerificationPage />
              </RedirectAuthUser>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <RedirectAuthUser>
                <ForgorPasswordPage />
              </RedirectAuthUser>
            }
          />

          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthUser>
                <ResetPasswordPage />
              </RedirectAuthUser>
            }
          />

          <Route
            path="/admin"
            element={
              isAuthenticated && user?.role === "admin" ? (
                <Admin />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/admin/create"
            element={
              isAuthenticated && user?.role === "admin" ? (
                <AdminPannel />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/delete"
            element={
              isAuthenticated && user?.role === "admin" ? (
                <AdminDelete />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/blog/create"
            element={
              isAuthenticated && user?.role === "admin" ? (
                <Blog />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </ClickSpark>
    </div>
  );
};

export default MainRoute;
