import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaAutometricaPage } from './consulta-autometrica.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultaAutometricaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultaAutometricaPageRoutingModule {}
