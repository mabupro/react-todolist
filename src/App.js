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
