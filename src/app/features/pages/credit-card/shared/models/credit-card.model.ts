export class CreditCard{
    id_cartao_credito!: number;
    limite?: number;
    nome!: string;
    nome_icone!: string
    ativo!: boolean

    constructor(data: any){
        Object.assign(this, data);
    }
}