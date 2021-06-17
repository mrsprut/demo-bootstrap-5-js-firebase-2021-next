export default class TodoItemModel {
  // static lastId = 0
  constructor(title, details, date, userId, done, id) {
    /* if (!id) {
      this.id = ++TodoItemModel.lastId
    } else {
      this.id = id
    } */
    this.id = id
    this.title = title
    this.details = details
    this.date = date
    this.userId = userId
    this.done = done
    // console.log(this)
  }
}