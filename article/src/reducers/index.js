export function postsReducer(state, action) {
  switch (action.type) {
    case "CREATE_POST":
      const newPost = {
        title: action.title,
        content: action.content,
        author: action.author,
      };
      return [newPost, ...state];
    default:
      return state;
  }
}

export function userReducer(state, action) {
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

export default function appReducer(state, action) {
  return {
    user: userReducer(state.user, action),
    posts: postsReducer(state.posts, action),
  };
}
