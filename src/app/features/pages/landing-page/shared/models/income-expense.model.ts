export class IncomeExpense{
    
    valor_total!: number
    valor_categoria!: ValueCategory[]
}


class ValueCategory{
    valor!: number
    nome_categoria!: string
    nome_icone_categoria!: string
}