export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

export type RegisterReqBody = {
  name: string;
  email: string;
  password: string;
};

export type LoginReq = {
  body: {
    email: string;
    password: string;
  };
  jwt_auth: any;
};
