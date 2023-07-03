import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AltaNuevaTarjetaPageRoutingModule } from './alta-nueva-tarjeta-routing.module';
import { AltaNuevaTarjetaPage } from './alta-nueva-tarjeta.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AltaNuevaTarjetaPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [AltaNuevaTarjetaPage]
})
export class AltaNuevaTarjetaPageModule {}
