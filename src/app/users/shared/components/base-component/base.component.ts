import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Logger } from '../../../utils/client-logger';

/**
 * use for every component that need unsubscribe
 */
@Component({
  selector: 'app-base-component',
  standalone: true,
  template: '',
})
export class BaseComponent extends Logger implements OnDestroy {
  protected destroy$: Subject<void> = new Subject<void>();

  constructor() {
    super('BaseComponentComponent');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
