import LoginApi from './login';
import RegisterApi from './register';

// [POST]
const login = (postData: any) => {
  const api = new LoginApi();
  const res = api.create(postData);

  return api.verifyJson(res);
};

const register = (postData: any) => {
  const api = new RegisterApi();
  const res = api.create(postData);

  return api.verifyJson(res);
};

export { login, register };
