import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultadosConsultaPage } from './resultados-consulta.page';

const routes: Routes = [
  {
    path: '',
    component: ResultadosConsultaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResultadosConsultaPageRoutingModule {}
