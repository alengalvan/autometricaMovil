import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResultadosConsultaPageRoutingModule } from './resultados-consulta-routing.module';

import { ResultadosConsultaPage } from './resultados-consulta.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResultadosConsultaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ResultadosConsultaPage]
})
export class ResultadosConsultaPageModule {}
