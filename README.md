---
title: 2023年度版【React x Firebase】Todoアプリの制作を通して勉強する
tags: React Firebase Firestore todo 初心者
author: mabupro
slide: false
---
# はじめに

今回は、Reactの勉強の第一歩として「Todoアプリ」の作成をしてみました。 Youtubeで2年前の動画の内容で使えなかったコードなどを使えるようにしました。

https://youtube.com/playlist?list=PLW9nKlZ_FyqjcplnIMR9GliMoYl7p8mOs


**目標は「ログイン・ログアウト機能」の実装ということです。**
「Firebase Firestore」を用いることで、「User情報を保存すること」や「Todo情報を保存する」ということが出来るようになりました。

Firestoreのルールをまだ記述していないのでガバガバwebアプリですが、一度完成品は以下のようになっています。

**今回の完成品**
https://react-todolist-a2dda.web.app/

![TodoApp (2).PNG](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2989040/8fe09cfb-9d58-078b-581e-e698093c99e1.png)


# 実際の進め方のハンズオン資料

いつか勉強したい人が現れると信じて、ハンズオンの進め方を工程ごとに表しました。

作るだけならコピペをして値を変えることで終わりますが、作る工程を知るというのも個人的にはプログラミング学習で**重要**だと考えているので載せておきます。

記事は解説不足なので、付け足します。
https://mabupro-web-site.web.app/#0

↑↑↑いずれこのCodeLab形式の解説のやり方も説明します。

# Reactの参考資料

### 公式サイト
私もReactを勉強する上でReact公式サイトにアクセスすることが多い。必要なことは基本的にここで調べると良いと思います。

https://ja.legacy.reactjs.org/docs/getting-started.html#try-react

### 個人的に見ておくと良いサイト
Reactがどのようなものかを感覚的に理解するときにみるとよいのが次の資料です。
学習を始める前に「#01」「#02」を軽く見ておく、または実践的してみると良いと思います。

:::note warn
この資料は「2018年」に記述されています。根本的な部分はあまり変わっていませんが、そのまま進めることはオススメできません。
:::

https://note.com/natsukingdom/n/n2dd88d531f22

https://note.com/natsukingdom/n/n4f584fb7d1fd


# 必要なコンソール操作とコード完成品

## 前提条件として必要なもの

### node -v

:::note info
Windowsの`cmd`でコマンドを実行して確認しておいてください、
:::

```shell
node -v
```

## VScode内の`cmd`で実行した方が良いと思うコマンド

### npm create-react-app .　or　npm create-react-app ファイル名

reactを学習するときには、このコマンドを実行しておきましょう。

https://ja.legacy.reactjs.org/docs/create-a-new-react-app.html

現在のフォルダに作成↓↓↓
```shell
npm creat-react-app .
```
`cd`コマンドなどで移動したフォルダの中に、新たにフォルダを作成する場合↓↓↓

```shell
npm creat-react-app <ファイル名>
```

### npm i react-rooter-dom

サイト内ページ遷移に必要なものです。

### npm i bootstrap

サイトの装飾に必要なものです。

# データベース設計

![React-TodoApp-Firestore.jpg](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2989040/d78138ff-6a41-2d5d-c816-f09cff1f4877.jpeg)

user1人に対して、Todo情報を複数持つという形ですね。

# ファイル構成

**作成が必要なファイルはだいたいここにある**
実際には`create-react-app`コマンドを使うのでいくつかフォルダ・ファイルが生まれるが必要ないものは削除して構わない。
``` 
C:react-todolist/src
│  App.css
│  App.js
│  index.css
│  index.js
│  reportWebVitals.js
│  setupTests.js
│
├─Components
│      Header.js
│      Home.js
│      IndividualTodo.js
│      Login.js
│      Modal.js
│      NotFound.js
│      Signup.js
│      Todos.js
│
├─images
│      TodoAppicon.png
│
└─services
        firebase.config.js
```

# コードの完成品
今回は　[実際の進め方のハンズオン資料](#実際の進め方のハンズオン資料)　の通りに進めてくれれば、基本的に問題はないと思います。

必要なインストールを済ませて、フォルダやファイルを作成して、コピペしていただけたら完成はします。

## src / App.js
<details><summary>App.js</summary><div>

```app.jsx
import React, { Component } from 'react'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './Components/Home'
import { Login } from './Components/Login'
import { Signup } from './Components/Signup'
import { NotFound } from './Components/NotFound'
import { auth, db } from './services/firebase.config'
import { doc, getDoc, deleteDoc, query, where, collection, onSnapshot } from 'firebase/firestore';

export class App extends Component {

  state = {
    currentUser: null,
    todos: [],
    editTodoValue: null
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        getDoc(doc(db, 'users', user.uid)).then(snapshot => {
          this.setState({
            currentUser: snapshot.data().userName
          })
        })
      }
      else {
        console.log("user is not signed")
      }
    })

    auth.onAuthStateChanged(user => {
      if (user) {
        const todoList = [];
        const q = query(
          collection(db, 'todos of' + user.uid),
          where('userId', '==', user.uid)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              todoList.push({
                id: change.doc.id,
                Todo: change.doc.data().Todo,
              });
            }
            if (change.type === 'removed') {
              //console.log(change.type);
              for (let i = 0; i < todoList.length; i++) {
                if (todoList[i].id === change.doc.id) {
                  todoList.splice(i, 1);
                }
              }
            }
          });
          // console.log('TODOリスト:', todoList);
          this.setState({ todos: todoList });
        });
        return unsubscribe;
      }
      else {
        console.log('user is not signed');
      }
    });
  }

  deleteTodo = (id) => {
    // console.log(id);
    auth.onAuthStateChanged((user) => {
      if (user) {
        const docRef = doc(db, 'todos of' + user.uid, id);
        deleteDoc(docRef)
          .then(() => {
            console.log('Document successfully deleted!');
          })
          .catch((error) => {
            console.error('Error removing document: ', error);
          });
      } else {
        console.log('user is not signed');
      }
    });
  };

  editModal = (obj) => {
    this.setState({
      editTodoValue: obj
    })
  }

  updateTodoHandler = (editTodo, id) => {
    // console.log(editTodo, id);
    const todoList = this.state.todos;
    for(let i=0;i<todoList.length;i++){
      if(todoList[i].id===id){
        todoList.splice(i,1,{id,Todo: editTodo});
      }
      this.setState({
        todos:todoList
      })
    }
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route path='/' element={<Home
            currentUser={this.state.currentUser}
            todos={this.state.todos}
            deleteTodo={this.deleteTodo}
            editTodoValue={this.state.editTodoValue}
            editModal={this.editModal}
            updateTodoHandler={this.updateTodoHandler}
          />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
    )
  }
}

export default App
```
</div></details>

## src / index.css
<details><summary>index.css</summary><div>

```
* {
  margin: 0;
  padding: 0;
}

div.wrapper {
  overflow-x: hidden;
  overflow-y: auto;
}

/* header */
.header-box {
  width: 100%;
  height: auto;
  padding: 50px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: #0170ad;
}

@media(max-width:768px){
  .header-box{
    flex-direction: column;
    justify-content: center;
  }
}

.header-box .leftside {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

@media(max-width: 768px){
  .header-box .leftside{
      width: 100%;
      flex-direction: column-reverse;
      justify-content: center;
      text-align: center;
      margin-bottom: 20px;
  }
}

.header-box .leftside .img {
  width: 170px;
  height: 170px;
}

.header-box .leftside .img img {
  width: 100%;
  height: 100%;
}

.header-box .leftside .content {
  color: #fff;
}

.header-box .leftside .content .heading-big {
  font-size: 42px;
}

.header-box .leftside .content .heading-small {
  font-size: 24px;
}

.header-box .rightside {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media(max-width:768px){
  .header-box .rightside{
    width: 100%;
    text-align: center;
  }
}

.header-box .rightside .btn, .header-box .rightside .btn:hover{
  width: 100px;
  margin-bottom: 5px;
  color: #fff;
  text-decoration: none;
}

.date-section{
  color: #fff;
}

.date-section span{
  margin-left: 4px;
}

/* sign up */
@media(max-width:539px){
  .register{
    width:100%
  }
}

.error-msg{
  color: red;
  width:100%;
  font-size:14px;
  font-weight: 600;
}

.welcome-div{
  color: #fff;
  letter-spacing: 0.09em;
}

/* todo */
.todo{
  background-color: #e4e4e4;
  font-weight: 600;
  font-size: 16px; 
  margin: 10px 0px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo .actions-div{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.todo .actions-div div{
  margin: 0px 10px;
  cursor: pointer;
}

.delete-btn{
  color: rgb(165, 2, 2);
  cursor: pointer;    
}

.modal-container{
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-container .modal{
    display: block;
    width: 70%;
    height: 70vh;
    background-color: #fff;
    border-radius: 20px;
    margin: 60px 15%;
}

@media(max-width: 768px){
    .modal-container .modal{
        width: 100%;
        height: 100vh;
        margin: 0;
        border-radius: 0px;
    }
}

.modal-container .modal .header{
    width: 100%;
    height: auto;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-container .modal .header .update-text{
    font-size: 24px;
    font-weight: 600;
    width: 100%;
}

.modal-container .modal .header .close-btn{
    color: rgb(165, 2, 2);
    cursor: pointer;
}
```
</div></details>

## Components / Header.js
<details><summary>Header.js</summary><div>

```Header.jsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import todoIcon from '../images/TodoAppicon.png'
import 'bootstrap/dist/css/bootstrap.css'
import '../index.css'

import {auth} from '../services/firebase.config'

export const Header = ({ currentUser }) => {

    const [year, setYear] = useState(null);
    const [date, setDate] = useState(null);
    const [month, setMonth] = useState(null);
    const [day, setDay] = useState(null);

    useEffect(() => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentDateOfMonth = currentDate.getDate();
        const currentMonth = currentDate.toLocaleString('ja-JP', { month: 'long' });
        const currentDay = currentDate.toLocaleDateString('js-JP', { weekday: 'long' });

        setYear(currentYear);
        setDate(currentDateOfMonth);
        setMonth(currentMonth);
        setDay(currentDay);
    }, [])

    const handleLogout = () => {
        auth.signOut().then(() => {
            window.location.reload();
        });
    }


    return (
        <div className='header-box'>

            <div className='leftside'>

                <div className='img'>
                    <img src={todoIcon} alt='todoIcon' />
                </div>

                <div className='content'>
                    <div className='heading-big'>
                        work to do?
                    </div>
                    <div className='heading-small'>
                        Let's make a list!
                    </div>

                </div>

            </div>
            <div className='rightside'>

                {!currentUser && <>
                    <Link className='btn btn-primary btn-md' to="signup">
                        SIGN UP
                    </Link>
                    <Link className='btn btn-secondary btn-md' to="login">
                        LOGIN
                    </Link>
                    <br/>
                    <div className='date-section'>
                        <span>{year}年</span>
                        <span>{month}</span>
                        <span>{date}日</span>
                        <span>{day}</span>
                    </div>

                </>}

                {currentUser && <div className='welcome-div'>

                    <h2>WELCOME</h2>
                    <h5>{currentUser}</h5>
                    <br/>
                    <div className='date-section'>
                        <span>{year}年</span>
                        <span>{month}</span>
                        <span>{date}日</span>
                        <span>{day}</span>
                    </div>
                    <br/>
                    <button className='btn btn-danger'
                        onClick={handleLogout}>LOGOUT</button>
                </div>}
                
            </div>
        </div>
    )
}

```
</div></details>

## Components / Home.js
<details><summary>Home.js</summary><div>

```Home.jsx
import React, { useState } from 'react'

import '../index.css'

import { Header } from './Header'
import { Todos } from './Todos'
import { Modal } from './Modal'

import { auth, db } from '../services/firebase.config'
import { collection, addDoc } from 'firebase/firestore'

export const Home = ({ currentUser, todos,deleteTodo,editTodoValue,editModal,updateTodoHandler }) => {

    const [todo, setTodo] = useState('');
    const [todoError, setTodoError] = useState('');

    const handleTodoSubmit = async (e) => {
        e.preventDefault();
        await auth.onAuthStateChanged(user => {
            if (user) {
                addDoc(collection(db, 'todos of' + user.uid), {
                    Todo: todo,
                    userId: user.uid
                }).then(setTodo('')).catch(err => setTodoError(err.message))
            }
            else {
                console.log("user is not signed");
            }
        })
    }

    return (
        <div className='wrapper'>
            <Header currentUser={currentUser} />
            <br />
            <br />
            <div className='container'>
                <form autoComplete='off' className='form-group'
                    onSubmit={handleTodoSubmit}
                >

                    {currentUser && <>
                        <input type="text" placeholder="Enter TODO's"
                            className='form-control' required
                            onChange={(e) => setTodo(e.target.value)}
                            value={todo}
                        />
                        <br />
                        <div style={{
                            width: 100 + '%',
                            display: 'flex', justifyContent: 'flex-end'
                        }}>
                            <button type="submit" className='btn btn-success'
                                style={{ width: 100 + '%' }}>
                                ADD
                            </button>
                        </div>

                    </>}

                    {!currentUser && <>
                        <input type="text" placeholder="Enter TODO's"
                            className='form-control' required disabled
                        />
                        <br />
                        <div style={{
                            width: 100 + '%',
                            display: 'flex', justifyContent: 'flex-end'
                        }}>
                            <button type="submit" className='btn btn-success'
                                disabled style={{ width: 100 + '%' }}>
                                ADD
                            </button>
                        </div>
                        <div className='error-msg'>
                            Please register your account or login to use application
                        </div>
                    </>}

                </form>
                {todoError && <div className='error-msg'></div>}
                <Todos 
                    todos={todos}
                    deleteTodo={deleteTodo}
                    editModal={editModal}
                />
            </div>

            {editTodoValue && <Modal 
                editTodoValue={editTodoValue}
                editModal={editModal}
                updateTodoHandler={updateTodoHandler}
            />}

        </div>
    )
}

```
</div></details>

## Components / IndividualTodo.js
<details><summary>IndividualTodo.js</summary><div>

```IndividualTodo.jsx
import React from 'react'

import {FiEdit} from 'react-icons/fi'
import {FaTrashAlt} from 'react-icons/fa'

export const IndividualTodo = ({ individualTodo,deleteTodo,editModal }) => {

    const handleDelete=()=>{
        deleteTodo(individualTodo.id);
    }

    const handleEditModal=()=>{
        editModal(individualTodo);
    }

    return (
        <div className='todo'>
            <div>
                {individualTodo.Todo}
            </div>
            <div className='actions-div'>

                <div onClick={handleEditModal}>
                    <FiEdit size={18} />
                </div>

                <div className='delete-btn' onClick={handleDelete}>
                    <FaTrashAlt size={18} />
                </div>
                
            </div>
        </div>
    )
}

```
</div></details>

## Components / Login.js
<details><summary>Login.js</summary><div>

```Login.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase.config'

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loginError, setLoginError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setEmail('');
            setPassword('');
            setLoginError('');
            navigate('/');
        } catch (error) {
            setLoginError(error.message);
        }
    };

    return (
        <div className='container'>
            <br />
            <br />
            <h2>LOGIN HERE</h2>
            <br />

            <form autoComplete="off" className='form-group'
                onSubmit={handleLogin}
            >

                <label>Enter Email</label>
                <input type="email" className='form-control'
                    required onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />

                <br />

                <label>Enter Password</label>
                <input type="password" className='form-control'
                    required onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />

                <br />

                <button type="submit" className='btn btn-success mybtn2'>
                    LOGIN
                </button>

            </form>

            {loginError && <div className='error-msg'>
                {loginError}
            </div>}

            <span>Don't have an account? Create One
                <Link to="/signup"> here</Link>
            </span>

        </div>
    )
}
```
</div></details>

## Components / Modal.js
<details><summary>Modal.js</summary><div>

```Modal.jsx
import React, { useState } from 'react'

import { FiXCircle } from 'react-icons/fi'

import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from '../services/firebase.config'

export const Modal = ({ editTodoValue, editModal,updateTodoHandler }) => {

    const [editTodo, setEditTodo] = useState(editTodoValue.Todo);

    const handleClose = () => {
        editModal(null)
    }

    const handleEditTodoSubmit = async (e) => {
        e.preventDefault();
        handleClose();
        updateTodoHandler(editTodo, editTodoValue.id);
        await auth.onAuthStateChanged(user => {
            if (user) {
                const todoRef = doc(db, 'todos of' + user.uid,editTodoValue.id);
                updateDoc(todoRef, {
                    Todo: editTodo
                })

            }
            else {
                console.log("user is not signed");
            }
        })
    }

    return (
        <div className='modal-container'>

            <div className='modal'>

                <div className='header'>

                    <div className='update-text'>
                        Update your todo
                    </div>

                    <div className='close-btn'
                        onClick={handleClose}
                    >
                        <FiXCircle size={28} />
                    </div>

                </div>

                <div className='container-fluid'>
                    <form autoComplete="off" className='form-group'
                        onSubmit={handleEditTodoSubmit}
                    >
                        <input type="text" className='form-control'
                            required placeholder="Update your todo"
                            value={editTodo}
                            onChange={(e)=>setEditTodo(e.target.value)}
                        />

                        <br />

                        <button type="submit" className='btn btn-success btn-lg'>
                            UPDATE
                        </button>
                        
                    </form>
                </div>

            </div>
        </div>
    )
}

```
</div></details>

## Components / NotFound.js
<details><summary>NotFound.js</summary><div>

```NotFound.jsx
import React from 'react'

export const NotFound = () => {
    return (
        <div>NotFound</div>
    )
}

```
</div></details>

## Components / Signup.js
<details><summary>Signup.js</summary><div>

```Signup.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase.config';


export const Signup = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registerError, setRegisterError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const { uid } = userCredential.user;
            console.log(userName, email, password, uid);
            await setDoc(doc(db, 'users', uid), {
                userName: userName,
                Email: email,
                Password: password,
            });
            setUserName('');
            setEmail('');
            setPassword('');
            setRegisterError('');
            navigate('/login');
        } catch (error) {
            setRegisterError(error.message);
        }
    };

    return (
        <div className="container">
            <br />
            <br />
            <h2>SIGN UP NOW!</h2>
            <br />

            <form autoComplete="off" className="form-group" onSubmit={handleRegister}>
                
                <label>User Name</label>
                <input
                    type="text"
                    className="form-control"
                    required
                    onChange={(e) => setUserName(e.target.value)}
                    value={userName}
                />

                <br />

                <label>Email</label>
                <input
                    type="email"
                    className="form-control"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />

                <br />

                <label>Password</label>
                <input
                    type="password"
                    className="form-control"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                
                <br />

                <button type="submit" className="btn btn-success register">
                    REGISTER
                </button>

            </form>

            {registerError && (
                <div className="error-msg">
                    {registerError}
                </div>
            )}

            <span>
                Already have an account? Login
                <Link to="/login">here</Link>
            </span>
        </div>
    );
};

```
</div></details>

## Components / Todos.js
<details><summary>Todos.js</summary><div>

```Todos.jsx
import React from 'react'
import { IndividualTodo } from './IndividualTodo'

export const Todos = ({todos,deleteTodo,editModal}) => {
    return todos.map((individualTodo)=>(
        <IndividualTodo
            individualTodo={individualTodo}
            key={individualTodo.id}
            deleteTodo={deleteTodo}
            editModal={editModal}
        />
    ))
}
```
</div></details>

## services / firebase.config.js
<details><summary>firebase.config.js</summary><div>

```firebase.config.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "your_config_code",
    authDomain: "your_config_code",
    projectId: "your_config_code",
    storageBucket: "your_config_code",
    messagingSenderId: "your_config_code",
    appId: "your_config_code",
    measurementId: "your_config_code"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
```
</div></details>

# 終わりに

Todoアプリを作って、色々と機能を追加していくことで、ReactやFirestoreのデータベース操作の様々な作成方法を理解することが出来ました。

想像したものを作るにはその前提知識が必要になるので、その勉強は欠かせないですね。

前回「いつでも、ランチチェック」というような学食の売り切れ情報を確認するアプリを作りましたが、Reactを勉強していくなかで、jsだけに比べて機能ごとに作成しやすくなるとともに管理もしやすくなるなぁと感じましたので、これからはReactで作成していきたいと思います。

皆さんも、今の時代(2023/05/22)は色々な情報が提供されている時代なので、調べたり相談したりしてやってみてください。
