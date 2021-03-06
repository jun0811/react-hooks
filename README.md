# Introduce

> React와 React Hooks의 기본 원리를 공부를 목표.

1. React의 기본 원리

2. React Hooks의 필요 동기

3. overview of various Hooks

## React의 원칙

React는 세가지 원칙을 기반하고 있다.

1. **Declarative**

   React에게 일을 하는 방법을 알려주는 대신 우리가 하고 싶은 일을 알려줍니다. 결과적으로 애플리케이션을 쉽게 설계할 수 있고 React는 데이터가 변경될 때 올바른 구성 요소를 효율적으로 업데이트하고 렌더링 할 수 있다.

   예) 선언전 코드

   ```jsx
   const input = ["a", "b", "c"];
   let result = input.map((str) => str + str);
   console.log(result); // prints: [ 'aa', 'bb', 'cc' ]
   ```

2. **Component-based**

   React는 자체 상태와 보기를 관리하는 구성 요소를 캡슐화한 다음 복잡한 사용자 인터페이스를 만들기 위해 구성할 수 있음.

   **`Function components`:** props를 인수로 사용하고 사용자 인터페이스를 반환하는 JavaScript 함수 **`Class components`**: render methode를 통해 인터페이스를 반환하는 JavaScript 클래스

3. **Learn once, write anywhere**

   React는 기술 스택에 대해 가정하지 않으며 가능한 한 기존 코드를 다시 작성하지 않고 앱을 개발할 수 있도록 노력한다.

`function components` 요소는 정의하고 이해하기가 더 쉽지만 `class components`의 state, context 및 더 많은 React의 고급 기능을 사용하지 못했습니다. 그러나 React Hooks를 사용하면 클래스 구성 요소 없이도 React의 고급 기능을 다룰 수 있다!

## React Hooks 사용

우리는 사용자 인터페이스를 디자인하는 것보다 더 많은 경우에 적용할 수 있는 소프트웨어 디자인 패턴을 배울 것이 중요‼️

React는 성능을 보장하고 개발자 경험을 매끄럽게 하기 위해 노력했습니다. 하지만, 수년간 React는 사용되면서 몇가지 문제를 맞이했습니다.

### 1. confusing class

과거에는 라이프 사이클 메서드라는 특수 기능이 있는 클래스 구성 요소를 사용해야 했습니다. **( ex : componentDidUpdate, this.setState)**

React 클래스는 `this.context` 를 인간과 기계 모두 이해하기 어려운 점이 있다.

`this`는 자바스크립트에서 특별한 키워드입니다.

- 메소드에서, this는 클래스 객체를 참조합니다.
- 이벤트 핸들러에서, this는 그 이벤트를 받은 element를 참조합니다.
- function이나 홀로 쓰일때는, this는 window object와 같은 `global객체`를 참조합니다.
- Strict mode에서는, 함수안에서 undefined입니다.
- 추가적으로 `call()` and `apply()` 같은 메소드는 참조 객체를 어떤 객체로든 바꿀수가 있습니다.

인간에게는, 클래스가 어려운 이유가 this는 항상 다른 것을 참조하기 때문에 우리는 수동적으로 클래스에 다시 바인딩을 해줘야한다. 기계에게는 클래스의 어떤 메소드가 어떻게 호출 될지 몰라서 성능을 최적화하고 사용하지 않는 코드를 구분하기 어렵다.

## Wrapper Hell

Hooks전에는, 우리는 상태관리를 캡슐화하기 원한다면, HOC을 사용해야만 하고 props에 따라 렌더링을 했어야 했다.

```jsx
<AuthenticationContext.Consumer>
   {user => (
       <LanguageContext.Consumer>
           {language => (
               <StatusContext.Consumer>
                   {status => (
												...
									 )}
               </StatusContext.Consumer>
           )}
       </LanguageContext.Consumer>
   )}
</AuthenticationContext.Consumer>
```

위 코드는 사용자 인증을 처리하는 React를 Context를 사용하여 구성하였습니다.

우리는 이렇게 logic추가 되며 많은 하위트리가 생성 될 수 있다. ( Wrapper Hell )

이러한 코드는 읽고 쓰기도 쉽지 않을 뿐더러 변경할 경우 오류가 발생하기 쉽습니다. ( 디버깅의 어려움도 따라온다.)

## Hooks을 이용한다면?

`React Hooks`는 React와 동일한 기본 원칙을 기반으로 합니다. **Hooks**는 기존 JavaScript 기능을 사용하 여 상태 관리를 캡슐화 할 수 있습니다. 결과적으로 더 이상 특수화된 React 기능을 배우고 이해할 필요가 없습니다. Hooks를 사용하기 위해 기존 JavaScript 지식을 활용하기만 하면 됩니다. **( 바닐라 JS의 중요성 )**

위의 문제를 해결해보도록 하겠습니다.

```jsx
const Example = ({name}) => {
useEffect(() => {
 fetch(`http://my.api/${this.props.name}`)
     .then(...)
}, [ name ])

	// .....
}
```

이렇게 구성하면서 더 이상 고차 구성 요소를 만들지 않고도 stateful logic을 재사용 할 수 있습니다.

또한, useContext를 사용하면 wrapper hell도 해결이 가능합니다.

```jsx
const user = useContext(AuthenticationContext);
const language = useContext(LanguageContext);
const status = useContext(StatusContext);
```

핵심 ) 커스텀 훅은 컴포넌트 분할과는 달리 **‘컴포넌트 로직 자체를 분할하거나 재사용’**할 수 있습니다.

## Hooks Mindset

**Hooks**의 주요 목표는 상태 기반 로직을 렌더링 로직에서 분리하는 것입니다. 이를 통해 별도의 기능에서 논리를 정의하고 여러 구성 요소에서 재사용할 수 있습니다. **Hooks**를 사용하면 상태 저장 논리를 구현하 기 위해 **구성 요소 계층을 변경할 필요가 없습니다**. 더 이상 여러 구성 요소에 상태 논리를 제공하는 별도의 구성 요소를 정의할 필요가 없습니다. 간단하게 Hook을 사용하면 됩니다!

또한, Hooks을 사용하여 개발을 한다면, 데이터 흐름에 대해 생각해야합니다. ( 구성 요소의 생명 주기는 중요해지지 않는다. ) 특히, props나 state의 값이 변경 될 때 trigger를 사용하는 것에 대해 잘 파악하는 것이 중요합니다.

## Hooks 규칙

Hooks 사용에는 특정 제한 사항이 있으며 항상 염두에 두어야 합니다.

- Function Components에서만 사용해야합니다.

- hooks는 정의 순서가 매우 중요하며 동일해야합니다. 따라서 조건부, 루프, 중첩 함수를 사용하지 못합니다. ex) 조건문으로 useEffect를 동작시키면 안된다

  ```jsx
  if (name !== "") {
    useEffect(function persistForm() {
      localStorage.setItem("formData", name);
    });
  }
  ```

### **Basic Hooks**

Basic Hooks는 Stateful React apps에서 가장 일반적으로 필요한 기능을 제공.

- `useState`
- `useEffect`
- `useContext`

1. useState

   상태 저장값 및 setter 기능 값을 업데이트 하기 위해 사용

   ```jsx
   import { useState } from "react";
   const [state, setState] = useState(initialState);
   ```

   1. useEffect

      Effect Hook은 `componentDidMount`그리고`componentDidUpdate`와 유사하게 작동합니다.

      그리고 unmount시 CleanUp할 수 있다( componentWillUnmount 대체).

   2. useContext

      이 Hook은 context 객체를 받아들이고 현재 context 값을 반환합니다.

      ```jsx
      import { useContext } from "react";
      const value = useContext(MyContext);
      ```

   ## **Additional Hooks**

   > 일반적인 변형이거나 특정 경우에 필요한 hooks들이 있습니다. 우리가 살펴볼 추가 Hook은 다음과 같습니다. `useRef`, `useReducer`, `useMemo`, `useCallback`, `useLayoutEffect`

   ### useRef

   **useRef는** mutable ref object를 반환합니다, 여기서 `.current` property은 초기값 인수를 전달하여 초기화 할 수 있습니다.

   ```jsx
   import { useRef } from 'react'
   const refContainer = useRef(initialValue)

   <ComponentName ref={refContainer} />
   ```

   **useRef는** React에서 elements와 components에 대한 참조를 다룰 때 사용됩니다.

   우리는 ref prop에 해당 값을 전달하여 설정할 수 있습니다.

   ### **useReducer**

   useState 대안으로 Redux와 동일하게 동작한다.

   ```jsx
   import { useReducer } from "react";
   const [state, dispatch] = useReducer(reducer, initialArg, init);
   ```

   useReducer는 복잡한 상태 로직을 다룰 때 사용한다.

   ### useMemo

   메모이제이션은 함수 호출의 결과를 캐시한 다음 동일한 입력이 다시 발생할 때 반환되는 최적화 기법으로 이 기법을 사용하게 해주는게 `useMemo`.

   `const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])`

   비용이 많이 드는 작업을 다시 실행하지 않으려는 경우 최적화에 유용합니다.

   ### useCallback

   인자로 **`콜백함수`**와 `**종속성 배열**`을 전달받아 콜백 함수를 `memorized version`을 반환한다. useMemo와 비슷하지만 콜백함수 용이다.

   ```jsx
   import { useCallback } from "react";
   const memoizedCallback = useCallback(() => {
     doSomething(a, b);
   }, [a, b]);
   ```

   ### useLayoutEffect

   useLayoutEffect은 DOM에서 정보를 읽는 데 사용할 수 있음

   이 함수의 시그니처는 `useEffect`와 동일하긴 한데, 모든 DOM 변경 후에 동기적으로 발생합니다. 이것은 DOM에서 레이아웃을 읽고 동기적으로 리렌더링하는 경우에 사용하세요. `useLayoutEffect`의 내부에 예정된 갱신은 브라우저가 화면을 그리기 이전 시점에 동기적으로 수행

   ```jsx
   import { useLayoutEffect } from "react";
   useLayoutEffect(didUpdate);
   ```

   useEffect보다 느리고 시각적 업데이트를 막는다. 그래서 왠만해서는 사용 x

   ## 정리

   1. React의 기본 원리와 React가 제공하는 구성 요소 유형
   2. 클래스 구성 요소의 일반적인 문제, React의 기존 기능 사용 및 기본 원칙을 깨는 방법에 대해 학습 **(커스텀 훅은 컴포넌트 분할과는 달리 ‘컴포넌트 로직 자체를 분할하거나 재사용’할 수 있습니다. )**
   3. hooks를 왜 만들게 되었는지
   4. 다양한 Hooks를 처음으로 접함

   저는 State Hook을 처음부터 다시 구현하여 작동하는 방식에 대한 심층적인 지식을 얻을 것입니다. 그렇게 함으로써 Hooks가 내부적으로 어떻게 작동하는지, 그리고 그 한계가 무엇인지 공부하겠습니다.
