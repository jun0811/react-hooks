import { useState, useReducer } from "react";
import PostList from "./post/PostList";
import UserBar from "./user/UserBar";
import CreatePost from "./post/CreatePost";
import appReducer from "./reducers";

const defaultPosts = [
  {
    title: "React Hooks",
    content: "The greatest thing since sliced bread!",
    author: "LSJ",
  },
  {
    title: "Using React Fragments",
    content: "Keeping the DOM tree clean!",
    author: "LSJ",
  },
];

export default function App() {
  const [state, dispatch] = useReducer(appReducer, {
    user: "",
    posts: defaultPosts,
  });
  const { user, posts } = state;
  return (
    <div style={{ padding: 20 }}>
      <UserBar user={user} dispatch={dispatch} />
      <br />
      {user && <CreatePost user={user} posts={posts} dispatch={dispatch} />}
      <br />
      <hr />
      <PostList posts={posts} />
    </div>
  );
}
