import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleConsultaAutometricaPageRoutingModule } from './detalle-consulta-autometrica-routing.module';

import { DetalleConsultaAutometricaPage } from './detalle-consulta-autometrica.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleConsultaAutometricaPageRoutingModule
  ],
  declarations: [DetalleConsultaAutometricaPage]
})
export class DetalleConsultaAutometricaPageModule {}
