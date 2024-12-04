import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
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

  @Output() returnMessage: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('modal_default') private readonly modalDefault!: TemplateRef<ModalComponent>
  @ViewChild('modal_small') private readonly modalSmall!: TemplateRef<ModalComponent>

  constructor(
    private readonly modalService: NgbModal,
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




  openSmall(): Promise<boolean> {

    if (this.modalRef) {
      this.modalRef.close(null);
    }

    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(
        this.modalSmall, { 
          backdrop: 'static',  centered: true, keyboard : false, size:''
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
    
    localStorage.setItem('openModal', JSON.stringify(false));

    this.modalRef?.dismiss()
    this.modalRef = null;


  }

  return(){
    this.returnMessage.emit('return')
  }

  onKeyReturn(event: KeyboardEvent){
    if (event.key === 'Enter' || event.key === ' ') {
      this.return(); 
      event.preventDefault(); 
    }

  }

  onKeyDismiss(event: KeyboardEvent){
    if (event.key === 'Enter' || event.key === ' ') {
      this.dismiss(); 
      event.preventDefault(); 
    }

  }
}