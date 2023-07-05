import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConsultaAutometricaPageRoutingModule } from './consulta-autometrica-routing.module';
import { ConsultaAutometricaPage } from './consulta-autometrica.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaAutometricaPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    DirectivesModule
  ],
  declarations: [ConsultaAutometricaPage]
})
export class ConsultaAutometricaPageModule {}
