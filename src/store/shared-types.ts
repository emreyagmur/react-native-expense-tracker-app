export interface ICountry {
  iso_code: string;
  iso3_code: string;
  iso_numeric: string;
  fips: string;
  country: string;
  capital: string;
  continent: string;
  t_id: string;
  currency_code: string;
  currency_name: string;
  phone: string;
  language: string;
  is_active: string;
}

export interface IState {
  id: number;
  state_code: string;
  state_name: string;
  country_code: string;
}

export interface ICity {
  id: number;
  city_name: string;
  state_code: string;
  country_code: string;
}

export type TPhase =
  | null
  | 'loading'
  | 'adding'
  | 'updating'
  | 'deleting'
  | 'error'
  | 'adding-success'
  | 'deleted-success'
  | 'success';
