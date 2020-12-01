import { Environment } from './environment';
import axios from 'axios';

const env: Environment = new Environment();

export const httpClient = axios.create({
  baseURL: env.SERVER_URL,
  timeout: 30000,
});

export const httpAuthClient = axios.create({
  baseURL: env.SERVER_URL,
  timeout: 30000,
});

export const httpAuthFileClient = axios.create({
  baseURL: env.SERVER_URL
});

httpAuthClient.interceptors.request.use((request) => {
  // Do something with request data
  const credentials = JSON.parse(localStorage.getItem('credential'));
  const userInfo = JSON.parse(localStorage.getItem('user'));

  if (typeof request.params === 'undefined') {
    request.params = {};
  }

  // tslint:disable-next-line:max-line-length
  request.headers.authorization = (typeof credentials !== 'undefined' && credentials) ? `Bearer ${credentials.access_token}` : '';

  return request;
}, (error) => {

  // Do something with request error
  return Promise.reject(error);
});

httpAuthClient.interceptors.response.use(
  (response) => {
    // Do something with request data
    // console.log('inteceptor-response', response);
    return response;
  }, function (error) {

    const errorData = JSON.parse(JSON.stringify(error));
    console.log('errorData', errorData);

    console.log('error.response.status', error.response.status);
    console.log('window.location.pathname', window.location.pathname);

    // Do something with request error
    // tslint:disable-next-line:triple-equals
    if (error.response.status == 401) {
      // tslint:disable-next-line:triple-equals
      if (window.location.pathname != '/' && window.location.pathname != '/auth/login') {
        console.log('shouldRedirect');
        localStorage.clear();
        window.location.href = '/';
      }
    }

    if (errorData.code === 'ECONNABORTED') {
      console.log(`A timeout happend on url ${error.config.url}`);
      this.events.publish('request:timeout');
    }

    return Promise.reject(error);
  }
);

httpAuthFileClient.interceptors.request.use((request) => {
  // Do something with request data
  const credentials = JSON.parse(localStorage.getItem('credential'));
  const userInfo = JSON.parse(localStorage.getItem('user'));

  if (typeof request.params === 'undefined') {
    request.params = {};
  }

  // tslint:disable-next-line:max-line-length
  request.headers.authorization = (typeof credentials !== 'undefined' && credentials) ? `Bearer ${credentials.access_token}` : '';

  return request;
}, (error) => {

  // Do something with request error
  return Promise.reject(error);
});

httpAuthFileClient.interceptors.response.use((response) => {
  // Do something with request data
  // console.log('inteceptor-response', response);
  return response;
}, function (error) {

  const errorData = JSON.parse(JSON.stringify(error));
  console.log('errorData', errorData);

  // Do something with request error
  // tslint:disable-next-line:triple-equals
  if (error.response.status == 401) {
    // tslint:disable-next-line:triple-equals
    if (window.location.pathname != '/' && window.location.pathname != '/auth/login') {
      localStorage.clear();
      window.location.href = '/';
    }
  }

  if (errorData.code === 'ECONNABORTED') {
    console.log(`A timeout happend on url ${error.config.url}`);
    this.events.publish('request:timeout');
  }

  return Promise.reject(error);
});

httpClient.interceptors.response.use((response) => {
  // Do something with response data
  console.log('from_interceptor', response.data);
  return response;
}, (error) => {
  // Do something with response error
  console.log('error_from_interceptor', error.response.data);
  return Promise.reject(error);
});