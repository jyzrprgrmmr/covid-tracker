import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import {ApiServiceService} from '../../services/api-service.service';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  todayCases:any;
  cases:any;
  recovered:any;
  deaths:any;
  fatality:any;
  recovery:any;
  population:any;
  all:any;
  statsLoaded = false;
  countryLoaded= false;
  countryOptions:any = [];
  order = 'name';

  public lineChartData: ChartDataSets[] = [
   {data:[], label: 'Cases'},
   {data:[], label: 'Recovered'},
   {data:[], label: 'Deaths', yAxisID: 'y-axis-1'},

  ];   
  //  { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
  //   { data: [180, 480, 770, 90, 1000, 270, 400], label: 'Series C', yAxisID: 'y-axis-1' }
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: '#5cb85c',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(
    private apiService: ApiServiceService,
    private orderPipe: OrderPipe
  ) { }

  ngOnInit(): void {
    this.getSummary("worldwide");
    this.getCountries();
    this.getPastTenDays("");
  }

    savecountry(e){
      this.getSummary(e.target.value);
      this.getPastTenDays(e.target.value);
    }

    getSummary(id){
      this.statsLoaded = false;
      this.apiService.getSummary(id).subscribe((res)=>{
        this.todayCases = res.todayCases;
        this.cases= res.cases;
        this.recovered = res.recovered;
        this.deaths = res.deaths;
        this.population= res.population;
        this.fatality = ((this.deaths / this.cases) * (100)).toFixed(1);
        this.recovery = ((this.recovered / this.cases) * (100)).toFixed(1);
        this.statsLoaded = true;
      })
    }

    getCountries(){
      this.apiService.getAll().subscribe((res)=>{
        this.all = res;

        (res).forEach(key => {
          this.countryOptions.push({id: key.countryInfo._id, name:key.country})
         });

        this.countryLoaded = true;
        this.countryOptions.sort((a, b) => a.name.localeCompare(b.name));
        console.log(this.countryOptions)
      })
    }

    getPastTenDays(id){
      if (id == "" || id == "worldwide"){
        this.apiService.getPastTenDaysAll().subscribe((res) => {
          this.lineChartData[0].data = [];
          this.lineChartData[1].data = [];
          this.lineChartData[2].data = [];
         const recoveries = res.recovered;
         const cases = res.cases;
         const deaths = res.deaths;

         Object.keys(cases).forEach(key => {
          this.lineChartLabels.push(key);
          this.lineChartData[0].data.push(cases[key]);
         });

         Object.keys(recoveries).forEach(key => {
          this.lineChartData[1].data.push(recoveries[key]);
         });

         Object.keys(deaths).forEach(key => {
          this.lineChartData[2].data.push(deaths[key]);
         });

         console.log(this.lineChartData);
         console.log(res)
        });
      }
      else{
        this.apiService.getPastTenDays(id).subscribe((res) => {
          this.getSummary(id);
          const cases = res.timeline.cases;
          const recoveries = res.timeline.recovered;
          const deaths = res.timeline.deaths;
          this.lineChartData[0].data = [];
          this.lineChartData[1].data = [];
          this.lineChartData[2].data = [];
          console.log("country", res);
          Object.keys(cases).forEach(key => {
            this.lineChartData[0].data.push(cases[key]);
           });
  
           Object.keys(recoveries).forEach(key => {
            this.lineChartData[1].data.push(recoveries[key]);
           });
  
           Object.keys(deaths).forEach(key => {
            this.lineChartData[2].data.push(deaths[key]);
           });
  
           console.log(this.lineChartData);
           console.log(res)
        });
      }
    } 
  
    // events
    public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
      console.log(event, active);
    }

}
