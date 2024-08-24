export class StatusMessagePresenter<T> {
  constructor(public status: number, public message: string, public data?: T) {}
}
