import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertModalComponent } from '../components/alert-modal/alert-modal.component';

enum AlertTypes {
  DANGER = 'danger',
  SUCCESS = 'success',
  INFO  = 'info',
  WARNING = 'warning'
}

@Injectable({
  providedIn: 'root'
})
export class AlertModalService {

constructor(private modalService: BsModalService) { }


private showAlert(message: string, type: AlertTypes){
  const bsModalRef: BsModalRef = this.modalService.show(AlertModalComponent)
  bsModalRef.content.type = type
  bsModalRef.content.message = message;

  setTimeout(() => {
    bsModalRef.hide();
  }, 1200); 

}

showAlertSuccess(message: string){
  this.showAlert(message, AlertTypes.SUCCESS);
}

showAlertDanger(message: string){
  this.showAlert(message, AlertTypes.DANGER);
}

showAlertInfo(message: string){
  this.showAlert(message, AlertTypes.INFO);
}

showAlertWarning(message: string){
  this.showAlert(message, AlertTypes.WARNING);
}
}
