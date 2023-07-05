import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConsultaAutometricaPageRoutingModule } from './consulta-autometrica-routing.module';
import { ConsultaAutometricaPage } from './consulta-autometrica.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TrimDirective } from 'src/app/trim.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaAutometricaPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [ConsultaAutometricaPage, TrimDirective]
})
export class ConsultaAutometricaPageModule {}
