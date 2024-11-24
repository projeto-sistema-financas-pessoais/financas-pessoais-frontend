export class CreditCard{
    id_cartao_credito!: number;
    limite!: number;
    nome!: string;
    nome_icone!: string
    ativo!: boolean
    limite_disponivel!: number;
    fatura_gastos?: number 
    dia_vencimento?: number
    dia_fechamento?: number

    data_fechamento?: number
    constructor(data: any){
        Object.assign(this, data);
    }
}

export class StatementSend{
    id_fatura!: number;
    id_conta!: number;
}