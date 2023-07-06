import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { API } from 'src/app/endpoints';
import { WebRestService } from 'src/app/services/crud-rest.service';

@Component({
  selector: 'app-glosario',
  templateUrl: './glosario.page.html',
  styleUrls: ['./glosario.page.scss'],
})
export class GlosarioPage implements OnInit {
 
  public valorSeleccionado: string = 'glosario';
  public stringPDFGlosario: any = '';
  public stringPDFKilometraje: any = '';
  public id = this.route.snapshot.paramMap.get('id');
  constructor(private menu: MenuController,
    public webService: WebRestService,
    private route: ActivatedRoute) { }

  public async ngOnInit() {
    
    this.menu.close();
    if(this.id == '1'){
      await this.descargarArchivos(1)
    }else{
      this.stringPDFGlosario = localStorage.getItem("glosario")
    }
    
  }

  segmentChanged(event: any){
    console.log(event.detail.value)
    this.valorSeleccionado = event.detail.value;
    if(this.id == '1'){
      if(this.valorSeleccionado == 'kilometraje'){
        this.descargarArchivos(2);
      }else{
        this.descargarArchivos(1);
      }
    }else{
      if(this.valorSeleccionado == 'kilometraje'){
        this.stringPDFKilometraje = localStorage.getItem("kilometraje")
      }else{
        this.stringPDFGlosario = localStorage.getItem("glosario")
      }
    }
  }

  public async descargarArchivos(tipo: number){
    let objeto = {
      type: tipo
    }
    let respuesta = await this.webService.postAsync(API.endpoints.descargarPDF, objeto)
    if(respuesta.status == 200){
      let resp = respuesta.error?.text;
      if(tipo == 1){
        localStorage.setItem("glosario", resp);
        this.stringPDFGlosario = respuesta.error.text;
      }

      if(tipo == 2){
        localStorage.setItem("kilometraje", resp)
        this.stringPDFKilometraje = respuesta.error.text;
      }
    }
  }

}
