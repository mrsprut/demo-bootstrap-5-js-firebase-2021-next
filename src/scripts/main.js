// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from 'firebase/app'
import firebaseConfig from '../config/firebase'
// import bootstrap from '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import { Modal } from 'bootstrap'

import TodoItemModel from './item'
import {
  serverItemModelToClientItemModel as sToCModelConvert,
  clientItemModelToServerItemModel as cToSModelConvert}
  from './utils'
import { fetchTodoItems, addTodoItem, updateTodoItem, deleteTodoItem } from './client'

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

/* state */
const viewState = {
  'items': [],
  'selectedItemId': null,
  'form': {
    'titleInput': '',
    'detailsInput': '',
    'dateInput': new Date().toISOString()
  },
  'fabSubmitInit': false
}

/* init */
const todoItemFormTitleInput = document.getElementById('todo-item-title')
const todoItemFormDetailsInput = document.getElementById('todo-item-details')
const todoItemFormDateInput = document.getElementById('todo-item-date')
const todoItemFormDateOutput = document.getElementById('todo-item-date-output')
const todoItemSaveButton = document.getElementById('todo-item-save')
const todoItemForm = document.querySelector('#saveModal form')
// const todoItemDetailsModalButton = document.getElementById('deleteModal__confirm')
const todoItemDeleteModalConfirmButton = document.getElementById('deleteModal__confirm')
const todoItemsContainerRow = document.getElementById('todo-items-container-row')
const fab = document.getElementById('fab')

/* bootstrap init */
const saveModal =
  new Modal(document.getElementById('saveModal'), {})

const deleteModal =
  new Modal(document.getElementById('deleteModal'), {})

// console.log(viewState.form.dateInput)

// todoItemFormDateInput.min = viewState.form.dateInput

function fetchItemsAction () {
  fetchTodoItems().then((response) => {
    return response.json()
  }).then((serverItemModel) => {
    if (serverItemModel.data) {
      viewState.items.length = 0
      serverItemModel.data.forEach((item) => {
        viewState.items.push(
          sToCModelConvert(item)
        )
      })
      fillItems()
    }
  })
}

todoItemFormTitleInput.addEventListener('change', (ev) => {
  viewState.form.titleInput = ev.target.value
})
todoItemFormDetailsInput.addEventListener('change', (ev) => {
  viewState.form.detailsInput = ev.target.value
})
let shouldDateInputChangeEmitting = true
todoItemFormDateInput.addEventListener('change', (ev) => {
  // console.log(ev.target.value)
  if (shouldDateInputChangeEmitting) {
    viewState.form.dateInput = ev.target.value
    /* todoItemFormDateInput.dataset.date =
      moment(viewState.form.dateInput, "YYYY-MM-DD").format(todoItemFormDateInput.dataset.dateFormat) */
    todoItemFormDateOutput.dataset.date =
      moment(viewState.form.dateInput, "YYYY-MM-DD").format(todoItemFormDateInput.dataset.dateFormat)
    const formDateInputChangeEvent = new Event('change', {'cancelable': true})
    shouldDateInputChangeEmitting = false
    // todoItemFormDateOutput.style.zIndex = 1000
    console.log(todoItemFormDateOutput)
    console.log(todoItemFormDateInput.dispatchEvent(formDateInputChangeEvent))
  } else {
    shouldDateInputChangeEmitting = true 
  }
})
todoItemFormDateOutput.addEventListener('click', (ev) => {
  const formDateInputClickEvent = new Event('click', {'cancelable': true})
  console.log(todoItemFormDateInput.dispatchEvent(formDateInputClickEvent))
})
todoItemSaveButton.addEventListener('click', (ev) => {
  const formSubmitEvent = new Event('submit', {'cancelable': true})
  // todoItemFormClone = todoItemForm.cloneNode(true)
  // todoItemForm.parentNode.replaceChild(todoItemFormClone, todoItemForm)
  // todoItemForm = todoItemFormClone
  if (!viewState.fabSubmitInit) {
    todoItemForm.addEventListener('submit', async (ev) => {
      ev.preventDefault()
      ev.stopPropagation()
      if (!todoItemForm.checkValidity()) {
        console.log('invalid')
      } else {
        if (viewState.selectedItemId) {
          // update item
          /* const selectedItem =
            viewState.items.find((item) => item.id === viewState.selectedItemId)
          if (selectedItem) {
            selectedItem.title = viewState.form.titleInput
            selectedItem.details = viewState.form.detailsInput
            selectedItem.date = viewState.form.dateInput
          } */
          const selectedItemOriginal =
            viewState.items.find((item) => item.id === viewState.selectedItemId)
          if (selectedItemOriginal) {
            const selectedItem = Object.assign({}, selectedItemOriginal)
            selectedItem.title = viewState.form.titleInput
            selectedItem.details = viewState.form.detailsInput
            selectedItem.date = viewState.form.dateInput
            selectedItem.id = viewState.selectedItemId
            const responseSuccess =
              await updateTodoItem(cToSModelConvert(selectedItem))
            if (responseSuccess) {
              selectedItemOriginal.title = viewState.form.titleInput
              selectedItemOriginal.details = viewState.form.detailsInput
              selectedItemOriginal.date = viewState.form.dateInput
            }
          }
          viewState.selectedItemId = null
        } else {
          // create item
          /* viewState.items.unshift(
            new TodoItemModel(
              viewState.form.titleInput,
              viewState.form.detailsInput,
              viewState.form.dateInput
            )
          ) */
          const newClientItem = new TodoItemModel(
            viewState.form.titleInput,
            viewState.form.detailsInput,
            viewState.form.dateInput
          )
          const responseId = await addTodoItem(cToSModelConvert(newClientItem))
          if (responseId) {
            newClientItem.id = responseId
            viewState.items.unshift(newClientItem)
          }
        }
        fillItems()
        saveModal.hide()
      }
      todoItemForm.classList.add('was-validated')
    })
    viewState.fabSubmitInit = true
  }
  console.log(todoItemForm.dispatchEvent(formSubmitEvent))
  
})

fab.addEventListener('click', (ev) => {
  todoItemForm.reset()
  todoItemForm.classList.remove('was-validated')
  todoItemFormDateOutput.dataset.date = ''
})

todoItemDeleteModalConfirmButton.addEventListener('click', async (ev) => {
  // элемент, найденный по его ИД
  const selectedItem =
    viewState.items.find((item) => item.id === viewState.selectedItemId)
  if (selectedItem) {
    // по индексу, определенному по ссылке на элемнт,
    // удаляем один элемент
    const responseSuccess = await deleteTodoItem(viewState.selectedItemId)
    if (responseSuccess) {
      viewState.items.splice(viewState.items.indexOf(selectedItem), 1)
      viewState.selectedItemId = null
      fillItems()
    }
    deleteModal.hide()
  }
})

function listItemEditButtonHandler (itemId) {
  viewState.selectedItemId = Number(itemId)
  const selectedItem =
    viewState.items.find((item) => item.id === viewState.selectedItemId)
  if (selectedItem) {
    viewState.form.titleInput = selectedItem.title
    viewState.form.detailsInput = selectedItem.details
    viewState.form.dateInput = selectedItem.date
    todoItemFormTitleInput.value = viewState.form.titleInput
    todoItemFormDetailsInput.value = viewState.form.detailsInput
    todoItemFormDateInput.valueAsDate = new Date(viewState.form.dateInput)
    todoItemFormDateOutput.dataset.date =
      moment(viewState.form.dateInput, "YYYY-MM-DD").format(todoItemFormDateInput.dataset.dateFormat)
  }
}

function listItemDetailsButtonHandler (itemId) {
  if (itemId) {
    const selectedItem =
      viewState.items.find((item) => item.id === Number(itemId))
    if (selectedItem) {
      const detailsModal = document.getElementById('detailsModal')
      detailsModal.querySelector('#detailsModal__title').innerHTML = selectedItem.title
      detailsModal.querySelector('#detailsModal__details').innerHTML = selectedItem.details
      detailsModal.querySelector('#detailsModal__date').innerHTML =
        moment(selectedItem.date, "YYYY-MM-DD").format('DD-MM-YYYY')
    }
  }
}

async function listItemToggleDoneButtonHandler (itemId) {
  if (itemId) {
    const selectedItemOriginal =
      viewState.items.find((item) => item.id === Number(itemId))
    if (selectedItemOriginal) {
      const selectedItem = Object.assign({}, selectedItemOriginal)
      selectedItem.done = !selectedItem.done
      const responseSuccess =
        await updateTodoItem(cToSModelConvert(selectedItem))
      if (responseSuccess) {
        selectedItemOriginal.done = selectedItem.done
        fillItems()
      }
    }
  }
}

function listItemDeleteButtonHandler (itemId) {
  if (itemId) {
    viewState.selectedItemId = Number(itemId)
  }
}

document.addEventListener('click', function(e) {
  const target = e.target
  if (target.dataset.bsTarget && target.dataset.bsTarget === '#detailsModal') {
    listItemDetailsButtonHandler(target.dataset.id)
  } else if (target.dataset.action && target.dataset.action === 'toggle-done') {
    listItemToggleDoneButtonHandler(target.dataset.id)
  } else if (target.dataset.bsTarget && target.dataset.bsTarget === '#saveModal') {
    listItemEditButtonHandler(target.dataset.id)
  } else if (target.dataset.bsTarget && target.dataset.bsTarget === '#deleteModal') {
    listItemDeleteButtonHandler(target.dataset.id)
  }
})

function fillItems () {
  // todoItemsContainerRow.innerHTML = ''
  console.log('fill', viewState.items)
  const itemViews = viewState.items.map(item =>
      `<div class="col-sm-1 col-md-6 col-lg-4 col-lg-3">
        <div class="card mb-3 ${item.done ? 'list-item-is-done' : ''}">
          <div class="row g-0">
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text ellipsed-text">
                  ${item.details}
                </p>
              </div>
            </div>
            <div class="col-md-4 d-flex align-items-center justify-content-sm-start justify-content-md-center">
              <div class="card-item-date-time-block">
                <div>
                  <span>Date: </span><span>${moment(item.date, "YYYY-MM-DD").format('DD-MM-YYYY')}</span>
                </div>
                <div>
                  <span>Time: </span><span>12:00</span>
                </div>
              </div>
            </div>
          </div>
          <div class="row g-0">
            <div class="col-md-12">
              <div class="card-item-block">
                <button class="btn btn-outline-secondary" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#detailsModal">Details</button>
                <button class="btn btn-outline-secondary" data-id="${item.id}" data-action="toggle-done">Done</button>
                <button class="btn btn-outline-secondary" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#saveModal">Edit</button>
                <button class="btn btn-outline-danger" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  ).reduce((resultView, currentView) => resultView += currentView, '')
  todoItemsContainerRow.innerHTML = itemViews
}

fetchItemsAction()