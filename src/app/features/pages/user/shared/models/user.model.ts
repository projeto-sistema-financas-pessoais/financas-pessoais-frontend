
export class User {
    nome_completo!: string;
    email!: string;
    data_nascimento!: string | null;
    

    constructor(data: any){
        Object.assign(this, data);
    }
}