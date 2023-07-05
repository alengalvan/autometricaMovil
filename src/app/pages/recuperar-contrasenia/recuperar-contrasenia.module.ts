import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuperarContraseniaPageRoutingModule } from './recuperar-contrasenia-routing.module';

import { RecuperarContraseniaPage } from './recuperar-contrasenia.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TrimDirective } from 'src/app/trim.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RecuperarContraseniaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RecuperarContraseniaPage, TrimDirective]
})
export class RecuperarContraseniaPageModule {}
