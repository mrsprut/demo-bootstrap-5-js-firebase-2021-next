import TodoItemModel from './item'

function serverItemModelToClientItemModel (serverItemModel) {
  return new TodoItemModel(
    serverItemModel.title,
    serverItemModel.description,
    serverItemModel.date,
    serverItemModel.done,
    serverItemModel.id
  )
}

function clientItemModelToServerItemModel (clientItemModel) {
  return {
    'title': clientItemModel.title,
    'description': clientItemModel.details,
    'date': clientItemModel.date,
    'done': clientItemModel.done,
    'id': clientItemModel.id
  }
}

export {serverItemModelToClientItemModel, clientItemModelToServerItemModel}