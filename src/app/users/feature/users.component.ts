import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, interval, map, Subscription, take, takeUntil } from 'rxjs';
import { BaseComponent } from '../shared/components/base-component/base.component';
import { IUserForm, UsernameSearch } from '../../shared/interface/form.model';
import { UserFormHelperService } from '../utils/user-form-helper.service';
import { UsersService } from '../data-access/users.service';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent extends BaseComponent implements OnInit, OnDestroy {
  static readonly TIMER_COUNTDOWN: number = 5

  public invalidCount = signal(0);
  public countdown = signal(UsersComponent.TIMER_COUNTDOWN);
  public isCounting = signal(false);
  protected countdownMessage = computed(() => `0:0${ this.countdown() }`);
  private subscription!: Subscription;
  public usersFormArray: FormArray<FormGroup<IUserForm>>
  private submitted = false;

  constructor(private cd: ChangeDetectorRef,
              private userFormHelper: UserFormHelperService,
              private usersService: UsersService) {
    super();
    super.setSource('UsersComponent')
    this.usersFormArray = userFormHelper.createDefaultForm();
  }

  ngOnInit(): void {
    // check incorrect forms number after user stop typing if the submit button was clicked
    this.usersFormArray?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(v => {
        this.countInvalidForms();
      })
  }

  get formControls(): FormGroup[] {
    return this.usersFormArray.controls as FormGroup[]
  }

  public addForm() {
    this.userFormHelper.addForm(this.usersFormArray);
    this.cd.detectChanges();
    // show error on newly added form if submit button was already pressed
    if (this.submitted) {
      const formGroup = this.usersFormArray.controls[this.usersFormArray.length - 1] as FormGroup;
      formGroup.markAllAsTouched();
      this.userFormHelper.updateValidityForSingleForm(formGroup);
    }
  }

  public get isFormLengthValid(): boolean {
    return this.userFormHelper.isFormLengthValid(this.usersFormArray);
  }

  public removeForm(index: number): void {
    this.usersFormArray.removeAt(index);
    this.countInvalidForms();
    if (this.usersFormArray.length === 0) {
      this.submitted = false;
    }
  }

  private countInvalidForms(): void {
    this.invalidCount.set(this.userFormHelper.invalidControlsAmount(this.usersFormArray));
  }

  private startSendingTimer() {
    this.isCounting.set(true);
    this.subscription = interval(1000)
      .pipe(
        takeUntil(this.destroy$),
        take(UsersComponent.TIMER_COUNTDOWN),
        map(value => 4 - value)
      )
      .subscribe({
        next: (value) => {
          this.countdown.set(value);
        },
        complete: () => {
          this.isCounting.set(false);
          this.countdown.set(UsersComponent.TIMER_COUNTDOWN);
          this.usersService.createUsers(this.usersFormArray.getRawValue()).subscribe(v => {
            this.usersFormArray.clear();
            this.submitted = false;
            this.cd.detectChanges();
            this.log(`form submitted successfully, ${ v.result }`)
          })
          this.log('Countdown complete');
        }
      });
  }

  public cancelTimer() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.isCounting.set(false);
      this.log('Timer canceled');
      this.countdown.set(UsersComponent.TIMER_COUNTDOWN);
    }
  }


  public submit(): void {
    this.submitted = true;
    this.usersFormArray.markAllAsTouched();
    this.userFormHelper.updateValadityForAllForms(this.usersFormArray);
    this.countInvalidForms();

    if (this.invalidCount() === 0) {
      this.startSendingTimer();
    }
  }

  public checkUsername(data: UsernameSearch) {
    if (data.value && data.index < this.usersFormArray.length) {
      this.log(`validating user`);
      this.usersService.checkUsername(data.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res.isAvailable) {
            this.log('user is valid');
          } else {
            this.log('user is not valid');
            this.usersFormArray.controls[data.index].get('username')?.setErrors({ 'invalid': true });
            this.countInvalidForms();
            this.cd.detectChanges()
          }
        })
    } else {
      this.warn(`incorrect username checking params, ${ JSON.stringify(data) }`)
    }
  }
}
