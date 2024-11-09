import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexStroke, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';
import { ReportService } from '../../services/report.service';
import { Subject, takeUntil } from 'rxjs';
import { MonthBudgetCategory } from '../../models/month-budget-category.model';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-monthly-budget-vs-actual',
  templateUrl: './monthly-budget-vs-actual.component.html',
  styleUrls: ['./monthly-budget-vs-actual.component.scss']
})
export class MonthlyBudgetVsActualComponent  implements OnInit{
  @ViewChild("chart") chart!: ChartComponent;
  @Input() dateMonthYear: string = ''
  protected ngUnsubscribe = new Subject<void>();

  public chartOptions: Partial<ChartOptions> = {};

  
  valueCategory: number []  = [];
  valueExpense: number [] = [];
  categoryName: string [] = [];
  mothBudgetTotal: number = 0;
  expenseTotal: number = 0;

  constructor(protected readonly reportService: ReportService) {
  }
  ngOnInit(): void {
    
    this.getMonthCategory();
  }

  private getMonthCategory(){
    this.reportService.getMonthBudgetCategory()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data : MonthBudgetCategory)=>{
        console.log("data", data)
        this.chargeVariables(data);
        
      },
      error: (error) => {
        console.log("error to get all", error)
      }
    })
  }

  private chargeVariables(data : MonthBudgetCategory ){

    this.expenseTotal = data.despesas_totais;
    this.mothBudgetTotal = data.orcamento_total;
    data.detalhes_categorias.forEach((item) => {
      if(item.valor_categoria){
        this.valueCategory.push(item.valor_categoria);
        this.valueExpense.push(item.valor_despesa);
        this.categoryName.push(item.nome_categoria);
      }
      
    })

    this.loadGRaph()
  }

  private loadGRaph(){


    this.chartOptions = {
      series: [
        {
          name: "Orçamento Mensal",
          data: this.valueCategory,
          color: '#0BFA9F'
        },
        {
          name: "Gastos no mês",
          data: this.valueExpense,
          color: '#DC3545'
        },
      ],
      chart: {
        type: "bar",
        height: 250,
        toolbar: {
          show: true,
          tools: {
            download: true
          },
          export: {
            png: {
              filename: `${this.dateMonthYear}-orcamento-mensal-vs-despesas`,
            },
            csv: {
              filename: `${this.dateMonthYear}-orcamento-mensal-vs-despesas`,
              headerCategory: 'Categoria',  
              valueFormatter: function(value: number) {
                return `"R$ ${value.toFixed(2).replace('.', ',')}"`; // Coloca o valor entre aspas
              }
            },
            svg: {
              filename: `${this.dateMonthYear}-orcamento-mensal-vs-despesas`,
            },
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "40%",
          borderRadius: 4, 
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["transparent"],
      },
      xaxis: {
        categories: this.categoryName,
      },
      yaxis: {
  
        labels: {
          formatter: function (val: number) {
            return `R$ ${val}`;
          }
        }
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "R$ " + val.toFixed(2).replace('.', ',') + " reais";
          },
        },
      },
 
    };
  };    
}

