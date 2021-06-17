// const BASE_URL = 'http://localhost:4000/api'
const BASE_URL = 'https://us-central1-buki-2021.cloudfunctions.net/api'

async function fetchTodoItems (userId) {
  return await fetch(`${BASE_URL}/users/${userId}/items`)
}

async function addTodoItem (serverTodoItemModel) {
  const response =
    await fetch(
      `${BASE_URL}/users/${serverTodoItemModel.userId}/items`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serverTodoItemModel)
      }
    )
  const responseBody = await response.json()
  return response.status === 201 ? responseBody.data.id : false
}

async function updateTodoItem (serverTodoItemModel) {
  const response =
    await fetch(
      `${BASE_URL}/users/${serverTodoItemModel.userId}/items/${serverTodoItemModel.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serverTodoItemModel)
      }
    )
  return response.status === 200
}

async function deleteTodoItem (userId, id) {
  const response =
    await fetch(
      `${BASE_URL}/users/${userId}/items/${id}`,
      {
        method: 'DELETE'
      }
    )
  return response.status === 204
}

export {fetchTodoItems, addTodoItem, updateTodoItem, deleteTodoItem}