import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { NgbDateStruct, NgbInputDatepicker, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable, OperatorFunction, takeUntil } from 'rxjs';
import { ValidationDirective } from '../../shared/directives/validation.directive';
import { Country } from '../../../shared';
import { Fields } from '../../../shared/enum/fields';
import { UsernameSearch } from '../../../shared/interface/form.model';
import { BaseComponent } from '../../shared/components/base-component/base.component';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [
    NgIf,
    NgbInputDatepicker,
    NgbTypeahead,
    ReactiveFormsModule,
    ValidationDirective
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent extends BaseComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() index!: number;
  @Output() remove: EventEmitter<number> = new EventEmitter<number>();
  @Output() usernameSearch: EventEmitter<UsernameSearch> = new EventEmitter<UsernameSearch>();

  countries = Object.values(Country);
  maxDate: NgbDateStruct;
  public fields = Fields;

  constructor() {
    super();
    const currentDate: Date = new Date();
    this.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
  }

  ngOnInit(): void {
    if (!this.formGroup) {
      throw new Error('property formGroup is required')
    }

    if (this.index === undefined) {
      throw new Error('property index is required')
    }

    this.formGroup.get('username')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(value => {
      if (value !== '') {
        this.usernameSearch.emit({ value: value, index: this.index });
      }
    })
  }

  // Autocomplete search for countries
  searchCountries: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((v) => {
          // if not letters - return
          if (!v.match(/[a-z]/i)) {
            return [];
          }
          return this.countries.filter(country => country.toLowerCase().startsWith(v.toLowerCase()));
        }
      ),
    );
  };

  formatter = (country: string) => country;
}
