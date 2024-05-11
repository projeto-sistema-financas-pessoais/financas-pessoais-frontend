import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent implements OnInit {

  @Input() message!: string;
  @Input() type ='success' // standard
  @Input() cantClose = false // standard

  
  constructor(public bsModalRef: BsModalRef ){ }

  ngOnInit() {
  }

  OnClose(){
    this.bsModalRef.hide();
  }
}
