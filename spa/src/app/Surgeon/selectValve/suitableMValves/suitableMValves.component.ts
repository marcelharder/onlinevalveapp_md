import { Component, Input, OnInit } from '@angular/core';
import { Valve } from 'src/app/_models/Valve';

@Component({
  selector: 'app-suitableMValves',
  templateUrl: './suitableMValves.component.html',
  styleUrls: ['./suitableMValves.component.css']
})
export class SuitableMValvesComponent implements OnInit {
  @Input()  valves: Array<Valve> = [];
  @Input()  title: string;
  constructor() { }

  ngOnInit() {
  }

}
