import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { sqliteService } from 'src/app/services/sqlite.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-consulta-autometrica',
  templateUrl: './consulta-autometrica.page.html',
  styleUrls: ['./consulta-autometrica.page.scss'],
})
export class ConsultaAutometricaPage implements OnInit {
  public form: FormGroup = this.formBuilder.group({
    marca: [null, [Validators.required]],
    submarca: [null, [Validators.required]],
    anio: [null],
    kilometraje: [null],
  });

  get marca() {
    return this.form.get("marca");
  }

  get submarca() {
    return this.form.get("submarca");
  }

  get anio() {
    return this.form.get("anio");
  }

  get kilometraje() {
    return this.form.get("kilometraje");
  }

  public mensajesValidacion = {
    marca: [
      { type: "required", message: "*Seleccione la marca." },
    ],
    submarca: [
      { type: "required", message: "*Seleccione la submarca." }, 
    ],
    anio: [
      { type: "required", message: "*Seleccione el año." }, 
    ],
    kilometraje: [
      { type: "required", message: "Ingrese el kilometraje." }, 
    ]
  };

  public estados: any = [];

  constructor(private formBuilder: FormBuilder,
    public utilitiesService: UtilitiesService,
    public sqliteService: sqliteService) { }

  async ngOnInit() {
    this.estados = await this.utilitiesService.obtenerEstadosRepublica();
  }

  public async obtenerListadoMarcas(){
    let resultado = await this.sqliteService.obtenerMarcas();
    console.log(resultado)
  }

}
