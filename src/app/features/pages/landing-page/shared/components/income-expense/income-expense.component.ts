import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ApexChart, ApexNonAxisChartSeries, ApexResponsive, ApexTooltip, ChartComponent } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { ReportService } from '../../services/report.service';
import { IncomeExpense } from '../../models/income-expense.model';
import { IconCategory, ImageIconCategoryService } from 'src/app/shared/services/image-icon-category.service';


export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  tooltip: ApexTooltip;
  colors: any

};

@Component({
  selector: 'app-income-expense',
  templateUrl: './income-expense.component.html',
  styleUrls: ['./income-expense.component.scss']
})



export class IncomeExpenseComponent implements OnChanges{

  @ViewChild("chart") chart!: ChartComponent ;
  @Input() type: boolean = true;
  @Input() onlyUser!: boolean;

  protected ngUnsubscribe = new Subject<void>();

  public chartOptions: Partial<ChartOptions> = {};


  nameCategory: string[] = [];
  expensecategory: number[] = [];
  valueTotal: number = 0;

  icons: IconCategory[] = [];
  colorCategory: string[] = [];

  constructor(
    protected readonly reportService: ReportService,
    protected readonly imageIconCategoryService: ImageIconCategoryService
    ) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.icons = this.imageIconCategoryService.getImages();
    this.nameCategory = [];
    this.expensecategory = [];
    this.colorCategory =[];
    this.getIncomeExpense();  
  }
 

  private getIncomeExpense(){
    this.reportService.getIncomeExpense(this.type, this.onlyUser)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data : IncomeExpense)=>{
        console.log("data income expense", data)
        this.chargeVariables(data);
        
      },
      error: (error) => {
        console.log("error to get all", error)
      }
    })
  }

  private chargeVariables(data : IncomeExpense ){

    this.valueTotal = data.valor_total;
 
    data.valor_categoria.forEach((item) => {
      this.nameCategory.push(item.nome_categoria)
      this.expensecategory.push(item.valor)
      let color = this.icons.find(i => item.nome_icone_categoria == i.fileName)
      this.colorCategory.push(color?.color || '')
    });

    this.loadGRaph()
  }


  private loadGRaph(){
    this.chartOptions = {
      series: this.expensecategory,
      chart: {
        height: 250,

        type: "pie",
        toolbar: {
          show: true,
          tools: {
            download: true
          },
          export: {
            png: {
              filename: `valor_categoria`,
            },
            csv: {
              filename: `valor_categoria`,
              headerCategory: 'Categoria', 
              headerValue: 'Valor',

              valueFormatter: function(value: number) {
                return `"R$ ${value.toFixed(2).replace('.', ',')}"`; 
              }
            },
            svg: {
              filename: `valor_categoria`,
            },
          },
        },
        
      },
      labels: this.nameCategory,

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
      colors: this.colorCategory,

      tooltip: {
        enabled: true,
        y: {

          formatter: function (val: number) {
            return `R$ ${val.toFixed(2).replace('.', ',')} reais`;
          }
        }
      },
    };
  }

  }

