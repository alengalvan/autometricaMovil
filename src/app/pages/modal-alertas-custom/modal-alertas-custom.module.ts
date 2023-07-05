import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalAlertasCustomPageRoutingModule } from './modal-alertas-custom-routing.module';
import { ModalAlertasCustomPage } from './modal-alertas-custom.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAlertasCustomPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    DirectivesModule
  ],
  declarations: [ModalAlertasCustomPage]
})
export class ModalAlertasCustomPageModule {}
