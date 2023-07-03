import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MetodosPagoPageRoutingModule } from './metodos-pago-routing.module';
import { MetodosPagoPage } from './metodos-pago.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MetodosPagoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [MetodosPagoPage]
})
export class MetodosPagoPageModule {}
