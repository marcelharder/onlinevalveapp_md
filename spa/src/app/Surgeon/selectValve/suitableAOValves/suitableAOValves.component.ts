import { Component, Input, OnInit } from '@angular/core';
import { Valve } from 'src/app/_models/Valve';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { ValveService } from 'src/app/_services/valve.service';

@Component({
  selector: 'app-suitableAOValves',
  templateUrl: './suitableAOValves.component.html',
  styleUrls: ['./suitableAOValves.component.css']
})
export class SuitableAOValvesComponent implements OnInit {

  @Input() valves: Array<Valve> = [];
  @Input() title: string;
  @Input() bsa: number;
  ppm = '';
  list = 1;
  details = 0;
  hospitalName = "";
  ImagePath = "";

  pd: Valve = {
    valveId: 0,
    no: 0,
    description: '',
    vendor_code: '',
    vendor_name: '',
    valveSizes: [],
    product_code: '',
    type: '',
    location: '',
    manufac_date: new Date(),
    expiry_date: new Date(),
    Implant_date: new Date(),
    serial_no: '',
    ppm: '',
    tfd: 0,
    model_code: '',
    size: '',
    patchSize: '',
    image:'',
    implant_position: '',
    procedure_id: 0,
    implanted: 0,
    hospital_code: 0,
  };


  constructor(
    private alertify: AlertifyService,
    private valveService: ValveService,
    private auth: AuthService) { }

  ngOnInit() {
    this.auth.currentHospital.subscribe((next) => { this.hospitalName = next; });
   
  }

  showDetails() { if (this.details === 1) { return true; } }
  showList() { if (this.list === 1) { return true; } }
  severePPM(inp: string) { if (inp === 'severe') { return true } }
  nonePPM(inp: string) { if (inp === 'none') { return true } }
  moderatePPM(inp: string) { if (inp === 'moderate') { return true } }

  calculate_eoai(): string{
    var help = 0.0;
    help = this.pd.tfd/this.bsa;
    return help.toFixed(2);
  }
  calculate_ed(): string{
    var help = 0.0;
    var help_1 = this.pd.tfd / Math.PI;
    help = 20 * Math.sqrt(help_1);
    // 20 * V (eoa/pi)
    return help.toFixed(2);
  }

  selectDetails(id: number) {
    this.list = 0;
    this.details = 1;
   
    this.valveService.getValve(id).subscribe((next)=>{
      this.pd = next;
      this.title = "Details of the " + this.pd.description + " valve";
      this.ImagePath = this.pd.image;


     }, (error)=>{this.alertify.error(error)})
  
   
  }

  hideDetails() {
    this.list = 1;
    this.details = 0;
    this.title = "These aortic valves are available for implant in " + this.hospitalName;
    ;
  }

}
