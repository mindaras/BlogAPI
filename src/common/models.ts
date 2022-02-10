interface User {
  id: string;
  email: string;
  password: string;
  fullname: string;
  createdon: string;
  about?: string;
  avatar?: string;
}

export { User };
