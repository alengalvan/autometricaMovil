import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';

@Directive({
  selector: '[fecha-vencimiento]'
})
export class FechaVencimientoDirective {

  @HostBinding('style.border')
  border: string | undefined;

  @HostListener('input', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    let val = input.value?.toUpperCase();
    let trimmed = val;
    trimmed = trimmed.replace("/", "");
    let trimmedArray: any = trimmed.split('');
    if( (trimmed.length == 1 || trimmed.length > 2 ) && !trimmed.includes("/") ){
      trimmedArray.splice(2, 0, '/'); 
    }
    input.value = trimmedArray.join('');
  }
}