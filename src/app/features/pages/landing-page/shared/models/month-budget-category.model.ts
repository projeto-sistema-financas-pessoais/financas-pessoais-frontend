export class MonthBudgetCategory{
    
    orcamento_total!: number // soma dos valores de categoria de despesa
    despesas_totais!: number // soma de todas as despesas do mes valor_parente
    detalhes_categorias!: CategoryExpense []
      
}

export class CategoryExpense{
    valor_categoria!: number
    valor_despesa!: number // valor_parente
    nome_categoria!: string
    nome_icone_categoria!: string
}