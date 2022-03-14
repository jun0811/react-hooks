import { useState } from "react";

export default function CreatePost({ user, posts, setPosts }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const addPosts = (e) => {
    e.preventDefault();
    const newPost = { title, content, author: user };
    // setPosts([...posts, newPost]);
    setPosts(posts.concat(newPost));
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
