import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
  @Output() selout: EventEmitter<number> = new EventEmitter();
  ImagePath = '';
  optionsInfo: Array<string> = [];
  modalRef: BsModalRef;

  constructor(private alertify: AlertifyService, private modalService: BsModalService,) { }

  ngOnInit() {
    this.ImagePath = this.pro.image;
    this.optionsInfo = 
    [
      'Patient prosthesis mismatch (PPM) was originally described by',
      ' Rahimtoola almost four decades ago as follows: “the effective',
      ' prosthetic valve area, after insertion into the patient, is',
      ' less than that of a normal human valve”. That is, PPM is a',
      ' situation in which the area of a perfectly functioning prosthetic',
      ' valve is too small for the body surface area (BSA) of that',
      ' patient. So, the indexed effective orifice area (IEOA) defined as',
      ' the ratio between the effective orifice area (EOA) of a prosthetic',
      ' valve and the BSA of that patient is the optimal parameter to',
      ' calculate PPM. The height and weight of the patient are needed',
      ' by the application to calculate the BSA. Further reading here:',
      ' Rahimtoola SH. The problem of valve prosthesis-patient mismatch. Circulation. 1978;58(1):20–4.'
    ];

  }

  showAdditionalInfo(template: TemplateRef<any>){
     if(this.pro.valveTypeId === 13){
     this.openModal(template);
     }
     else{this.alertify.message("No additional info on " + this.pro.description);}
    }

  openModal(template: TemplateRef<any>) { this.modalRef = this.modalService.show(template); }  

  severePPMCCS(inp: string) { if (inp === 'severe') { return true } }
  nonePPMCCS(inp: string) { if (inp === 'none') { return true } }
  moderatePPMCCS(inp: string) { if (inp === 'moderate') { return true } }

  hideDetails(){this.selout.emit(1);}

}
