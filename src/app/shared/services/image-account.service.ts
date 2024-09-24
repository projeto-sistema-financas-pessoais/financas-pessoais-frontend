import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageAccountService {

  private imagePath = 'assets/images/';
  private imageList: string[] = [
    '1_pagamento.svg',
    '2_cartaodecredito.svg',
    '3_conta.svg',
    '4_cofrinho.svg',
    '5_wallet.svg',
    '6_carteira.svg',
    '99Pay.png',
    'bb.png',
    'bradesco.png',
    'bv.png',
    'brb.png',
    'c6bank.png',
    'caixa.png',
    'elo.png',
    'intermedium.png',
    'itau.png',
    'mastercard.png',
    'mercadopago.png',
    'nubank.png',
    'pagbank.png',
    'pan.png',
    'picpay.png',
    'santander.png',
    'sicoob.png',
    'visa.png'
  ];


  constructor() { }


  getImages(): string[] {
    return this.imageList.map(image => this.imagePath + image);
  }
}
