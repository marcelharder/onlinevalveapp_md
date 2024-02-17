import { Component, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TypeOfValve } from 'src/app/_models/TypeOfValve';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-selectValveTypeDetails',
  templateUrl: './selectValveTypeDetails.component.html',
  styleUrls: ['./selectValveTypeDetails.component.css']
})
export class SelectValveTypeDetailsComponent implements OnInit, OnChanges {
  @Input() pro: TypeOfValve;
  @Output() selout: EventEmitter<number> = new EventEmitter();
  ImagePath = '';
  optionsInfo: Array<string> = [];
  modalRef: BsModalRef;

  constructor(private alertify: AlertifyService, private modalService: BsModalService,) { }

  ngOnChanges(){
    this.ImagePath = this.pro.image;
  }

  ngOnInit() {
    if(this.pro.Model_code === 'PVS-67'){
      this.optionsInfo = 
      [
        'The Perceval valve has different sizing unlike other valves',
        'For the Perceval bioprosthesis, each size covers a range of',
        ' 2 annular diameters, therefore the EOA varies ',
        ' from 2,07 to 2,20 cm2 for the S size; ',
        ' from 2,47 to 2,63 cm2 for the M size; ', 
        ' from 2,81 to 2,95 cm2 for L size and ', 
        ' from 3,11 to 3,43 for the XL size ',
        ' ',
        ' ',
        ' Pragmatically the application uses mean values, so 20-22-24-26',
        ' ',
        ' '
      ];
    }
   

  }

  showAdditionalInfo(template: TemplateRef<any>){
     if(this.pro.Model_code === 'PVS-67'){
     this.openModal(template);
     }
     else{this.alertify.message("No additional info on " + this.pro.Description);}
    }

  openModal(template: TemplateRef<any>) { this.modalRef = this.modalService.show(template); }  

  severePPMCCS(inp: string) { if (inp === 'severe') { return true } }
  nonePPMCCS(inp: string) { if (inp === 'none') { return true } }
  moderatePPMCCS(inp: string) { if (inp === 'moderate') { return true } }

  hideDetails(){this.selout.emit(1);}

}
