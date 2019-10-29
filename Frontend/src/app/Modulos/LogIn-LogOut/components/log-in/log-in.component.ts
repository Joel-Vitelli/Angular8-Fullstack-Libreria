import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";
import { MatDialog} from '@angular/material';
import { CommonLoginComponent } from "../../../LogIn-LogOut/components/common-login/common-login.component";



@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  constructor( public dialog: MatDialog) { }

  ngOnInit() {
  }

  singin() {
    const dialogRef = this.dialog.open(CommonLoginComponent, {
      width: "450%"
    });
    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
      // Si uso otros providers enviar a crear usuario ;
    });
  }

}
