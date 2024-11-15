export class Account {
    id_conta!: number;
    descricao?: string;
    tipo_conta!: string;
    nome!: string;
    nome_icone!: string
    ativo!: boolean
    saldo!: number;

    constructor(data: any){
        Object.assign(this, data);
    }
}
