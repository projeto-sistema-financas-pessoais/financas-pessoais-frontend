export class CreditCard{
    id_cartao_credito!: number;
    limite!: number;
    nome!: string;
    nome_icone!: string
    ativo!: boolean
    limite_disponivel?: number;
    fatura_gastos?: number 

    constructor(data: any){
        Object.assign(this, data);
    }
}