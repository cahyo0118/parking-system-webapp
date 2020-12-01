import { httpAuthClient } from './../config/http-client';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GenerateOptionService {

    getAll() {
        return httpAuthClient.get(`api/generate-options`);
    }

    getOne(id: any) {
        return httpAuthClient.get(`api/generate-options/${id}`);
    }
}