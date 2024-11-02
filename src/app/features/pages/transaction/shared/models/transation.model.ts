import { CondicaoPagamento, TipoRecorrencia, FormaPagamento } from "../../../../../shared/models/enum.model";

export class RegisterExpenseIncome
{
    valor!: number;
    descricao?: string;
    id_categoria!: number;
    id_conta!: number;
    condicao_pagamento!: CondicaoPagamento;
    tipo_recorrencia!: TipoRecorrencia;
    datatime!: string;
    data_pagamento!: string;
    consolidado!: boolean;
    forma_pagamento!: FormaPagamento;
    id_financeiro!: number;
    quantidade_parcelas!: number;
    divide_parente!: DivideMember[]


}


export class RegisterTransfer
{
    valor!: number;
    descricao?: string;
    id_conta_atual!: number;
    id_conta_transferencia!: number;
}

// 2024-10-20T16!:39!:58.599Z
// 2024-10-20

export class DivideMember{
    id_parente!: number;
    valor_parente!: number;
    nome_parente?: string
}


export class TransationConsolidated{
    id_movimentacao!: number;
    consolidado!: boolean
}
