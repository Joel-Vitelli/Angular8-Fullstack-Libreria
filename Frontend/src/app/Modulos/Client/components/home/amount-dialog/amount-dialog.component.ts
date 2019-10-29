import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-amount-dialog",
  templateUrl: "./amount-dialog.component.html",
  styleUrls: ["./amount-dialog.component.scss"]
})
export class AmountDialogComponent implements OnInit {
  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AmountDialogComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      cantidadControl: [
        0,
        [Validators.required, Validators.min(1), Validators.max(30)]
      ]
    });
  }

  onAddClick() {
    this.dialogRef.close(this.form.controls.cantidadControl.value);
  }
}
