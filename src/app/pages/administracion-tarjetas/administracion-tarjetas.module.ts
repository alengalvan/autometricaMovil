import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdministracionTarjetasPageRoutingModule } from './administracion-tarjetas-routing.module';
import { AdministracionTarjetasPage } from './administracion-tarjetas.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdministracionTarjetasPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [AdministracionTarjetasPage]
})
export class AdministracionTarjetasPageModule {}
