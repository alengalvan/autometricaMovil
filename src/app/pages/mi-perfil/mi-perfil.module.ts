import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MiPerfilPageRoutingModule } from './mi-perfil-routing.module';
import { MiPerfilPage } from './mi-perfil.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiPerfilPageRoutingModule,
    ComponentsModule,
    NgCircleProgressModule.forRoot({
      "backgroundGradient": true,
      "backgroundColor": "#ffffff",
      "backgroundGradientStopColor": "#c0c0c0",
      "backgroundPadding": -50,
      "radius": 20,
      "space": -20,
      "maxPercent": 100,
      "unitsFontWeight": "100",
      "outerStrokeWidth": 2,
      "outerStrokeColor": "#4ACB48",
      "innerStrokeWidth": 2,
      "titleFontSize": "8",
      "unitsFontSize": "8",
      "titleFontWeight": "100",
      "subtitleColor": "#444444",
      "subtitleFontWeight": "100",
      "showSubtitle": false,
      "showInnerStroke": false,
      "startFromZero": false
    })
  ],
  declarations: [MiPerfilPage]
})
export class MiPerfilPageModule { }
