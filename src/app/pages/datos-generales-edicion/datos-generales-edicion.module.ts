import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosGeneralesEdicionPageRoutingModule } from './datos-generales-edicion-routing.module';

import { DatosGeneralesEdicionPage } from './datos-generales-edicion.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TrimDirective } from 'src/app/trim.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosGeneralesEdicionPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [DatosGeneralesEdicionPage, TrimDirective]
})
export class DatosGeneralesEdicionPageModule {}
