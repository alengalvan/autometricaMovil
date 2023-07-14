import { Directive, HostListener } from "@angular/core";
import { Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: "[appCurrencyMask]"
})
export class CurrencyMaskDirective {

  constructor() { }

  @HostListener('input', ['$event'])
  onKeyUp(event: any) {
    const pattern = new RegExp('^[0-9]+$');
    const input: any = event.target as HTMLInputElement;
    
    if(!pattern.test(input.value)){
      let limpio = input.value.replace(/[^0-9]+/g, "");
      const nf2 = new Intl.NumberFormat('es-419').format(Number(limpio.replace(",", "")));
      input.value = nf2;
      return;
    }
    const nf2 = new Intl.NumberFormat('es-419').format(Number(input.value.replace(",", "")));
    input.value = nf2;
  }
}