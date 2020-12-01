import { httpAuthClient } from './../config/http-client';
import { Injectable } from '@angular/core';
import { AxiosPromise } from 'axios';

@Injectable({ providedIn: 'root' })
export class FileUploadService {

    constructor() {
    }

    uploadTemp(photo: any, config: any): AxiosPromise<any> {
        const formData = new FormData();
        formData.append('file', photo);
        return httpAuthClient.post('api/file-upload/temp', formData, config);
    }

    uploadPhotoTemp(photo: any, config: any): AxiosPromise<any> {
        const formData = new FormData();
        formData.append('file', photo);
        return httpAuthClient.post('api/file-upload/photo/temp', formData, config);
    }

}