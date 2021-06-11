// const BASE_URL = 'http://localhost:4000/api'
const BASE_URL = 'https://us-central1-buki-2021.cloudfunctions.net/api'

async function fetchTodoItems () {
  return await fetch(`${BASE_URL}/items`)
}

async function addTodoItem (serverTodoItemModel) {
  const response =
    await fetch(
      `${BASE_URL}/items`,
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
      `${BASE_URL}/items/${serverTodoItemModel.id}`,
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

async function deleteTodoItem (id) {
  const response =
    await fetch(
      `${BASE_URL}/items/${id}`,
      {
        method: 'DELETE'
      }
    )
  return response.status === 204
}

export {fetchTodoItems, addTodoItem, updateTodoItem, deleteTodoItem}