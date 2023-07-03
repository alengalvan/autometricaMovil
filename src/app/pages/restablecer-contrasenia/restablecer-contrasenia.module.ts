import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestablecerContraseniaPageRoutingModule } from './restablecer-contrasenia-routing.module';

import { RestablecerContraseniaPage } from './restablecer-contrasenia.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestablecerContraseniaPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [RestablecerContraseniaPage]
})
export class RestablecerContraseniaPageModule {}
