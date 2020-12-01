import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appFormError]'
})
export class FormErrorDirective {

  constructor(el: ElementRef) {
    console.log('directive');
    el.nativeElement.style.backgroundColor = 'yellow';
  }

}
