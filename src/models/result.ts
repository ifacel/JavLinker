export abstract class Result<T = any> { }

export class Ok<T> extends Result<T> {
  data: T;
  constructor(data: T) {
    super();
    this.data = data;
  }
}

export class Error<T = any> extends Result<T> {
  message: string;
  constructor(message: string) {
    super();
    this.message = message;
  }
}

export class ImportantError<T = any> extends Result<T> {
  message: string;
  constructor(message: string) {
    super();
    this.message = message;
  }
}

export enum ActionType {
  Link,
}

export class ActionError<T = any> extends Result<T> {
  message: string;
  actionType: ActionType;
  actionTooltip: string;
  data: string;
  constructor(message: string, actionType: ActionType, tooltip: string, action: string) { 
    super();
    this.message = message;
    this.actionType = actionType;
    this.actionTooltip = tooltip;
    this.data = action;
  }
}
