import React, { Component } from "react";
import PropTypes from "prop-types";
import TodoList from "../components/TodoList";
import { INIT_TODOS } from "../constants/constants";
import update from "immutability-helper";
import TodoForm from "../components/TodoForm";
import TodoListAPI from "../shared/apis/TodoListAPI";

class TodoContainer extends Component {
  constructor(props) {
    super(props);

    this.onMarkDone = this.onMarkDone.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onAdd = this.onAdd.bind(this);

    this.state = {
      todoList: INIT_TODOS,
    };
  }

  componentDidMount() {
    TodoListAPI.getAllTodos().then((response) => {
      const todos = response.data.map((todo) => ({
        index: parseInt(todo.id),
        value: todo.content,
        done: todo.status,
      }));
      this.setState({ todoList: todos });
    });
  }

  onMarkDone(index) {
    const { todoList } = this.state;
    const todo = todoList[index];
    const updatedTodoList = update(todoList, {
      [index]: { $merge: { done: !todo.done } },
    });

    this.setState({
      todoList: updatedTodoList,
    });
    
    TodoListAPI.updateTodoById(index);
  }

  onDelete(index) {
    const { todoList } = this.state;

    TodoListAPI.deleteTodoById(index).then(() => {
      const updatedTodoList = update(todoList, { $splice: [[index, 1]] });

      this.setState({
        todoList: updatedTodoList,
      });
    });
  }

  onAdd(todoValue) {
    const { todoList } = this.state;

    const updatedTodoList = update(todoList, {
      $push: [
        {
          index: todoList.length,
          value: todoValue,
          done: false,
        },
      ],
    });

    this.setState({
      todoList: updatedTodoList,
    });

    // TodoListAPI.createTodo({ content: todoValue, status: false });
  }

  render() {
    return (
      <div>
        <TodoList
          todoList={this.state.todoList}
          onMarkDone={this.onMarkDone}
          onDelete={this.onDelete}
        />
        <TodoForm onAdd={this.onAdd} />
      </div>
    );
  }
}

TodoContainer.propTypes = {
  onMarkDone: PropTypes.func,
};

export default TodoContainer;
