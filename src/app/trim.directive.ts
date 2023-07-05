import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appTrim]'
})
export class TrimDirective {

  @Output() ngModelChange = new EventEmitter();

  constructor(private el: ElementRef,
    private control: NgControl) {
  }

  /**
   * Trim the input value on focus out of input component
   */
  @HostListener('focusout') onFocusOut() {
    setTimeout(() => {
      (this.el.nativeElement as HTMLInputElement).value = (this.el.nativeElement as HTMLInputElement).value? 
      (this.el.nativeElement as HTMLInputElement).value.trim() : "";
      this.ngModelChange.emit(this.el.nativeElement.value)
      this.control.control?.setValue(this.el.nativeElement.value)
    }, 100);

  }

}