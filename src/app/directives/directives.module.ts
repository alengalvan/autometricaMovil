import { NgModule } from '@angular/core';
import { TrimDirective } from './trim.directive';
import { CreditCardDirective } from './credit-card.directive';
import { FechaVencimientoDirective } from './fecha-vencimiento-card.directive';
import {  CurrencyMaskDirective } from './currency.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumberDirective } from './numbers.directive';
@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [TrimDirective, CreditCardDirective, FechaVencimientoDirective, CurrencyMaskDirective, NumberDirective],
  exports: [TrimDirective, CreditCardDirective, FechaVencimientoDirective, CurrencyMaskDirective, NumberDirective]
})
export class DirectivesModule { }