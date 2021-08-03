import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GraphModel } from 'src/app/models/graph.model';

@Component({
  selector: 'app-demo1',
  templateUrl: './demo1.component.html',
  styleUrls: ['./demo1.component.scss']
})
export class Demo1Component implements OnInit {

  public graph1: GraphModel = {
    data: [
        { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'red'} },
        { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
    ],
    layout: {title: 'Plot 1'}
  };

  public graph2: GraphModel = {
    data: [],
    layout: {title: 'Plot 2'}
  };

  public weather: GraphModel = {
    data: [],
    layout: {
      title: 'Historical Quito weather',
      xaxis: {
        title: 'Months'
      },
      yaxis: {
        title: 'Precipitation (mm)'
      },
      yaxis2: {
        title: 'Temperature (C°)',
        side: 'right',
        overlaying: 'y'
      }
    }
  };

  private weatherData: {Month: string, AvgMaxTemp: number, AvgMinTemp: number, AvgRainfall: number}[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
   this.buildCharts();
  }

  private buildCharts(){
    this.graph2.data = [
      {
        x: [1, 2, 3, 4, 5],
        y: [1, 6, 3, 6, 1],
        mode: 'markers+text',
        type: 'scatter',
        name: 'Team A',
        text: ['A-1', 'A-2', 'A-3', 'A-4', 'A-5'],
        textposition: 'top center',
        textfont: {
          family:  'Raleway, sans-serif'
        },
        marker: { size: 12 }
      },
      {
        x: [1.5, 2.5, 3.5, 4.5, 5.5],
        y: [4, 1, 7, 1, 4],
        mode: 'markers+text',
        type: 'scatter',
        name: 'Team B',
        text: ['B-a', 'B-b', 'B-c', 'B-d', 'B-e'],
        textfont : {
          family:'Times New Roman'
        },
        textposition: 'bottom center',
        marker: { size: 12 }
      }
    ];

    this.graph2.layout = {
      xaxis: {
        range: [ 0.75, 5.25 ]
      },
      yaxis: {
        range: [0, 8]
      },
      legend: {
        y: 0.5,
        yref: 'paper',
        font: {
          family: 'Arial, sans-serif',
          size: 20,
          color: 'grey',
        }
      },
      title:'Data Labels on the Plot'
    };

    this.http.get("https://api.npoint.io/a59cfcc82ef12b10f8e9").subscribe((res: any) => {
      this.weatherData = res;

      this.buildWeatherChart();
    });
  }

  private buildWeatherChart(){
    let avgMinTempTrace = {
      x: this.weatherData.map(x => x.Month),
      y: this.weatherData.map(x => x.AvgMinTemp),
      type: 'scatter',
      name: 'Avg Min Temp',
      yaxis: 'y2'
    };

    let avgMaxTempTrace = {
      x: this.weatherData.map(x => x.Month),
      y: this.weatherData.map(x => x.AvgMaxTemp),
      type: 'scatter',
      name: 'Avg Max Temp',
      yaxis: 'y2',
      marker: {
        color: 'red'
      }
    };

    let precipitationTrace = {
      x: this.weatherData.map(x => x.Month),
      y: this.weatherData.map(x => x.AvgRainfall),
      type: 'bar',
      name: 'Avg Precipitation',
      marker: {
        color: 'skyblue'
      }
    };

    this.weather.data.push(avgMinTempTrace);
    this.weather.data.push(avgMaxTempTrace);
    this.weather.data.push(precipitationTrace);
  }

}
