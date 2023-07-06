import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalTerminosCondicionesPageRoutingModule } from './modal-terminos-condiciones-routing.module';

import { ModalTerminosCondicionesPage } from './modal-terminos-condiciones.page';
import { PipesModule } from 'src/app/pipe/file pipes.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalTerminosCondicionesPageRoutingModule,
    PipesModule,
    PdfViewerModule
  ],
  declarations: [ModalTerminosCondicionesPage]
})
export class ModalTerminosCondicionesPageModule {}
