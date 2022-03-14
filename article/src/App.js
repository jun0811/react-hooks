import React, { useState, useReducer } from "react";
import PostList from "./post/PostList";
import UserBar from "./user/UserBar";
import CreatePost from "./post/CreatePost";

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

function postsReducer(state, action) {
  switch (action.type) {
    case "CREATE_POST":
      const newPost = {
        title: action.title,
        content: action.content,
        author: action.author,
      };
      return [newPost, ...state];
    default:
      return new Error();
  }
}

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
    case "REGISTER":
      return action.username;
    case "LOGOUT":
      return "";
    default:
      throw new Error();
  }
}

export default function App() {
  const [user, dispatchUser] = useReducer(userReducer, "");
  const [posts, dispatchPosts] = useReducer(postsReducer, defaultPosts);
  return (
    <div style={{ padding: 20 }}>
      <UserBar user={user} dispatch={dispatchUser} />
      <br />
      {user && (
        <CreatePost user={user} posts={posts} dispatch={dispatchPosts} />
      )}
      <br />
      <hr />
      <PostList posts={posts} />
    </div>
  );
}
