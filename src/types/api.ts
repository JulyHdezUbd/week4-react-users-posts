export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

/** Contacto de la agenda Lab6. Mapea 1:1 al recurso `users` de DummyJSON. */
export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/** Datos del formulario de alta/edición de contacto (sin id). */
export interface ContactInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}