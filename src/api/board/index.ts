import CreateBoardApi from './createBoard';

// [GET]
const createBoard = (postData: Record<string, unknown>) => {
  const api = new CreateBoardApi(postData.token as string);
  const res = api.index();

  return api.verifyJson(res);
};

export { createBoard };
