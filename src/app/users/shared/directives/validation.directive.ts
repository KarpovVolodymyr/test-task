import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ValidationService } from '../services/validation.service';
import { Fields } from '../../../shared/enum/fields';

@Directive({
  selector: '[formValidation]',
  standalone: true,
})
export class ValidationDirective implements OnInit, OnDestroy {
  @HostListener('blur', ['$event'])
  onBlur(): void {
    this.updateErrorMessage();
  }

  @Input('formValidation') controlName!: Fields;
  private control!: AbstractControl;
  private errorElement!: HTMLElement;
  private statusChangeSubscription!: Subscription;
  private destroy$: Subject<void> = new Subject<void>();


  constructor(private el: ElementRef,
              private formGroupDirective: FormGroupDirective,
              private renderer: Renderer2,
              private validationService: ValidationService) {
  }

  ngOnInit() {
    this.control = this.formGroupDirective.form.get(this.controlName) as AbstractControl;

    // Create an element to show the error message
    this.errorElement = this.renderer.createElement('small');
    this.renderer.addClass(this.errorElement, 'text-danger');
    this.renderer.addClass(this.errorElement, 'validation-message');
    this.renderer.setStyle(this.errorElement, 'display', 'none');
    this.renderer.appendChild(this.el.nativeElement.parentNode, this.errorElement);

    // Listen for status changes and display the error message
    this.statusChangeSubscription = this.control.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateErrorMessage();
      });
  }

  private updateErrorMessage() {
    if (this.control.invalid && (this.control.dirty || this.control.touched)) {
      const errors = this.control.errors;
      const firstKey = Object.keys(errors!)[0];
      const errorMessage = this.getErrorMessage(firstKey);

      this.renderer.setProperty(this.errorElement, 'innerText', errorMessage);
      this.renderer.setStyle(this.errorElement, 'display', 'block');
    } else {
      this.renderer.setStyle(this.errorElement, 'display', 'none');
    }
  }

  private getErrorMessage(errorKey: string): string {
    return this.validationService.getError(this.controlName, errorKey);
  }

  ngOnDestroy() {
    if (this.statusChangeSubscription) {
      this.statusChangeSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
