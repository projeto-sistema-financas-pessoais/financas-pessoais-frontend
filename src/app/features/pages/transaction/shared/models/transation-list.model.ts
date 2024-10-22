import { CondicaoPagamento, FormaPagamento, TipoMovimentacao } from "./transation-enum.model";
import { DivideMember } from "./transation.model";

export class TransationFilter{
    
    mes!: number;
    ano!: number;
    forma_pagamento?: FormaPagamento;
    tipo_movimentacao?: TipoMovimentacao;
    consolidado?: boolean;
    id_categoria?: number;
    id_conta?: number;
    id_fatura?: number;
    id_parente?: number
    
}


export class TransationList{
    
    valor!: string;
    descricao!: string;
    tipoMovimentacao!: TipoMovimentacao;
    forma_pagamento!: FormaPagamento;
    condicao_pagamento!: CondicaoPagamento;
    datatime!: string;
    quantidade_parcelas!: number;
    consolidado!: true;
    tipo_recorrencia!: string;
    parcela_atual!: string;
    data_pagamento!: Date;
    id_conta!: number;
    id_categoria!: number;
    id_fatura!: number;
    id_repeticao!: number;
    nome_icone_categoria!: string;
    nome_conta!: string;
    nome_cartao_credito!: string;
    id_movimentacao!: number;
    divide_parente!: DivideMember[]
    fatura_info?: FaturaInfo
}

export class FaturaInfo{
    data_vencimento!: string;
    data_fechamento!: string;
    data_pagamento!: string
    id_cartao_credito!: number;
    id_conta!: number
}