import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FamilyMembers, MemberSendEmail } from '../../models/family-members.model';
import { FamilyMembersService } from '../../services/family-members.service';
import { BaseGetIdComponent } from 'src/app/shared/components/base/base-get-id.component';
import { FaturaInfo, TransactionList } from 'src/app/features/pages/transaction/shared/models/transation-list.model';
import { AuthService } from 'src/app/features/auth/shared/services/auth.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ModalConfig } from 'src/app/shared/models/moda-config.model';
import { AlertModalService } from 'src/app/shared/services/alert-modal.service';
import { HttpErrorResponse } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
      this.itemStatement = evt;

    }else{
      this.itemStatement = undefined
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
  cobrancaPdf() {
    const memberSendEmail: MemberSendEmail = {
      ano: this.memberSendEmail.ano,
      mes: this.memberSendEmail.mes,
      id_parente: this.memberSendEmail.id_parente
    };
  
    this.familyMembersService.cobranca(memberSendEmail).subscribe(data => {
      const doc = new jsPDF();

      const commonTableStyles = {
        headStyles: {
          fillColor: '#f2f2f2',
          textColor: '#000000',
          fontSize: 11,
          fontStyle: 'bold' as 'bold',
          halign: 'left' as 'left',
          valign: 'middle' as 'middle'
        },
        styles: {
          fontSize: 10,
          cellPadding: 4,
          halign: 'left' as 'left',
          valign: 'middle' as 'middle',
          lineColor: '#E0E0E0',
          lineWidth: 0.3
        },
        alternateRowStyles: {
          fillColor: '#FFFFFF'
        },
        columnStyles: {
          0: {
            cellWidth: 'auto',
            halign: 'left' as 'left'
          },
          1: {
            cellWidth: 40,
            halign: 'left' as 'left'
          },
          2: {
            cellWidth: 30,
            halign: 'right' as 'right'
          }
        },
        margin: { left: 14, right: 14 }
      } as const;

      const formatarData = (data: string): string => {
        return new Date(data).toLocaleDateString('pt-BR');
      };

      type Movimentacao = {
        descricao: string;
        data_pagamento: string;
        valor: number;
      };

      const calcularAlturaTabela = (dados: Movimentacao[]): number => {
        const alturaLinha = 8; // altura aproximada de cada linha
        const alturaCabecalho = 15; // altura do cabeçalho
        const espacamentoExtra = 20; // espaço extra para margens e padding
        return dados.length * alturaLinha + alturaCabecalho + espacamentoExtra;
      };

      const formatarTabela = (
        titulo: string, 
        dados: Movimentacao[], 
        startY: number
      ): number => {
        if (dados.length === 0) {
          return startY + 15; // Retorna apenas com pequeno espaçamento se não houver dados
        }

        const tabelaDados = dados.map((item: Movimentacao) => [
          item.descricao && item.descricao.trim() !== '' ? item.descricao : 'Outros',
          formatarData(item.data_pagamento),
          item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        ]);

        // Adiciona espaço antes do título
        const tituloY = startY + 10;
        
        // Configura e adiciona o título
        doc.setFontSize(14);
        doc.text(titulo, 14, tituloY);

        // Calcula posição inicial da tabela (após o título)
        const tabelaStartY = tituloY + 10;

        // Adiciona a tabela
        autoTable(doc, {
          startY: tabelaStartY,
          head: [['Descrição', 'Data Pagamento', 'Valor']],
          body: tabelaDados,
          ...commonTableStyles
        });

        // Retorna a posição final da tabela + espaçamento
        return tabelaStartY + calcularAlturaTabela(dados);
      };

      // Posição inicial do conteúdo
      let currentY = 20;

      // Adiciona título do documento
      doc.setFontSize(16);
      doc.text('Relatório de Cobrança', 14, currentY);
      currentY += 20;

      // Recupera os dados da resposta
      const { movimentacoes_nao_consolidadas, faturas_nao_consolidadas } = data.data;

      // Adiciona a tabela de movimentações não consolidadas
      currentY = formatarTabela('Movimentações Não Consolidadas', movimentacoes_nao_consolidadas, currentY);

      // Verifica se precisa adicionar nova página
      if (currentY > doc.internal.pageSize.height - 100) {
        doc.addPage();
        currentY = 20;
      }

      // Adiciona a tabela de faturas não consolidadas
      // currentY = formatarTabela('Faturas Não Consolidadas', faturas_nao_consolidadas, currentY);

      // Verifica se precisa adicionar nova página para as informações gerais
      if (currentY > doc.internal.pageSize.height - 60) {
        doc.addPage();
        currentY = 20;
      }

      // Adiciona as informações gerais da fatura com espaçamento adequado
      doc.setFontSize(12);
      currentY += 15;
      doc.text(
        `Total de Movimentações: ${data.data.fatura_geral.total_movimentacoes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
        14,
        currentY
      );
      
      // currentY += 10;
      // doc.text(`Total de Movimentações na Fatura: ${data.data.fatura_geral.total_movimentacoes_fatura}`, 14, currentY);
      // currentY += 10;
      // doc.text(`Total Geral de Movimentações: ${data.data.fatura_geral.total_geral_movimentacoes}`, 14, currentY);

      // Salva o PDF
      doc.save(`cobranca_${memberSendEmail.mes}_${memberSendEmail.ano}.pdf`);
    });
}
}
