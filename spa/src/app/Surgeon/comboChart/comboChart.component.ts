import { Component, OnInit, Input } from '@angular/core';
import { GraphItem } from 'src/app/_models/graphItem';

@Component({
  selector: 'app-comboChart',
  templateUrl: './comboChart.component.html',
  styleUrls: ['./comboChart.component.css']
})
export class ComboChartComponent implements OnInit {
 
 @Input() data: any;

  @Input() title: string;

  constructor() { }

  type = 'ComboChart';
  columnNames = ['size', 'mech', 'bio'];
  options = {
  /*   chartArea: {
      width: '94%'
    }, */
    legend: 'none',
    hAxis: { title: 'Sizes' },
    vAxis: { title: 'No of valves' },
    seriesType: 'bars',
    series: { 2:{} },
    // series: { 3: { type: 'line' } },
    // width: '100%'
  };
  width = 850;
  height = 400;

  ngOnInit() {  }

  onSelect(test: any){  }
}
