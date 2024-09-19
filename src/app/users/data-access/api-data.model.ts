import { Country } from '../../shared';

export interface ApiDataModel {
  id: string;
  country: Country | null;
  userName: string | null;
  dob: Date | null;
}


