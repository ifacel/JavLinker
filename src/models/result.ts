export abstract class Result<T = any> {}

export class Ok<T> extends Result<T> {
  data: T;
  constructor(data: T) {
    super();
    this.data = data;
  }
}

export class Error extends Result<any> {
  message: string;
  constructor(message: string) {
    super();
    this.message = message;
  }
}

export class ImportantError extends Result<any> {
  message: string;
  action?: () => void;
  constructor(message: string, action?: () => void) {
    super();
    this.message = message;
    this.action = action;
  }
}
