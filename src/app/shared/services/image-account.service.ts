import { Injectable } from '@angular/core';
export interface Icon {
  fileName: string;
  displayName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageAccountService {

  private readonly imageList: Icon[] = [
    { fileName: '1_pagamento.svg', displayName: 'Pagamento' },
    { fileName: '2_cartaodecredito.svg', displayName: 'Cartão de Crédito' },
    { fileName: '3_conta.svg', displayName: 'Conta' },
    { fileName: '4_cofrinho.svg', displayName: 'Cofrinho' },
    { fileName: '5_wallet.svg', displayName: 'Carteira' },
    { fileName: '6_carteira.svg', displayName: 'Carteira 2' },
    { fileName: '99Pay.png', displayName: '99 Pay' },
    { fileName: 'bb.png', displayName: 'Banco do Brasil' },
    { fileName: 'bradesco.png', displayName: 'Bradesco' },
    { fileName: 'bv.png', displayName: 'BV' },
    { fileName: 'brb.png', displayName: 'BRB' },
    { fileName: 'c6bank.png', displayName: 'C6 Bank' },
    { fileName: 'caixa.png', displayName: 'Caixa Econômica' },
    { fileName: 'elo.png', displayName: 'Elo' },
    { fileName: 'intermedium.png', displayName: 'Intermedium' },
    { fileName: 'itau.png', displayName: 'Itaú' },
    { fileName: 'mastercard.png', displayName: 'Mastercard' },
    { fileName: 'mercadopago.png', displayName: 'Mercado Pago' },
    { fileName: 'nubank.png', displayName: 'Nubank' },
    { fileName: 'pagbank.png', displayName: 'PagBank' },
    { fileName: 'pan.png', displayName: 'Banco Pan' },
    { fileName: 'picpay.png', displayName: 'PicPay' },
    { fileName: 'santander.png', displayName: 'Santander' },
    { fileName: 'sicoob.png', displayName: 'Sicoob' },
    { fileName: 'visa.png', displayName: 'Visa' }
  ];


  constructor() { }


 
  getImages(): Icon[] {
    return this.imageList.map(icon => ({
      ...icon,
      fileName:  icon.fileName
    }));
  }
}
