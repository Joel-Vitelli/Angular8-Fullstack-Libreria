import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ConfirmDialogComponent } from "../../../Shared/components/confirm-dialog/confirm-dialog.component";

@Injectable({
  providedIn: "root"
})
export class ConfirmDialogService {
  constructor(public dialog: MatDialog) {}

  getConfirmation(message: any) {
    return this.dialog
      .open(ConfirmDialogComponent, {
        width: "350px",
        data: message
      })
      .afterClosed()
      .toPromise()
      .then(result => {
        return result ? result : false;
      });
  }
}
