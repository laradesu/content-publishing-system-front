export interface News {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsResponse {
  success: boolean;
  message: string;
  data: News[];
}
export interface NewsCreate {
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
   is_active: boolean;
}

export interface Bids {
  id: number;
  title: string;
  file:  string | File | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BidsResponse {
  success: boolean;
  message: string;
  data: Bids[];
}
export interface BidsCreate {
  title: string;
  file: string | File | null;
  is_active: boolean;
}

export interface Magazines {
  id: number;
  title: string;
  file:  string | File | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MagazinesResponse {
  success: boolean;
  message: string;
  data: Bids[];
}
export interface MagazinesCreate {
  title: string;
  file: string | File | null;
  is_active: boolean;
}

export interface Vacancies {
  id: number;
  title: string;
  file:  string | File | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VacanciesResponse {
  success: boolean;
  message: string;
  data: Bids[];
}
export interface VacanciesCreate {
  title: string;
  file: string | File | null;
  is_active: boolean;
}