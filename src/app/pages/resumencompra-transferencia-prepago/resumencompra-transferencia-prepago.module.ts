import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ResumencompraTransferenciaPrepagoPageRoutingModule } from './resumencompra-transferencia-prepago-routing.module';
import { ResumencompraTransferenciaPrepagoPage } from './resumencompra-transferencia-prepago.page';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ResumencompraTransferenciaPrepagoPageRoutingModule
  ],
  declarations: [ResumencompraTransferenciaPrepagoPage]
})
export class ResumencompraTransferenciaPrepagoPageModule {}
