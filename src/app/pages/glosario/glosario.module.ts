import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GlosarioPageRoutingModule } from './glosario-routing.module';

import { GlosarioPage } from './glosario.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipe/file pipes.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GlosarioPageRoutingModule,
    ComponentsModule,
    PipesModule,
    PdfViewerModule
  ],
  declarations: [GlosarioPage]
})
export class GlosarioPageModule {}
