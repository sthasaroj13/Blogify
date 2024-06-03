import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import ErrorPage from "../src/pages/ErrorPage.jsx";
import Layout from "./component/Layout.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "../src/pages/Home.jsx";
import PostDetail from "../src/pages/PostDetail.jsx";
import Register from "../src/pages/Register.jsx";
import Login from "../src/pages/Login.jsx";
import Authors from "../src/pages/Authors.jsx";
import UserProfile from "../src/pages/UserProfile.jsx";
import CreatePost from "../src/pages/CreatePost.jsx";
import CategoryPosts from "../src/pages/CategoryPosts.jsx";
import AuthorPosts from "../src/pages/AuthorPosts.jsx";
import EditPost from "../src/pages/EditPost.jsx";
import DeletePost from "./pages/DeletePost.jsx";
import Logout from "../src/pages/Logout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UserProvider from "./context/UserContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <UserProvider> <Layout/> </UserProvider>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/posts/:id",
        element: <PostDetail />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/authors",
        element: <Authors />,
      },
      {
        path: "/profile/:id",
        element: <UserProfile />,
      },
      {
        path: "/create",
        element: <CreatePost />,
      },
      {
        path: "/posts/categories/:category",
        element: <CategoryPosts />,
      },
      {
        path: "/posts/users/:id",
        element: <AuthorPosts />,
      },{
        path :"/myposts/:id",
        element:<Dashboard/>
      },

      {
        path: "/posts/:id/edit",
        element: <EditPost />,
      },
      {
        path: "/posts/:id/delete",
        element: <DeletePost/>,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
