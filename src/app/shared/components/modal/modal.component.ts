import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfig } from '../../models/moda-config.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  private modalRef: NgbModalRef | null = null;
  @Input() public modalConfig!: ModalConfig 

  @ViewChild('modal_default') private modalDefault!: TemplateRef<ModalComponent>

  constructor(
    private modalService: NgbModal,
    private router: Router,
  ){}



  openDefault(): Promise<boolean> {

    if (this.modalRef) {
      this.modalRef.close(null);
    }

    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(
        this.modalDefault, { 
          backdrop: 'static',  centered: true, keyboard : false, size:'lg'
    })
      this.modalRef.result.then(resolve, resolve)
    })
  }


  async close(): Promise<void> {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  async dismiss(): Promise<void> {
    
    this.modalRef?.dismiss()
    this.modalRef = null;


  }
}