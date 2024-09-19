import { Injectable } from '@angular/core';
import { Fields } from '../../../shared/enum/fields';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  readonly errorsList = ['required', 'invalid', 'ngbDate'];
  readonly errors: Record<string, any> = {
    country: {
      required: 'Country is required',
      invalid: 'Please provide a correct Country'
    },
    username: {
      required: 'Username is required',
      invalid: 'Please provide a correct Username'
    },
    dob: {
      required: 'Date of birthday is required',
      invalid: 'Please provide a correct Date',
      ngbDate: 'Please provide a correct Date'
    }
  }

  public getError(fieldName: Fields, errorValue: string) {
    if (!this.errorsList.includes(errorValue)) {
      throw new Error(`Unsupported error ${ errorValue }. pls update validation errors list`);
    }

    const errorMessage = this.errors[fieldName][errorValue];
    if (fieldName && errorValue && !errorMessage) {
      throw new Error(`Validation message for field ${ fieldName } and error ${ errorValue } is required`);
    }
    return errorMessage;
  }
}
