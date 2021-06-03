import { Component, Input, OnInit } from '@angular/core';
import { TypeOfValve } from 'src/app/_models/TypeOfValve';
import { valveSize } from 'src/app/_models/valveSize';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-selectValveTypeDetails',
  templateUrl: './selectValveTypeDetails.component.html',
  styleUrls: ['./selectValveTypeDetails.component.css']
})
export class SelectValveTypeDetailsComponent implements OnInit {

  @Input() pro: TypeOfValve;

  constructor(private alertify: AlertifyService) { }

  ngOnInit() {
    
  }

  severePPMCCS(inp: string) { if (inp === 'severe') { return true } }
  nonePPMCCS(inp: string) { if (inp === 'none') { return true } }
  moderatePPMCCS(inp: string) { if (inp === 'moderate') { return true } }

  hideDetails(){this.alertify.message("Going where ....");}

}
