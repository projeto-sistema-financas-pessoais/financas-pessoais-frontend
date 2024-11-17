import { FaturaInfo, TransactionList } from "../../../transaction/shared/models/transation-list.model"

export class Overdue{
    movimentacoes: TransactionList[] = []
    faturas: FaturaInfo[] = []
}