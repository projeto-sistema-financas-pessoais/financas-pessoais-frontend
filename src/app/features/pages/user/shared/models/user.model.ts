
export class User {
    nome_completo!: string;
    email!: string;
    data_nascimento!: Date;

    constructor(data: any){
        Object.assign(this, data);
    }
}