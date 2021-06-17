import TodoItemModel from './item'

function serverItemModelToClientItemModel (serverItemModel) {
  return new TodoItemModel(
    serverItemModel.title,
    serverItemModel.description,
    serverItemModel.date,
    serverItemModel.userId,
    serverItemModel.done,
    serverItemModel.id
  )
}

function clientItemModelToServerItemModel (clientItemModel) {
  return {
    'title': clientItemModel.title,
    'description': clientItemModel.details,
    'date': clientItemModel.date,
    'userId': clientItemModel.userId,
    'done': clientItemModel.done,
    'id': clientItemModel.id
  }
}

export {serverItemModelToClientItemModel, clientItemModelToServerItemModel}