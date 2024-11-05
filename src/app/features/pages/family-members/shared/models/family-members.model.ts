export class FamilyMembers{
    id_parente!: number;
    grau_parentesco!: number;
    email!: string;
    nome!: string;
    ativo!: boolean;
    constructor(data: any){
        Object.assign(this, data);
    }
}


export class MemberSendEmail{
    mes!: number
    ano!: number
    id_parente!: number
}
    