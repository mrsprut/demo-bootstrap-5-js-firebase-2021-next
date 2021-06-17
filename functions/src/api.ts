exports.api = function (functions) {

  const express =  require('express')
  const cors =  require('cors')

  class TodoItemModel {
    private static lastId: number = 0
    public id: number
    public title: String
    public description: String
    public date: Date
    public userId: string
    public done: Boolean
    constructor (
      title: String,
      description: String,
      date: Date,
      userId: string,
      id: number = 0,
      done: Boolean = false
    ) {
      if(!id || id === 0) {
        this.id = ++TodoItemModel.lastId
      } else {
        this.id = id
      }
      this.title = title
      this.description = description
      this.date = date
      this.userId = userId
      this.done = done
    }
  }
  
  const repository = {
    todoList: []
  }

  const app = express()

  app.use((req, res, next) => { next(); }, cors({maxAge: 84600}))

  app.route('/users/:userId/items')
    .get(function (req, res) {
      try {
        res.send(
          `{"data": ${JSON.stringify(
            repository.todoList
              .filter(todo => todo.userId === req.params.userId)
              .sort((item1, item2) => item2.id - item1.id)
          )}}`
        )
      } catch (error) {
        res.status(500).json({"error": error})
      }
    })
    .post(function (req, res) {
      try {
        const newItem = req.body
        const newServerTodoItemModel =
          new TodoItemModel(newItem.title, newItem.description, newItem.date, req.params.userId)
        repository.todoList.push(newServerTodoItemModel)
        res.status(201).json(
          {
            "message": "a new todo item was created",
            "data": {"id": newServerTodoItemModel.id}
          }
        )
      } catch (error) {
        res.status(500).json({"error": error})
      }
    })

  app.route('/users/:userId/items/:id')
    .put(function (req, res) {
      try {
        const currentTodo =
          repository.todoList.find(
            todo => todo.id === Number(req.params.id)
              && todo.userId === req.params.userId
          ) ?? null
        if (currentTodo) {
          const updatedItem = req.body
          currentTodo.title = updatedItem.title
          currentTodo.description = updatedItem.description
          currentTodo.date = updatedItem.date
          currentTodo.done = updatedItem.done
        }
        res.status(200).send()
      } catch (error) {
        res.status(500).json({"error": error})
      }
    })
    .delete(function (req, res) {
      try {
        repository.todoList.splice(
          repository.todoList.findIndex(
            todo => todo.id === Number(req.params.id)
              && todo.userId === req.params.userId
          ),
          1
        )
        res.status(204).send()
      } catch (error) {
        res.status(500).json({"error": error})
      }
    })
  // Expose Express API as a single Cloud Function:
  return functions.https.onRequest(app);
}