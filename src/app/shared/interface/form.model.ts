import { FormControl } from '@angular/forms';
import { Country } from '../enum/country';


export interface IUserForm {
  id: FormControl<string>;
  country: FormControl<Country | null>;
  userName: FormControl<string | null>;
  dob: FormControl<Date | null>;
}

export interface UsernameSearch {
  value: string;
  index: number;
}
