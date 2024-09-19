export abstract class Logger {
  private source: string | undefined;

  constructor(source: string) {
    this.source = source;
  }

  protected setSource(source: string) {
    this.source = `${ source }`;
  }

  protected log(message: string): void {
    this.print(message, 'black', 'log');
  }

  protected info(message: string): void {
    this.print(message, 'blue', 'info');
  }

  protected debug(message: string): void {
    this.print(message, 'green', 'debug');
  }

  protected error(message: string): void {
    this.print(message, 'red', 'error');
  }

  protected warn(message: string): void {
    this.print(message, 'red', 'warn');
  }

  private checkSource(): void {
    if (!this.source) {
      throw new Error('type source for BaseLogger');
    }
  }

  private print(
    message: string,
    color: string,
    type: 'log' | 'info' | 'debug' | 'error' | 'warn'
  ): void {
    this.checkSource();
    switch (type) {
      case 'log':
        console.log(`%c[${ this.source }] - ${ message }`, `color:${ color }`);
        break;
      case 'info':
        console.info(`%c[${ this.source }] - ${ message }`, `color:${ color }`);
        break;
      case 'debug':
        console.debug(`%c[${ this.source }] - ${ message }`, `color:${ color }`);
        break;
      case 'error':
        console.error(`%c[${ this.source }] - ${ message }`, `color:${ color }`);
        break;
      case 'warn':
        console.warn(`%c[${ this.source }] - ${ message }`, `color:${ color }`);
        break;
    }
  }
}

export class BaseLogger extends Logger {
  public override log(message: string): void {
    super.log(message);
  }

  public override info(message: string): void {
    super.info(message);
  }

  public override debug(message: string): void {
    super.debug(message);
  }

  public override error(message: string): void {
    super.error(message);
  }

  public override warn(message: string): void {
    super.warn(message);
  }
}
