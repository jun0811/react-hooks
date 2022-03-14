[toc]



# State Hook

> **State Hook**을 자체적으로 다시 구현하여 내부적으로 어떻게 작동하는지, 다음으로 Hook의 몇 가지 제한 사항과 Hook이 존재하는 이유에 대해 공부하였습니다. 또한, Hooks의 한계로 인해 발생하는 일반적인 문제를 해결하는 방법을 배웠습니다.

## useState 구현

Hooks가 내부적으로 어떻게 작동하는지 더 잘 이해하기 위해 Hooks를 다시 구현해보았습니다.

1. React, ReactDOM import

   `ReactDOM`은 Component를 재랜더링하기 위해 필요합니다.

   ```jsx
   import React from 'react'
   import ReactDOM from 'react-dom'
   ```

2. useState 함수 정의

   ```jsx
   function useState (initialState) {
   	let value = initialState
   	function setState (nextValue) {
       value = nextValue
       ReactDOM.render(<MyName />,
   	  document.getElementById('root'))
     }
   	return [ value, setState ]
   }
   ```

   - 반환값이 객체가 아닌 배열을 사용되는 이유는 일반적으로 `value` & `setState` 을 rename하여 사용하기 때문이다.

     `const [name, setName] = useState('')`

정의한 Hook 함수를 보면 값을 저장하기 위해 `closure`를 사용하고 있습니다. `setState`함수는 동일한 **closuer** 내에서 정의되어 있으며, 이것이 우리가 함수 컴포넌트 내에서 우리가 값에 접근할 수 있는 이유입니다. 또한, `useState`없이는 해당 값을 직접 접근할 수 없으며 변수 값을 반환받지도 않습니다.

## 단순한 hook의 문제점

Hook을 실행하게 되면, 컴포넌트가 다시 렌더링될 때 상태가 재설정되어 초기화됩니다. 렌더링 될때마다 useState를 호출하기 때문에 값이 새로 초기화 되기 때문입니다.

우리는 이것을 global 변수로 해결할 수 있습니다.

## global variable 사용

앞서 배웠듯이 value는 `useState`에 의해 정의된 클로져안에 저장되어있습니다. 컴포넌트가 re-rendering될 때마다, 그 클로저는 다시 초기화됩니다. 그것은 값의 리셋을 의미합니다. 이것을 해결하기 위해, 값을 함수 외부의 `global variable`에 저장할 필요가 있습니다.

그 방법은, value는 함수의 밖 클로저에 존재 하게 해주어 랜더링을 다시 해도 초기화가 되지 않도록 해줍니다.

`useState` 구현과 별 다른 것이 없다.

useState밖에 변수를 정의하고 내부 함수에 조건을 조금 추가해주면 끝이다.

```jsx
let value
function useState (initialState) {
	if (typeof value === 'undefined') value = initialState
```

이제부터는 우리의 `useState` 는 전역값 변수를 정의하는 대신 값 변수가 외부 클로저에 있으므로 함수가 다시 호출 되어도 다시 초기화되지 않습니다.

## 하나의 컴포넌트에 여러 hook 추가

하나의 컴포넌트에 다수의 state가 엮여있을 코드를 간단히 작성해 보겠습니다.

```jsx
const [ name, setName ] = useState('')
const [ lastName, setLastName ] = useState('')

function handleLastNameChange (evt) {
	setLastName(evt.target.value)
}

<h1>My name is: {name} {lastName}</h1>
<input type="text" value={lastName}
  onChange={handleLastNameChange}/>
```

구현한 `useState`로 이것을 실행하면 구현된 Hook함수가 두 상태에 대해 동일한 값을 사용하므로 항상 두 필드를 한 번에 바꾼다는 것을 알 수 있습니다. 따라서 이를 위한 함수 재정의가 필요합니다.

### Multiple hooks

단일 전역 변수 대신 Hook 값의 배열이 있어야 합니다.

리팩토링을 해보겠습니다.

```jsx
let values = []
let currentHook = 0
function useState (initialState) {
	if (typeof values[currentHook] === 'undefined')
		values[currentHook] = initialState
	let hookIndex = currentHook
	function setState (nextValue) { 
		 values[hookIndex] = nextValue ReactDOM.render(<MyName />,
     document.getElementById('root'))
   }
  return [ values[currentHook++], setState ]
}
```

`values[currentHook++]`을 사용하여, 우리는 `values배열`의 index로 현재 value를 전달 받을 수 있다. 단 아직 컴포넌트를 랜더링 시작할 때, currentHook Counter를 초기화 시켜야합니다.

```jsx
function Name () {
   currentHook = 0
```

## 우리는 Conditional Hooks를 정의 할 수 있는가?

위에서 Hook을 정의할 때 인덱스가 들어간다는 것을 배웠습니다. 근데 만약에 조건에 따라 useState가 정의되고 안되고 차이가 있다면, Hook의 index는 순서가 엉망이 될 수 밖에 없습니다. 결국 조건에 따라 useState를 사용하면 안된다는 것이죠

```jsx
const [ enableFirstName, setEnableFirstName ] = useState(false)
const [ name, setName ] = enableFirstName ? useState(''): [ '', () => {} ] 
```

### 실제 Hook과의 비교

간단한 훅을 구현했었습니다. 하지만 이것은 내부적으로 어떻게 동작하는지에 대한 아이디어를 제공할 뿐 실제와는 다릅니다.

먼저, Hooks는 `global variable`을 사용하지 않습니다. 대신 React Component안에 state를 저장합니다. 또한 내부적으로 Hook카운터를 처리하므로 컴포넌트 내에서 수동으로 재설정할 필요도 없습니다.

두번째, 실제 Hook은 상태가 변경될 때 구성 요소의 재렌더링을 자동으로 트리거 합니다. 그러나 이를 수행하기 위해서는 React 함수 컴포넌트 내에서 Hook을 호출해야 합니다. **React Hooks는 React 외부 또는 클래스 컴포넌트에서 사용할 수 없습니다.**

결론적으로 useState를 재구현해보면서 우리는 3가지를 배울 수 있었습니다.

- Hooks는 단순히 React기능에 접근하는 기능입니다.
- Hooks의 정의 순서는 중요하다
- Hooks는 재랜더링에 지속되는 side Effect를 처리한다.

특히, **정의 순서**는 Hooks를 조건부로 정의 할 수 없음을 의미하기 때문에 중요합니다.

## Hooks의 일반적인 문제 해결

일반적인 Hooks를 구현하는 것은 장단점이 있습니다. 이제 React Hooks의 한계에서 비롯된 이러한 문제들을 극복하는 방법들을 알아 보겠습니다.

- 조건 hooks 해결
- 루프에서 hooks

### 1. 조건 Hooks

컴포넌트를 분할해서 프로젝트를 진행합니다. 따라서 항상 정의하고 필요에 따라 컴포넌트를 불러 Hooks를 사용하게 합니다.

```jsx
function LoggedInUserInfo ({ username }) {
  const info = useFetchUserInfo(username)
  return <div>{info}</div>
}
function UserInfo ({ username }) {
  if (username) {
      return <LoggedInUserInfo username={username} />
  }
  return <div>Not logged in</div>
}
```

위 코드에 대해서 설명하자면, 로그인 상태와 아닌 상태에 대해 개별 Component를 사용하였습니다.

이를 통해 조건부 Hook 없는 것이 문제가 되지 않습니다.

### 2. Hooks in Loop

간단하게 배열을 통해 해결할 수 있습니다.

```jsx
function OnlineUsers ({ users }) {
 const [ userInfos, setUserInfos ] = useState([])
 // ... fetch & keep userInfos up to date ...
 return (
     <div>
         {users.map(username => {
             const user = userInfos.find(u => u.username === username)
             return <UserInfo {...user} />
         })}
	</div> )
}
```

## 정리

useState을 global state 와 closures를 통해 재구성해보았습니다. 그런 다음 여러 Hook을 구현하려면 대신 state 배열을 사용해야 한다는 것을 배웠습니다. 그러나 state 배열을 사용함으로써 우리는 함수 호출에서 Hook 의 순서를 일관되게 유지해야 했습니다. 이 제한으로 인해 루프에서 조건부 Hooks 및 Hooks가 불가능했습니다. 마지막으로, Hooks의 한계에서 비롯된 일반적인 문제를 해결하는 방법을 습득하였습니다.





# 실습 시간

## 기술 요구 사항

node.js ( v11.12.0 이상)

## 기능 선택

만들 application은 게시판입니다. 그에 대한 최소한 기능을 구현 하고자 합니다.

- 사용자 등록
- 로그인/로그아웃
- 단일 게시물 보기
- 새글 작성
- 글 포스팅

## 프로젝트 구조

일반적으로 src폴더 안에 프로젝트를 경로별로 구분합니다.

ex) src/api/  ,   src/components/

우리의 기능을 추상화 해보면

- 사용자 ( 회원가입, 로그인/ 로그아웃 )
- 게시물 ( 생성, 조회, 등록 )

따라서 그룹화하여 폴더 구조를 작성하면

- src/
- src/user/
- src/post/

## 컴포넌트 구조

간단하게 목업을 작성하였습니다.

<img src="/Users/iseungjun/Library/Application Support/typora-user-images/image-20220314154549207.png" alt="image-20220314154549207" style="zoom:50%;" />

먼저 제일 작은 단위로 나누어서 구분해놓았습니다.

이제 가장 큰틀로 구분하자면

- APP : 모든 컴포넌트를 포함하는 컴포넌트
- PostList : 모든 게시글을 포함하는 컴포넌트



------

## 프로젝트 설정

일단 create-react-app으로 시작하겠습니다

```
npx create-react-app article
```

그리고 나서 폴더를 2개 생성하겠습니다.

- src/user/
- src/post/

## 사용자 구현

static components 측면에서 가장 간단한 기능인 사용자 관련 기능 구현을 먼저 하겠습니다.

앞에서 구성요소를 나누면 4가지 Component가 필요합니다.

- **Login** : 사용자가 아직 로그인하지 않은 경우 보여지는 Component
- **Register** : 위와 동일
- **Logout** : 사용자가 로그인 한 경우 보여지는 Component
- **UserBar** : 조건부로 다르게 보여지는 컴포넌트

먼저 처음 3가지를 구현하고 그에 대한 의존성이 존재하는 **UserBar**를 마지막에 정의하겠습니다.

### 1. Login

**src/user/Login.js**

```jsx
export default function Login() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="login-username">Username:</label>
      <input type="text" name="login-username" id="login-username" />
      <label htmlFor="login-password">Password:</label>
      <input type="password" name="login-password" id="login-password" />
      <input type="submit" value="Login" />
    </form>
  );
}
```

작성을 해줍니다. 특별한 부분은 없습니다. ( e.preventDefaulf는 제출 후 새로고침 방지 )

이제 Login Component는 완성 되었고 이제 잘 작동하는지 App.js에 붙여줍니다.

**App.js**

```jsx
import "./App.css";
import Login from "./user/Login";

function App() {
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
```

이제 서버를 켜서 확인하면 잘 되는 것을 테스트 할 수 있습니다.

<img src="/Users/iseungjun/Library/Application Support/typora-user-images/image-20220314154649347.png" alt="image-20220314154649347" style="zoom:50%;" />

이제 로그인을 했으니 로그아웃을 만들어 보겠습니다.

### 2. Logout

Login과 똑같이 진행하면 됩니다.

**Logout.js**

```jsx
export default function Logout({ user }) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      Logged in as: <b>{user}</b>
      <input type="submit" value="Logout" />
    </form>
  );
}
```

작성하고 App.js에 심어 주어 테스트를 해봅니다.

```jsx
import "./App.css";
import Login from "./user/Login";
import Logout from "./user/Logout";

function App() {
  return (
    <div className="App">
      <Login />
      <Logout user="kim sj" />
    </div>
  );
}

export default App;
```

### 3. Register

register는 Login 컴포넌트와 비슷합니다. 단지, 비밀번호를 한번 더 입력 받아서 검증하는 라벨만 추가 해주면 됩니다.

**Register.js**

```jsx
export default function Register() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="register-username">Username:</label>{" "}
      <input type="text" name="register-username" id="register-username" />
      <label htmlFor="register-password">Password:</label>{" "}
      <input type="password" name="register-password" id="register-password" />
      <label htmlFor="register-password-repeat">Repeat password:</label>
      <input
        type="password"
        name="register-password-repeat"
        id="register-password-repeat"
      />
      <input type="submit" value="Register" />{" "}
    </form>
  );
}
```

똑같이 작성하고 위와 같은 과정을 통해 검증을 하면 끝!

### 3. UserBar

**UserBar.js**

```jsx
import Login from "./Login";
import Logout from "./Logout";
import Register from "./Register";

export default function UserBar() {
  const user = "LEE S J";
  if (user) {
    return <Logout user={user} />;
  } else {
    return (
      <>
        <Login />
        <Register />
      </>
    );
  }
}
```

UserBar를 작성하고 App.js에 이식한 후, UserBar의 `user` 를 바꾸어보면서 동작하는지 테스트 해보면 정적으로 만들어진 user컴포넌트들은 완성입니다.

## Post 구현

빠르게 게시판 구현을 해보겠습니다.

만들 컴포넌트는 다음 3개로 하겠습니다.

- Post : 단일 글을 보여주는 컴포넌트
- Create Post : 새로운 글을 생성하는 컴포넌트
- PostList : 여러 글들을 보여주는 컴포넌트

### 1. Post

게시물에는 제목, 내용, 작성자를 넣겠습니다.

**Post.js**

```jsx
export default function Post({ title, content, author }) {
  return (
    <div>
      <h3>{title}</h3>
      <div>{content}</div>
      <br />
      <i>
        Written by <b>{author}</b>
      </i>
    </div>
  );
}
```

### 2. CreatePost

새 게시물을 생성할 수 있는 양식입니다. 우리는 현재 로그인 되어 있는 유저를 전달해서 사용하여 작성자로 두어야합니다. 이를 위해 prop을 이용하겠죠! 그런 다음 작성자를 표시하고 입력 필드를 제공하겠습니다.

**CreatePost.js**

```jsx
export default function CreatePost({ user }) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div>
        Author: <b>{user}</b>
      </div>
      <div>
        <label htmlFor="create-title">Title:</label>
        <input type="text" name="create-title" id="create-title" />
      </div>
      <textarea />
      <input type="submit" value="Create" />
    </form>
  );
}
```

### 3. PostList

**PostList.js**

```jsx
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
```

props를 통해 목록을 받아 옵니다. 그리고 map을 통해 모든 요소들을 보여줄 수 있도록 하였습니다.

그리고 `React.Fragment`을 이용하여 <div> 없이 실행 시킬 수 있도록 하였습니다.

`Post` 컴포넌트에 {...p}를 통해 내용과 키를 전달합니다

이제, App.js에 더미데이터를 넣은채 실행을 해보겠습니다.

```jsx
import React from 'react'
import PostList from './post/PostList'
const posts = [
    { title: 'React Hooks', content: 'The greatest thing since
sliced bread!', author: 'Daniel Bugl' },
    { title: 'Using React Fragments', content: 'Keeping the DOM
tree clean!', author: 'Daniel Bugl' }
]
export default function App () {
 return <PostList posts={posts} />
}
```

## 합차기

모든 Component를 구현했다면 이제 합쳐서 한 화면에 모두 나타내야 하는 일만 남았습니다.

<img src="/Users/iseungjun/Library/Application Support/typora-user-images/image-20220314154743426.png" alt="Untitled" style="zoom:50%;" />

<img src="/Users/iseungjun/Library/Application Support/typora-user-images/image-20220314154800630.png" alt="image-20220314154800630" style="zoom:50%;" />

## Hook 집어넣기

정적인 요소는 완성되었습니다. 이제 입력에 따른 동작을 할 수 있는 웹 페이지를 만들어야 합니다.

### User 기능

1. UserBar.js
   - useState를 집어넣고 user를 설정할 수 있는 함수들을 모두 넘긴다.

```jsx
import Login from "./Login";
import Logout from "./Logout";
import Register from "./Register";
import { useState } from "react";

export default function UserBar() {
  const [user, setUser] = useState("");
  if (user) {
    return <Logout user={user} setUser={setUser} />;
  } else {
    return (
      <>
        <Login setUser={setUser} />
        <Register setUser={setUser} />
      </>
    );
  }
}
```

1. Login, Register, Logout useState 적용

- Login.js

```jsx
import { useState } from "react";
export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const handleUsername = (e) => {
    e.preventDefault();
    setUser(username);
  };

  return (
    <form onSubmit={handleUsername}>
      <label htmlFor="login-username">Username:</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        name="login-username"
        id="login-username"
      />
      <label htmlFor="login-password">Password:</label>
      <input type="password" name="login-password" id="login-password" />
      <input type="submit" value="Login" disabled={!username} />
    </form>
  );
}
```

- register

```jsx
import { useState } from "react";

export default function Register({ setUser }) {
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [username, setUsername] = useState("");

  function handlePassword(evt) {
    setPassword(evt.target.value);
  }
  function handlePasswordRepeat(evt) {
    setRepeatedPassword(evt.target.value);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setUser(username);
      }}
    >
      <label htmlFor="register-username">Username:</label>{" "}
      <input
        type="text"
        name="register-username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        id="register-username"
      />
      <label htmlFor="register-password">Password:</label>{" "}
      <input
        type="password"
        value={password}
        onChange={handlePassword}
        name="register-password"
        id="register-password"
      />
      <label htmlFor="register-password-repeat">Repeat password:</label>
      <input
        type="password"
        value={repeatedPassword}
        onChange={handlePasswordRepeat}
        name="register-password-repeat"
        id="register-password-repeat"
      />
      <input
        type="submit"
        value="Register"
        disabled={
          username.length === 0 ||
          password.length === 0 ||
          password !== repeatedPassword
        }
      />
    </form>
  );
}
```

- Logout.js

```jsx
import { useState } from "react";

export default function Register({ setUser }) {
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [username, setUsername] = useState("");

  function handlePassword(evt) {
    setPassword(evt.target.value);
  }
  function handlePasswordRepeat(evt) {
    setRepeatedPassword(evt.target.value);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setUser(username);
      }}
    >
      <label htmlFor="register-username">Username:</label>{" "}
      <input
        type="text"
        name="register-username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        id="register-username"
      />
      <label htmlFor="register-password">Password:</label>{" "}
      <input
        type="password"
        value={password}
        onChange={handlePassword}
        name="register-password"
        id="register-password"
      />
      <label htmlFor="register-password-repeat">Repeat password:</label>
      <input
        type="password"
        value={repeatedPassword}
        onChange={handlePasswordRepeat}
        name="register-password-repeat"
        id="register-password-repeat"
      />
      <input
        type="submit"
        value="Register"
        disabled={
          username.length === 0 ||
          password.length === 0 ||
          password !== repeatedPassword
        }
      />
    </form>
  );
}
```

코드를 작성하고 동작을 확인 했다면, user관련된 state를 최상단(**App.js**)에 올려줍니다. ( user 정보는 글 작성에도 이용해야 하기 때문에 )

```jsx
// App.js
export default function App() {
  const [user, setUser] = useState("");

  return (
    <div style={{ padding: 20 }}>
      <UserBar user={user} setUser={setUser} />
// UserBar.js
export default function UserBar({ user, setUser }) {
  if (user) {
    return <Logout user={user} setUser={setUser} />;
  } else {
    return (
      <>
        <Login setUser={setUser} />
        <Register setUser={setUser} />
      </>
    );
  }
}
```

### Post 기능

Post는 더 간단합니다. App.js에서 posts를 useState로 관리할 수 있도록 코드를 수정하겠습니다.

1. 기존의 posts의 이름을 defaultPosts로 바꾸어줍니다.
2. posts를 useState로 관리해줍니다.
3. CreatePost에 user유무에 따른 랜더링과 state 와 set 함수를 넘겨줍니다.

```jsx
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
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState(defaultPosts);
  return (
    <div style={{ padding: 20 }}>
      <UserBar user={user} setUser={setUser} />
      <br />
      {user && <CreatePost user={user} posts={posts} setPosts={setPosts} />}
      <br />
      <hr />
      <PostList posts={posts} />
    </div>
  );
}
```

이제 CreatePost.js를 수정해줍니다.

```jsx
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
```

이제 양식에 맞추어 내용을 채우고 추가 버튼을 누르면 posts에 값이 추가되고 그에 따라 리스팅이 보여집니다

### 정리

먼저 정적인 웹페이지를 만들고 동적으로 웹을 동작하기 위해 useState만을 이용해서  article을 보여줄 수있는 blog을 만들어 보았습니다. 간단하게 Hooks를 사용하여 지역 및 전역 상태를 처리하는 방법을 배웠습니다. 또한 여러 Hook을 사용하는 방법과 Hook을 정의하고 상태를 저장하는 구성 요소를 배웠습니다. 또한 Hooks를 사용하여 입력 필드를 처리하는 것과 같은 일반적인 사용 사례를 해결하는 방법을 배웠습니다.

useReducer Hook을 사용하면 특정 상태 변경을 보다쉽게 처리 할 수 있습니다. 또한, 우리는 useEffect를 통해 side Effect코드를 실행해볼 수 있을 것입니다.



---



# 4. Reducer and Effect

> 이제까지 state에 대해 다루었습니다. State Hook을 통해 간단히 state변화를 주었습니다. 하지만 **상태 논리가 더 복잡해지면 상태를 일관되게 유지해야 합니다.** **그러기 위해서는 여러 State Hook 대신 Reducer Hook을 사용해야 합니다.** 모든 상태를 하나의 State Hook에 유지할 수 있지만 실수로 상태의 일부를 덮어쓰지 않도록 해야 합니다.

## Reducers

이제 상태 변경을 처리하는 함수를 정의해야합니다. **현재 상태와 동작을 인수로 취하고 새 상태를 반환합니다.**

```jsx
{ expandPosts: true, filter: 'all' } // 초기 상태 

{ expandPosts: true, filter: { fromDate: '2019-04-29' } }

{ expandPosts: true, filter: { fromDate: '2019-04-29',   
byAuthor: 'Daniel Bugl' } }

{ expandPosts: true, filter: { fromDate: '2019-04-30',   
byAuthor: 'Daniel Bugl' } }
 

// 이 코드를 전달하면 상태는 초기 상태 all string으로 돌아간다. 
{ type: 'CHANGE_FILTER', all: true }
```

위와 같이 상태가 변하는 로직이 필요합니다. 이를 위한 reducer를 만들어 보겠습니다.

```jsx
function reducer (state, action) {
	switch (action.type) {
		case 'TOGGLE_EXPAND':
      return { ...state, expandPosts: !state.expandPosts }
		case 'CHANGE_FILTER':
       if (action.all) {
           return { ...state, filter: 'all' }
       }
				let filter = typeof state.filter === 'object'?state.filter : {}
				if (action.fromDate) {
             filter = { ...filter, fromDate: action.fromDate }
         }
         if (action.byAuthor) {
             filter = { ...filter, byAuthor: action.byAuthor }
         }
				return { ...state, filter }
		default: throw new Error()
			 }
	}
```

## **The Reducer Hook**

**액션과 리듀서 기능을 정의했으므로 리듀서에서 Reducer Hook를 생성할 수 있습니다. useReducer Hook은 다음과 같습니다.**

`const [ state, dispatch ] = useReducer(reducer, initialState)` 이제 초기 상태를 정의 해줘야합니다.

```
const initialState = { all: true }
```

이제 Reducer에서 반환된 상태 객체를 사용하여 상태에 액세스할 수 있습니다. 다음과 같이 디스패치 기능을 통해 작업을 후크 및 디스패치합니다.

```
dispatch({ type: 'TOGGLE_EXPAND' })
dispatch({ type: 'CHANGE_FILTER', fromDate: '2019-04-30' })
```

**액션과 리듀서를 사용하여 상태 변경을 처리하는 것은 상태 객체를 직접 조정하는 것보다 훨씬 쉽습니다.**

Global State의 변경은 어디서든 일어날 수 있기 때문에 일반적으로 State Hook보다는 Reducer Hook을 사용하는 것이 좋다. 작업을 처리하고 상태 변경 로직을 한곳에서만 업데이트 하는 것이 더 쉽기 때문입니다.

( 모든 상태 변경 로직이 한곳에 있다면 버그를 수정하기도 쉽다. )

### State Hook을 Reducer로 바꾸기

블로그앱에서 useReducer를 이용하여 state 관리를 할 수 있도록 바꾸어 보겠습니다.

먼저 reducer 함수를 작성해야합니다.

1. App() 함수 작성전에 userReducer를 작성해줍시다.

```jsx
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
```

1. useReducer를 가져오고

```
import React, { useState, useReducer } from "react";
```

1. 기존 useState로 관리했던  user문장을 지우고 useReducer를 사용하여 대체해줍니다.

```
const [user, dispatchUser] = useReducer(userReducer, "");
```

1. 이제 setState함수를 `dispatchUser` 로 바꿔야합니다.

```jsx
export default function App() {
  const [user, dispatchUser] = useReducer(userReducer, "");
  const [posts, setPosts] = useState(defaultPosts);
  return (
    <div style={{ padding: 20 }}>
      <UserBar user={user} dispatch={dispatchUser} /> //수정
      <br />
      {user && <CreatePost user={user} posts={posts} setPosts={setPosts} />}
      <br />
      <hr />
      <PostList posts={posts} />
    </div>
  );
}
//// UserBar.js
export default function UserBar({ user, dispatch }) {
  if (user) {
    return <Logout user={user} dispatch={dispatch} />;
  } else {
    return (
      <>
        <Login dispatch={dispatch} />
        <Register dispatch={dispatch} />
      </>
    );
  }
}
// Login.js
export default function Login({ dispatch }) {
  const [username, setUsername] = useState("");
  const handleUsername = (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN", username });
  };
  //......
// Logout.js
export default function Logout({ user, dispatch }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        dispatch({ type: "LOGOUT" });
      }}
    >
      Logged in as: <b>{user}</b>
      <input type="submit" value="Logout" />
    </form>
  );
}
// Register
export default function Register({ dispatch }) {
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [username, setUsername] = useState("");

  function handlePassword(evt) {
    setPassword(evt.target.value);
  }
  function handlePasswordRepeat(evt) {
    setRepeatedPassword(evt.target.value);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        dispatch({ type: "REGISTER", username });
      }}
    >
```

식으로 바꾸어 주면 된다. post는 개별로 해보고 적용해보기 바란다.

## useEffect

Effect Hook, 즉 useEffect는 함수 컴포넌트 내에서 이런 side effects를 수행할 수 있게 해줍니다. React class의 `componentDidMount` 나 `componentDidUpdate`, `componentWillUnmount`와 같은 목적으로 제공되지만, 하나의 API로 통합

```jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // componentDidMount, componentDidUpdate와 비슷합니다
  useEffect(() => {
    // 브라우저 API를 이용해 문서의 타이틀을 업데이트합니다
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

- React는 우리가 넘긴 함수를 기억했다가(이 함수를 ‘effect’라고 부릅니다) DOM 업데이트를 수행한 이후에 불러냄
- 기본적으로 첫번째 렌더링과 이후의 모든 업데이트에서 수행

### 정리(clean-up)

```jsx
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // effect 이후에 어떻게 정리(clean-up)할 것인지 표시합니다.
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

**effect에서 함수를 반환하는 이유 : effect를 위한 추가적인 정리(clean-up) 메커니즘**

**반환 시점 :** 컴포넌트가 마운트 해제 되는 때 `클린 업` 을 실행

### 멀티 Effect

```jsx
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
  // ...
}
```

- Hook을 이용하면 생명주기 메서드에 따라서가 아니라 코드가 무엇을 하는지에 따라 나눌 수가 있습니다. React는 컴포넌트에 사용된 모든 effect를 지정된 순서에 맞춰 적용

### Effect를 건너뛰어 성능 최적화하기

```jsx
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // count가 바뀔 때만 effect를 재실행합니다.
```

- useEffect로 전달된 함수는 `지연 이벤트 동안에 레이아웃 배치와 그리기를 완료한 후` 발생

### 마운트/ 언마운트

```jsx
useEffect(() => {
    console.log('컴포넌트가 화면에 나타남');
    return () => {
      console.log('컴포넌트가 화면에서 사라짐');
    };
}, []);
```

- 첫번째 파라미터에는 함수, 두번째 파라미터에는 의존값이 들어있는 배열 (deps)
- deps 배열을 비우게 된다면, 컴포넌트가 처음 나타날때에만 useEffect 에 등록한 함수가 호출되고 컴퍼넌트가 사라질때 return 함수가 호출
- `useEffect` 안에서 사용하는 상태나, props 가 있다면, `useEffect` 의 `deps` 에 넣어주어야 합니다. 만약 `useEffect` 안에서 사용하는 상태나 props 를 `deps` 에 넣지 않게 된다면 `useEffect` 에 등록한 함수가 실행 될 때 최신 props / 상태를 가르키지 않게 됩니다.



