import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TypeOfValve } from 'src/app/_models/TypeOfValve';
import { valveSize } from 'src/app/_models/valveSize';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-productEditDetails',
  templateUrl: './productEditDetails.component.html',
  styleUrls: ['./productEditDetails.component.css']
})
export class productEditDetailsComponent implements OnInit {
  @Input() prod:TypeOfValve;
  @Output() backTo = new EventEmitter<String>();
  listOfSizes:Array<valveSize>=[];
  
  constructor(private alertify:AlertifyService) { }

  ngOnInit() {
    //this.listOfSizes = this.prod.valve_size;
  }

  deleteSize(SizeId: number){
    this.alertify.message("delete size " + SizeId);
  }

  addNewSize(){
    this.alertify.message("add new size");
  }

  backToList(){
    // save the displayed valveType
    

    // go back to list
    this.backTo.emit("1");
  }

  

}
