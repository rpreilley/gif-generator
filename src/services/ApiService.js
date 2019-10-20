import Api from './Api';

export default {
  get(url) {
    return Api().get(url);
  },
  post(url) {
    return Api().post(url, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    });
  },
};
