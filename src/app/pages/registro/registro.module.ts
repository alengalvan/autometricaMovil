import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroPageRoutingModule } from './registro-routing.module';

import { RegistroPage } from './registro.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TrimDirective } from 'src/app/trim.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [RegistroPage, TrimDirective]
})
export class RegistroPageModule {}
