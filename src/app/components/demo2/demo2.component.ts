import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CountryISO } from 'src/app/models/country-iso.model';
import { GraphModel } from 'src/app/models/graph.model';

@Component({
  selector: 'app-demo2',
  templateUrl: './demo2.component.html',
  styleUrls: ['./demo2.component.scss']
})
export class Demo2Component implements OnInit {

  public table: GraphModel = {
    data: [],
    layout: null
  };

  public stackedBar: GraphModel = {
    data: [],
    layout: {
      barmode: 'stack',
      xaxis: {
        title: 'Countries'
      },
      yaxis: {
        title: '# Medals'
      }
    }
  };

  public pie: GraphModel = {
    data: [],
    layout: {
      title: 'Top 10 countries',
      grid: {rows: 1, columns: 3}
    }
  };

  public grid: GraphModel = {
    data: [],
    layout: {
      grid: {rows: 1, columns: 2}
    }
  };

  public bubbleMaps: GraphModel = {
    data: [],
    layout: {
      title: 'World medals'
    }
  };

  // https://wits.worldbank.org/wits/wits/WITSHELP-es/content/codes/country_codes.htm
  private countries: CountryISO[] = [];

  private data: {Country: string, Position: number, Gold: number, Silver: number, Bronze: number, Total: number, ISO3: string}[] = [];

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.httpClient.get("https://api.npoint.io/aa5e73f35a1e3808ac12").subscribe((res: any) => {
      this.data = res;

      this.buildCharts();
    });
  }

  private buildCharts(){
    this.buildTable();
    this.buildStackedBar();
    this.buildPieChart();
    this.buildGridChart();
    this.httpClient.get("https://api.npoint.io/82d54a464a7aef5adba3").subscribe((res: any) => {
      this.countries = res;
      this.buildBubbleMaps();
    });
  }

  private buildTable(){
    let values: any[][] = [];

    values.push(this.data.map(x => x.Position));
    values.push(this.data.map(x => x.Country));
    values.push(this.data.map(x => x.Gold));
    values.push(this.data.map(x => x.Silver));
    values.push(this.data.map(x => x.Bronze));
    values.push(this.data.map(x => x.Total));

    this.table.data.push({
      type: 'table',
      header: {
        values: [['Position'], ['Country'], ['God'], ['Silver'], ['Bronze'], ['Total']],
        align: "center",
        line: {width: 1, color: '#506784'},
        fill: {color: '#119DFF'},
        font: {family: "Arial", size: 12, color: "white"}
      },
      cells: {
        values: values,
        line: {color: "#506784", width: 1},
	      fill: {color: ['#25FEFD', 'white']},
        font: {family: "Arial", size: 11, color: ["#506784"]}
      }
    });
  }

  private buildStackedBar(){
    let goldCountries = this.data.filter(x => x.Gold > 0);
    let silverCountries = this.data.filter(x => x.Silver > 0);
    let bronzeCountries = this.data.filter(x => x.Bronze > 0);

    let goldTrace = {
      type: 'bar',
      name: 'Gold',
      x: goldCountries.map(x => x.Country),
      y: goldCountries.map(x => x.Gold)
    };

    let silverTrace = {
      type: 'bar',
      name: 'Silver',
      x: silverCountries.map(x => x.Country),
      y: silverCountries.map(x => x.Silver)
    };

    let bronzeTrace = {
      type: 'bar',
      name: 'Bronze',
      x: bronzeCountries.map(x => x.Country),
      y: bronzeCountries.map(x => x.Silver)
    };

    this.stackedBar.data.push(goldTrace);
    this.stackedBar.data.push(silverTrace);
    this.stackedBar.data.push(bronzeTrace);
  }

  private buildPieChart(){
    let topCountries = this.data.filter(x => x.Position <= 10);

    this.pie.data.push({
      type: 'pie',
      name: 'Gold',
      domain: {column: 0},
      values: topCountries.filter(x => x.Gold > 0).map(x => x.Gold),
      labels: topCountries.filter(x => x.Gold > 0).map(x => x.Country)
    },
    {
      type: 'pie',
      name: 'Silver',
      domain: {column: 1},
      values: topCountries.filter(x => x.Silver > 0).map(x => x.Silver),
      labels: topCountries.filter(x => x.Silver > 0).map(x => x.Country)
    },
    {
      type: 'pie',
      name: 'Bronze',
      domain: {column: 2},
      values: topCountries.filter(x => x.Bronze > 0).map(x => x.Bronze),
      labels: topCountries.filter(x => x.Bronze > 0).map(x => x.Country)
    });
  }

  private buildGridChart(){
    let firstCountry = this.data[0];

    let barTrace = {
      type: 'bar',
      domain: { column: 0},
      name: '# Medals',
      x: ['Gold', 'Silver', 'Bronze'],
      y: [firstCountry.Gold, firstCountry.Silver, firstCountry.Bronze],
      marker: {
        color: 'purple'
      }
    };

    this.grid.data.push(barTrace);

    let pieTrace = {
      type: 'pie',
      //hole: 0.5,
      name: '# Medals',
      domain: {column: 1},
      values: [firstCountry.Gold, firstCountry.Silver, firstCountry.Bronze],
      labels: ['Gold', 'Silver', 'Bronze']
    };

    this.grid.data.push(pieTrace);
    this.grid.layout["title"] = firstCountry.Country;
  }

  private buildBubbleMaps(){
    this.data.forEach(dat => {
      let currentCountry = this.countries.find(x => x.Country == dat.Country);
      if(currentCountry != null){
        dat.ISO3 = currentCountry.ISO3;
      }
    });

    let maxMedals = Math.max(...this.data.map(x => x.Total));

    this.bubbleMaps.data.push({
      type: 'scattergeo',
      mode: 'markers',
      locations: this.data.map(x => x.ISO3),
      marker: {
          size: this.data.map(x => x.Total),
          color: this.data.map(x => x.Total),
          cmin: 0,
          cmax: maxMedals,
          colorbar: {
            title: 'Medals',
          },
          line: {
            color: 'black'
          }
      },
      name: 'World data'
    });
  }
}
