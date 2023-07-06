import { NgModule } from '@angular/core';
import { TrimDirective } from './trim.directive';
import { CreditCardDirective } from './credit-card.directive';
import { FechaVencimientoDirective } from './fecha-vencimiento-card.directive';

@NgModule({
  imports: [],
  declarations: [TrimDirective, CreditCardDirective, FechaVencimientoDirective],
  exports: [TrimDirective, CreditCardDirective, FechaVencimientoDirective]
})
export class DirectivesModule { }