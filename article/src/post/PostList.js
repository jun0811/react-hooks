import { Fragment } from "react";
import Post from "./Post";

export default function PostList({ posts = [] }) {
  return posts.map((p, index) => (
    <Fragment key={"post-" + index}>
      <Post {...p} />
      <hr />
    </Fragment>
  ));
}
