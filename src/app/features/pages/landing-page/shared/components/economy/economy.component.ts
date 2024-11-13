import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexTooltip,
  ApexYAxis
} from "ng-apexcharts";
import { ReportService } from '../../services/report.service';
import { Subject, takeUntil } from 'rxjs';
import { EconomyMonth } from '../../models/economy-month.models';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  yaxis: ApexYAxis;

};


@Component({
  selector: 'app-economy',
  templateUrl: './economy.component.html',
  styleUrls: ['./economy.component.scss']
})
export class EconomyComponent  implements OnChanges{

  @ViewChild("chart") chart!: ChartComponent;
  protected ngUnsubscribe = new Subject<void>();
  @Input() onlyUser!: boolean;
  public chartOptions: Partial<ChartOptions> = {};


  monthYear: string[] = [];
  expenseMonth: number[] = [];
  empty: boolean = true;


  constructor(protected readonly reportService: ReportService) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.monthYear  = [];
    this.expenseMonth = [];
    this.getEconomy();
  }
 

  private getEconomy(){
    this.reportService.getEconomyMonth(this.onlyUser)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (data : EconomyMonth[])=>{
        console.log("data economy", data)
        this.chargeVariables(data);
        
      },
      error: (error) => {
        console.log("error to get all", error)
      }
    })
  }

  private chargeVariables(data : EconomyMonth[] ){

 
    data.reverse().forEach((item) => {
      if(item.valor_despesa != 0){
        this.empty = false;
      }
      this.monthYear.push(`${item.mes}/${item.ano}`);
      this.expenseMonth.push(item.valor_despesa);
    });

    this.loadGRaph()
  }


  private loadGRaph(){

    this.chartOptions = {
      series: [
        {
          name: "Despesa do mês",
          data: this.expenseMonth,
          color: '#28DB2D'
        }
      ],
      chart: {
        height: 250,
        type: "line",
        zoom: {
          enabled: false
        },
        toolbar: {
          show: true,
          tools: {
            download: true
          },
          export: {
            png: {
              filename: `gastos-meses-anteriores`,
            },
            csv: {
              filename: `gastos-meses-anteriores`,
              headerCategory: 'Mẽs/Ano',  
              valueFormatter: function(value: number) {
                return `"R$ ${value.toFixed(2).replace('.', ',')}"`; // Coloca o valor entre aspas
              }
            },
            svg: {
              filename: `gastos-meses-anteriores`,
            },
          },
        },
      },
      
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
        colors: ['#28DB2D'],
      },
      
      grid: {
        row: {
          colors: ["#f3f3f4", "transparent"],
          opacity: 0.5,
        }
      },
      xaxis: {
        categories: this.monthYear
      },
      yaxis: {
       
        labels: {
          formatter: function (val: number) {
            return `R$ ${val}`;
          }
        }
      },
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
