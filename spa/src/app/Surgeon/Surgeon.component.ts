import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { GeneralService } from '../_services/general.service';
import { Hospital } from '../_models/Hospital';
import { GraphItem } from '../_models/graphItem';
import { GraphService } from '../_services/graph.service';
import * as _ from 'underscore';
import { from } from 'rxjs';
import { map, pluck, toArray } from 'rxjs/operators';


@Component({
  selector: 'app-Surgeon',
  templateUrl: './Surgeon.component.html',
  styleUrls: ['./Surgeon.component.css']
})
export class SurgeonComponent implements OnInit {


  constructor(private auth: AuthService,
    private graphService: GraphService,
    private userService: UserService,
    private gen: GeneralService) { }
  dataFromAPI: Array<GraphItem> = [];
  // dataFromAPI: any;

  title = 'Valve sizes in aortic position, blue - mechanical, red - bio';
  currentHospitalNo = 0;
  hos: Hospital;
  Array_1: any; Array_2: any; Array_3: any;
  testData: [][];

  private extractTheData: GraphItem[]

  ngOnInit() {
    this.gen.getHospital().subscribe((res) => { this.hos = res; })
    this.showAorticValves();
  }

  showAorticValves() {
    this.title = 'Valve sizes in aortic position, blue - mechanical, red - bio';
    this.graphService.getAortic(+this.auth.decodedToken.nameid).subscribe((next) => {
      const source = from(next);
      const bio = source.pipe(pluck('b'), toArray()).subscribe(val => { this.Array_3 = val });
      const mech = source.pipe(pluck('m'), toArray()).subscribe(val => { this.Array_2 = val });
      const size = source.pipe(pluck('size'), toArray()).subscribe(val => { this.Array_1 = val });
      var num: number = 0;
      var i: number;
      var help = [] as any;
      for (i = num; i < this.Array_3.length; i++) { help.push([this.Array_1[i], this.Array_2[i], this.Array_3[i]]); }
      this.dataFromAPI = help;
    })
  }

  showMitralValves() {
    this.title = 'Valve sizes in mitral position, blue - mechanical, red - bio';
    this.graphService.getMitral(+this.auth.decodedToken.nameid).subscribe((next) => {
      const source = from(next);
      const bio = source.pipe(pluck('b'), toArray()).subscribe(val => { this.Array_3 = val });
      const mech = source.pipe(pluck('m'), toArray()).subscribe(val => { this.Array_2 = val });
      const size = source.pipe(pluck('size'), toArray()).subscribe(val => { this.Array_1 = val });
      var num: number = 0;
      var i: number;
      var help = [] as any;
      for (i = num; i < this.Array_3.length; i++) { help.push([this.Array_1[i], this.Array_2[i], this.Array_3[i]]); }
      this.dataFromAPI = help;
    })
  }
  showRings() {
    this.title = 'Ring sizes';
    this.graphService.getRings(+this.auth.decodedToken.nameid).subscribe((next) => {
      const source = from(next);
      const bio = source.pipe(pluck('b'), toArray()).subscribe(val => { this.Array_3 = val });
      const mech = source.pipe(pluck('m'), toArray()).subscribe(val => { this.Array_2 = val });
      const size = source.pipe(pluck('size'), toArray()).subscribe(val => { this.Array_1 = val });
      var num: number = 0;
      var i: number;
      var help = [] as any;
      for (i = num; i < this.Array_3.length; i++) { help.push([this.Array_1[i], this.Array_2[i], this.Array_3[i]]); }
      this.dataFromAPI = help;
    })
  }
  showConduits() {
    this.title = 'Conduit sizes';
    this.graphService.getConduits(+this.auth.decodedToken.nameid).subscribe((next) => {
      const source = from(next);
      const bio = source.pipe(pluck('b'), toArray()).subscribe(val => { this.Array_3 = val });
      const mech = source.pipe(pluck('m'), toArray()).subscribe(val => { this.Array_2 = val });
      const size = source.pipe(pluck('size'), toArray()).subscribe(val => { this.Array_1 = val });
      var num: number = 0;
      var i: number;
      var help = [] as any;
      for (i = num; i < this.Array_3.length; i++) { help.push([this.Array_1[i], this.Array_2[i], this.Array_3[i]]); }
      this.dataFromAPI = help;
    })
  }

}
