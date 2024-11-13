import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FamilyMembers, MemberSendEmail } from '../../models/family-members.model';
import { FamilyMembersService } from '../../services/family-members.service';
import { BaseGetIdComponent } from 'src/app/shared/components/base/base-get-id.component';
import { TransactionList } from 'src/app/features/pages/transaction/shared/models/transation-list.model';
import { AuthService } from 'src/app/features/auth/shared/services/auth.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ModalConfig } from 'src/app/shared/models/moda-config.model';
import { AlertModalService } from 'src/app/shared/services/alert-modal.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-family-member-transations',
  templateUrl: './family-member-transations.component.html',
  styleUrls: ['./family-member-transations.component.scss']
})
export class FamilyMemberTransationsComponent extends BaseGetIdComponent<FamilyMembers>{


  @ViewChild('modal_small') protected modalSmall!: ModalComponent;
  modalConfig! : ModalConfig;
  openModalSendEmail: boolean = false;
  
  valueConsolidatedIncome!: number;
  valueConsolidatedExpense!: number;
  valueTotalStatementConsolidated!:number

  valueTotalExpense!: number;
  valueTotalIncome!: number 

  valuetotalMemberExpense!: number;
  valueTotalTotalConsolidatedMemberExpense!: number;


  nameUser!: string

  dateMonth!: string;

  memberSendEmail!: MemberSendEmail;
  
  month = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
  ];


  constructor
  (  injector : Injector,
    private familyMembersService: FamilyMembersService,
    protected authService: AuthService,
    private alertService: AlertModalService,

    ){
    super(injector, new FamilyMembers({}), familyMembersService);
    this.memberSendEmail = new MemberSendEmail()
  }

  override ngOnInit(): void {

    this.nameUser = this.authService.GetUser().name || 'null'

    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));

      this.getById()
  })  
}

  addStatement(evt: TransactionList | undefined){
    
    if(evt){
      const datePayment = new Date(evt.data_pagamento);
    
      const month = datePayment.getMonth();
      const year = datePayment.getFullYear();
  
      this.memberSendEmail.ano = year;
      this.memberSendEmail.mes = month +1;
      this.memberSendEmail.id_parente = this.resourceData.id_parente;
      this.dateMonth = this.month[month] + " " + year
  
    }
  
  }

  async openSendEmail(){
    this.openModalSendEmail = true;
    this.modalConfig = {
      modalTitle: this.resourceData.nome == this.nameUser ? 'Enviar e-mail para lembrar movimentações não pagas' : 'Enviar e-mail de cobrança não pagas'
    }

  
    await this.modalSmall.openSmall()
  }

  sendEmail(){
   
    this.familyMembersService.sendEmailBill(this.memberSendEmail)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data: any) =>{
        
        this.alertService.showAlertSuccess(
          'E-mail enviado com sucesso!'
        )    
        
        this.modalSmall.close()
      
      }, 

      error:(error: HttpErrorResponse) => {
        console.log(error)
      }
    })
  }

}
