import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country } from '../../shared';
import { IUserForm } from '../../shared/interface/form.model';

@Injectable()
export class UserFormHelperService {
  countries: Country[] = Object.values(Country);

  constructor(private fb: FormBuilder,) {
  }

  private validateCountrySelection(control: any) {
    return this.countries.includes(control.value) ? null : { invalid: true };
  }

  createDefaultForm() {
   return this.fb.array([this.createFormGroup()])
  }

  addForm(formsArray: FormArray): void {
    if (this.isFormLengthValid(formsArray)) {
      formsArray.push(this.createFormGroup());
    }
  }

  public isFormLengthValid(formsArray: FormArray): boolean {
    return formsArray.length < 10;
  }

  public createFormGroup(): FormGroup {
    return this.fb.group({
      country: ['', [Validators.required, this.validateCountrySelection.bind(this)]],
      username: ['', Validators.required],
      dob: ['', Validators.required],
    });
  }

  public updateValadityForAllForms(formsArray: FormArray): void {
    (formsArray.controls as FormGroup[]).forEach((formGroup: FormGroup) => {
      Object.keys(formGroup.controls).forEach((controlName) => {
        const control = formGroup.get(controlName);
        if (control) {
          control.updateValueAndValidity();
        }
      });
    });
  }

  public updateValidityForSingleForm(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((controlName) => {
      const control = formGroup.get(controlName);
      if (control) {
        control.updateValueAndValidity();
      }
    });
  }

  public invalidControlsAmount(formsArray: FormArray<FormGroup<IUserForm>>): number {
    const groups = formsArray.controls.filter((g) => {
      return Object.keys(g.controls).some((key) => {
        const c = g.controls[key as keyof IUserForm];
        return c.invalid && (c.touched || c.dirty);
      });
    });

    return groups.length;
  }
}
