interface User {
  id: string;
  email: string;
  password: string;
  fullname: string;
  about?: string;
  createdon: string;
}

export { User };
