import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TerminosCondicionesPageRoutingModule } from './terminos-condiciones-routing.module';

import { TerminosCondicionesPage } from './terminos-condiciones.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipe/file pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TerminosCondicionesPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [TerminosCondicionesPage]
})
export class TerminosCondicionesPageModule {}
