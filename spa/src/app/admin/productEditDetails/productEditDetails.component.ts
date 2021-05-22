import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TypeOfValve } from 'src/app/_models/TypeOfValve';
import { valveSize } from 'src/app/_models/valveSize';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-productEditDetails',
  templateUrl: './productEditDetails.component.html',
  styleUrls: ['./productEditDetails.component.css']
})
export class productEditDetailsComponent implements OnInit {
  @Input() prod: TypeOfValve;
  @Output() backTo = new EventEmitter<String>();
  listOfSizes: Array<valveSize> = [];
  valvesize: valveSize = { sizeId: 0, size: 0,eoa: 0.0};

  constructor(private alertify: AlertifyService, private pro: ProductService) { }

  ngOnInit() {
    
  }

  deleteSize(SizeId: number) {
    this.pro.deleteValveSize(this.prod.no, SizeId).subscribe((next) => {
      if (next === '1') {
        this.alertify.message("deleted");
        // remove it from the local array
        let index = this.prod.valve_size.findIndex(d => d.sizeId === SizeId); //find index in your array
        this.prod.valve_size.splice(index, 1);//remove element from array
      }
    });

  }

  addNewSize() {
    // open input form

    this.alertify.message("add new size");
  }

  addNewSizeNow(){
     this.prod.valve_size.push(this.valvesize);


   /*  this.pro.addValveSize(this.prod.no, this.valvesize).subscribe((next)=>{
      if (next === '1') {

      }
    }) */
  }

  backToList() {
    // save the displayed valveType


    // go back to list
    this.backTo.emit("1");
  }



}
