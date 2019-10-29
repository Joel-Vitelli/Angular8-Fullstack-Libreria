import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Horario } from "../../interfaces/horario";
import { HorarioService } from "../../services/horario/horario.service";
import { SocketService } from "../../../Shared/services/socket/socket.service";

@Component({
  selector: "app-horario",
  templateUrl: "./horario.component.html",
  styleUrls: ["./horario.component.scss"]
})
export class HorarioComponent implements OnInit {
  daysOfWeek: string[] = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado"
  ];

  horarioSermanal: Horario[] = [];

  constructor(
    private horarioService: HorarioService,
    public dialog: MatDialog,
    private socketIo: SocketService
  ) { }

  ngOnInit() {
    this.getHorarios();
    this.socketIo.socket.on("refreshHorario", () => {
      console.log("actualizado");
      this.getHorarios();
    });
  }

  getHorarios() {
    this.horarioService.getHorarioSemanal("").subscribe((data: Horario[]) => {
      this.horarioSermanal = data;
      console.log(data)
    });
  }

  openEditDialog(id: string, nrodia: number, apertura: string, cierre: string) {
    const dialogRef = this.dialog.open( HorarioDialogComponent, {
      width: "250px",
      data: {
        horario: {
          dia: this.daysOfWeek[nrodia],
          apertura,
          cierre
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.horarioService
          .updateHorario(id, {
            nrodia: nrodia,
            apertura: result.apertura,
            cierre: result.cierre,
            especial: ""
          })
          .toPromise()
          .then(a => {
            console.log(a);
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  }
}

@Component({
  selector: "app-horario-dialog",
  templateUrl: "horario-dialog.html"
})
export class HorarioDialogComponent implements OnInit {
  form: FormGroup;
  horario: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<HorarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.horario = this.data.horario;
  }

  ngOnInit() {
    this.form = this.fb.group({
      apertura: [
        this.horario.apertura,
        [Validators.pattern("^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$")]
      ],
      cierre: [
        this.horario.cierre,
        [Validators.pattern("^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$")]
      ]
    });
  }
  onConfirmClick() {
    this.dialogRef.close({
      apertura: this.form.controls.apertura.value,
      cierre: this.form.controls.cierre.value
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
