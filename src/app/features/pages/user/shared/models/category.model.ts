
export class Category {
    id_categoria!: number;
    nome!: string;
    tipo_categoria!: string;
    modelo_categoria!: string
    nome_icone!: string
    valor_categoria?: number;
    ativo!: boolean;

    constructor(data: any){
        Object.assign(this, data);
    }
}