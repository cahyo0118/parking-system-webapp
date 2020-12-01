import { httpClient } from './../config/http-client';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

    login(requestData) {
        return httpClient.post('api/login', requestData);
    }

    loginUsingOTP(requestData) {
        return httpClient.post('api/login-using-otp', requestData);
    }

    register(requestData) {
        return httpClient.post('api/register', requestData);
    }

    registerUsingOTP(requestData) {
        return httpClient.post('api/register-using-otp', requestData);
    }

    createNewOTPCode(requestData) {
        return httpClient.post('api/create-new-otp-code', requestData);
    }

    checkOTPCode(requestData) {
        return httpClient.post('api/check-otp-code', requestData);
    }

}