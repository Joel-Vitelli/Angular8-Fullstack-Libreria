import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Horario } from "../../../../Admin/interfaces/horario";
import { SnackBarService } from "../../../../Shared/services/snack-bar/snack-bar.service";

@Component({
  selector: "app-hour-dialog",
  templateUrl: "./hour-dialog.component.html",
  styleUrls: ["./hour-dialog.component.scss"]
})
export class HourDialogComponent implements OnInit {
  form: FormGroup;
  horario: Horario;
  openingTime: Date = new Date(Date.now());
  closingTime: Date = new Date(Date.now());
  inputTime: Date = new Date(Date.now());
  displayCloseTime = "";
  displayOpenTime = "";

  constructor(
    private snackBar: SnackBarService,
    public dialogRef: MatDialogRef<HourDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.horario = data.horario;
  }

  ngOnInit() {
    this.form = this.fb.group({
      horario: [
        "",
        [
          Validators.required,
          Validators.pattern("^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$")
        ]
      ]
    });
    this.setTimeToCompare();
  }

  onConfirmClick() {
    if (this.compareTimes()) {
      this.dialogRef.close(this.inputTime);
    } else {
      this.snackBar.openSnackBar(
        "Ingresa un horario entre la apretura y el cierre "
      );
    }
  }

  compareTimes() {
    this.inputTime.setHours(
      this.form.controls.horario.value.split(":").filter(x => x !== "")[0]
    );
    this.inputTime.setMinutes(
      this.form.controls.horario.value.split(":").filter(x => x !== "")[1]
    );
    this.inputTime.setSeconds(0);

    return Number(this.inputTime.getTime()) <
      Number(this.openingTime.getTime()) ||
      Number(this.inputTime.getTime()) > Number(this.closingTime.getTime())
      ? false
      : true;
  }

  setTimeToCompare() {
    const hsApertura = Number(
      this.horario.apertura.split(":").filter(x => x !== "")[0]
    );
    const minApertura = Number(
      this.horario.apertura.split(":").filter(x => x !== "")[1]
    );
    const hsCierre = Number(
      this.horario.cierre.split(":").filter(x => x !== "")[0]
    );
    const minCierre = Number(
      this.horario.cierre.split(":").filter(x => x !== "")[1]
    );

    this.displayOpenTime =
      hsApertura.toString().padStart(2, "0") +
      ":" +
      minApertura.toString().padStart(2, "0");

    this.displayCloseTime =
      hsCierre.toString().padStart(2, "0") +
      ":" +
      minCierre.toString().padStart(2, "0");

    this.openingTime.setHours(hsApertura);
    this.openingTime.setMinutes(minApertura);
    this.openingTime.setSeconds(0);

    const hs = hsCierre !== 0 ? hsCierre : 23;
    const min = hsCierre !== 0 ? minCierre : 59;
    this.closingTime.setHours(hs);
    this.closingTime.setMinutes(min);
    this.closingTime.setSeconds(0);
  }
}
