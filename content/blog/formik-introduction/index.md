---
title: "Formik: 無痛撰寫表單"
date: "2021-01-01"
description: "前端工程師應該都知道刻 Form 是一件很痛苦的事情。"
categories: ["Coding"]
tags: ["React", "JavaScript"]
---

前端工程師應該都知道刻 Form 是一件很痛苦的事情。

先來說個故事。

很久很久以前，一個前端工程師收到一個使用者的註冊頁面表單的需求，裡面要能夠填寫使用者帳號和密碼。因此寫了一個簡單的 Component ：

```jsx
export default function App() {
  const onSubmit = () => {
    // do something
  }

  return (
    <div className="App">
      <h1>Sign Up</h1>
      <div>
        <div>
          Username
          <input type="text" name="username" />
        </div>
        <div>
          Password
          <input type="password" name="password" />
        </div>
        <button onClick={onSubmit}>Submit</button>
      </div>
    </div>
  )
}
```

第一個問題來了，現在 `onSubmit()` 拿不到使用者輸入的值，那該怎麼辦呢？

我們可以用 state 來管理我們表單各個 input 的狀態，除此之外還要去監聽每個 input 的 `onChange()` 事件，並在事件發生的時候將改變的值寫回 state 。

因此將程式碼改寫成如下：

```jsx
export default function App() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const onUsernameChange = e => {
    const value = e.target.value
    setUsername(value)
  }

  const onPasswordChange = e => {
    const value = e.target.value
    setPassword(value)
  }

  const onSubmit = () => {
    const form = { username, password }
    // do something
  }

  return (
    <div className="App">
      <h1>Sign Up</h1>
      <div>
        <div>
          Username
          <input type="text" name="username" onChange={onUsernameChange} />
        </div>
        <div>
          Password
          <input type="password" name="password" onChange={onPasswordChange} />
        </div>
        <button onClick={onSubmit}>Submit</button>
      </div>
    </div>
  )
}
```

雖然多了一些程式碼，但是看起來還行。從此前端工程師過著幸福美好的日子。

才沒有。

過了幾天，主管氣噗噗的罵了前端工程師一頓。因為他沒有驗證使用者到底輸入了什麼東西，導致使用者輸入了太簡單的密碼，使用者的帳號就被盜刷了一百萬。前端工程師不只要把問題修好，還得用薪水償還使用者的損失。

哭啊 😭 。

所以我們要在 `onChange()` 發生的時候去檢查使用者填的內容對不對。如果不對的話，我們還要提示使用者哪一個 input 錯了。因此我們要：

1. 為每一個 input 寫驗證函式
2. 要有 state 儲存 input 的錯誤訊息
3. 改寫 `onChange()` 和 `onSubmit()` ，在做任何 side effect 操作前先做驗證
4. 如果有錯誤， input 下方要顯示錯誤訊息

最終將程式碼改寫成如下：

```jsx
export default function App() {
  const [username, setUsername] = useState("")
  const [usernameError, setUsernameError] = useState(null)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState(null)

  const validateUsername = value => {
    if (isEmpty(value)) {
      setUsernameError("username is required.")
    } else if (value.length < 2) {
      setUsernameError("Too short!")
    } else if (value.length > 50) {
      setUsernameError("Too long!")
    } else {
      setUsernameError(null)
    }
  }

  const onUsernameChange = e => {
    const value = e.target.value
    setUsername(value)
    validateUsername(value)
  }

  const validatePassord = value => {
    if (isEmpty(value)) {
      setPasswordError("password is required.")
    } else if (value.length < 2) {
      setPasswordError("Too short!")
    } else if (value.length > 50) {
      setPasswordError("Too long!")
    } else {
      setPasswordError(null)
    }
  }

  const onPasswordChange = e => {
    const value = e.target.value
    setPassword(value)
    validatePassord(value)
  }

  const onSubmit = () => {
    validateUsername(username)
    validatePassord(password)
    if (isEmpty(usernameError) && isEmpty(passwordError)) {
      const form = { username, password }
      // do something
    }
  }

  return (
    <div className="App">
      <h1>Sign Up</h1>
      <div>
        <div>
          Username
          <input type="text" name="username" onChange={onUsernameChange} />
          {usernameError && <div className="error">{usernameError}</div>}
        </div>
        <div>
          Password
          <input type="password" name="password" onChange={onPasswordChange} />
          {passwordError && <div className="error">{passwordError}</div>}
        </div>
        <button onClick={onSubmit}>Submit</button>
      </div>
    </div>
  )
}
```

到這裡前端工程師就覺得有點痛苦了。光寫一個註冊表單就這麼累了，萬一後面有一堆表單要做，那還是離職好了。

（故事完）

---

# Formik

我們在刻 Form 的時候，會遇到以下四個問題：

- Input 的事件追蹤
- 驗證 Input value
- 管理 Form 的狀態
- 一大堆 boilerplate code

要解決這些問題，我們可以透過 Library 來替我們處理掉惱人的部分。 Formik 可以替我們解決上述四個問題，並且讓我們能夠更專心在開發商務邏輯。

![Build forms in React, without the tears.](./formik.png)

## Get Start!

首先使用 npm 將 formik 安裝起來：

```bash
 npm install --save formik
```

接著你就可以透過 formik 提供的 component 將表單寫成更簡潔的形式：

```jsx
import { Formik, Form, Field, ErrorMessage } from "formik"

const App = () => (
  <div>
    <h1>Sign Up</h1>
    <Formik
      initialValues={{ name: "", password: "" }}
      validate={values => {
        const errors = {}
        if (!values.name) {
          errors.name = "Required"
        } else if (
          values.name.length < 2 || values.name.length > 15
        ) {
          errors.name = "Invalid name"
        }

        if (!values.password) {
          errors.password = "Required"
        } else if (
          values.password.length < 2 || values.password.length > 15
        ) {
          errors.password = "Invalid password"
        }

        return errors
      }}
      onSubmit={(values, { setSubmitting }) => {
        // ... do domething
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field name="name" />
          <ErrorMessage name="name" component="div" />
          <Field type="password" name="password" />
          <ErrorMessage name="password" component="div" />
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  </div>
)
```

我們由外而內檢視這份程式碼，可以看到

```jsx
<Formik
  initialValues={{ name: "", password: "" }}
  validate={values => {
    const errors = {}
    // ... do validation
    return errors
  }}
  onSubmit={(values, { setSubmitting }) => {
    // ... do domething
  }}
>
  ...
</Formik>
```

整個 form 被 `<Formik>` 包起來。 `<Formik>` component 可以

1. 透過 `initialValues` 傳入你 form 各個 input 初始值
2. `validate` 傳入你的驗證函式
3. `onSubmit` 傳入你按下 submit 後執行的函式

整個 form 的值以及狀態 formik 使用 React Context 儲存起來。

接著往裡面看

```jsx
<Field type="password" name="password" />
<ErrorMessage name="password" component="div" />
```

可以原本 `<input>` 和顯示錯誤訊息的 `<div>` 替換成 `<Field>` 和 `<ErrorMessage>` 。 `<Field>` 將 input 的值的狀態以及事件封裝起來，我們就不必再針對不同的 input 去寫 `onChange()` 函式。 `<ErrorMessage>` 則是將顯示錯訊息的邏輯封裝成一個 component 。

注意到 `<Field>` 跟 `<ErrorMessage>` 都有一個 `name` 的 props，他其實就是對應你在 `initialValues` 裡面的一個欄位 ， formik 就是透過這個你指定的 `name` 去追蹤他 input 的狀態。

以下是簡單的 Demo ：

<iframe src="https://codesandbox.io/embed/formik-demo-vailla-4bf7i?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Formik Demo Vailla"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

---

到目前為止我們已經可以做到簡單的登入表單。用了 formik 後 boilerplate code 少了很多，不過 validate 看起來很醜也不好維護，之後會講解 Formik 複雜的用法和 schema builder library Yup 的整合。

## Reference

* [Formik](https://formik.org)