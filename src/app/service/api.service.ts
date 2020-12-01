import { httpAuthClient, httpAuthFileClient } from './../config/http-client';
import { Injectable } from '@angular/core';
import { AxiosRequestConfig } from 'axios';

@Injectable({ providedIn: 'root' })
export class APIService {

    get(endPoint, axiosConfig: AxiosRequestConfig = {}) {
        return httpAuthClient.get(endPoint, axiosConfig);
    }

    uploadFile(endPoint, data, axiosConfig: AxiosRequestConfig = {}) {
        return httpAuthFileClient.post(endPoint, data, axiosConfig);
    }

    post(endPoint, data, axiosConfig: AxiosRequestConfig = {}) {
        return httpAuthClient.post(endPoint, data, axiosConfig);
    }

    put(endPoint, data, axiosConfig: AxiosRequestConfig = {}) {
        return httpAuthClient.put(endPoint, data, axiosConfig);
    }

    delete(endPoint, axiosConfig: AxiosRequestConfig = {}) {
        return httpAuthClient.delete(endPoint, axiosConfig);
    }

}