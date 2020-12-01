import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Helpers {

    constructor() {

    }

    pureNumberValidation(event: any) {
        const pattern = /[0-9]/;

        const inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    stringDateToNgbDate(stringDate: string): any {
        const splittedStringDate = stringDate.split('-');

        return {
            year: Number(splittedStringDate[0]),
            month: Number(splittedStringDate[1]),
            day: Number(splittedStringDate[2]),
        };
    }

    range(start, end) {
        return Array(end - start + 1).fill(0).map((_, idx) => start + idx)
    }

}