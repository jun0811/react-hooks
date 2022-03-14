import { useState } from "react";

export default function CreatePost({ user, posts, dispatch }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const addPosts = (e) => {
    e.preventDefault();
    // setPosts([...posts, newPost]);
    dispatch({ type: "CREATE_POST", title, content, author: user });
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={addPosts}>
      <div>
        Author: <b>{user}</b>
      </div>
      <div>
        <label htmlFor="create-title">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          name="create-title"
          id="create-title"
        />
      </div>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <input type="submit" value="제출" />
    </form>
  );
}
