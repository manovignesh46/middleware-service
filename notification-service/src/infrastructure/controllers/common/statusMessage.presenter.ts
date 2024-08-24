export class StatusMessagePresenter<T> {
  constructor(public status: number, public message: string, public data?: T) {}
}

export const generateMockStatusPresenter = (
  status: number,
  message: string,
  data: any,
) => {
  return new StatusMessagePresenter(status, message, data);
};
