import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosGeneralesEdicionPageRoutingModule } from './datos-generales-edicion-routing.module';

import { DatosGeneralesEdicionPage } from './datos-generales-edicion.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosGeneralesEdicionPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [DatosGeneralesEdicionPage]
})
export class DatosGeneralesEdicionPageModule {}
