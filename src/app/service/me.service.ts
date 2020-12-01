import { httpAuthClient } from './../config/http-client';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MeService {

    getCurrentUser() {
        return httpAuthClient.get('api/me');
    }
}