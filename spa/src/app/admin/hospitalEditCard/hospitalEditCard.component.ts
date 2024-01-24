import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Hospital } from 'src/app/_models/Hospital';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { HospitalService} from 'src/app/_services/hospital.service';

@Component({
  selector: 'app-hospitalEditCard',
  templateUrl: './hospitalEditCard.component.html',
  styleUrls: ['./hospitalEditCard.component.scss']
})
export class HospitalEditCardComponent implements OnInit {
  @Input() new_hospital: Partial<Hospital>;
  @Output() backTo: EventEmitter<string> = new EventEmitter<string>(); 
  constructor(private hos: HospitalService, private alertify:AlertifyService) { }

  ngOnInit() {
  }

  cancel(){
    // delete the newly added hospital
    this.hos.removeHospital(+this.new_hospital.HospitalNo).subscribe((next)=>{this.alertify.message(next)})
    this.backTo.emit("Cancelled");}

  updateHospital(){
    this.hos.saveDetails(this.new_hospital).subscribe(
      (next)=>{this.backTo.emit(next)}, 
      (error)=> {this.alertify.error(error)});
  }

}
