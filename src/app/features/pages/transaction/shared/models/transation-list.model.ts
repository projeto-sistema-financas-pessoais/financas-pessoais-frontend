import { CondicaoPagamento, FormaPagamento, TipoMovimentacao } from "../../../../../shared/models/enum.model";
import { DivideMember } from "./transation.model";

export class TransationFilter{
    
    mes!: number;
    ano!: number;
    forma_pagamento: FormaPagamento | null = null;
    tipo_movimentacao: TipoMovimentacao | null = null;
    consolidado: boolean | null = null;
    id_categoria: number | null = null;
    id_conta: number | null = null;
    // id_fatura: number | null = null;;
    id_cartao_credito: number | null = null;
    id_parente: number | null = null;  
    dia_fechamento: number | null = null;
}


export class TransactionList{
    
    valor!: number;
    descricao!: string;
    tipoMovimentacao!: TipoMovimentacao;
    forma_pagamento!: FormaPagamento;
    condicao_pagamento!: CondicaoPagamento;
    datatime!: string;
    quantidade_parcelas!: number;
    consolidado!: boolean;
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
    id_conta_destino!: number;
    nome_conta_destino!: string
    id_cartao_credito?: number;
    divide_parente!: DivideMember[]
    participa_limite_fatura_gastos!: boolean | null;
    fatura_info?: FaturaInfo
}

export class FaturaInfo{
    data_vencimento!: string;
    data_fechamento!: string;
    data_pagamento!: string
    id_cartao_credito!: number;
    id_conta!: number
    fatura_gastos!: number
    nome_conta!: string
    nome_cartao?: string
}