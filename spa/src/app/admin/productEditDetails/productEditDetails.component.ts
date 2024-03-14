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
  @Input() listOfSizes: Array<valveSize>;
  valvesize: valveSize = {
    SizeId: 0,
    Size: 0,
    EOA: 0,
    PPM: '',
    VTValveTypeId: 0
  };
  newSizeToken = 0;

  constructor(private alertify: AlertifyService, private pro: ProductService) { }

  ngOnInit() { }

  deleteSize(SizeId: number) {
    debugger;
    this.pro.deleteValveSize(SizeId).subscribe((next) => {
      debugger;
      if (next === 1) {
        this.alertify.message("deleted");
        // remove it from the local array
        let index = this.listOfSizes.findIndex(d => d.SizeId === SizeId); //find index in your array
        this.listOfSizes.splice(index, 1);//remove element from array
      }
    });
  }

  addNewSize() {// get the latest prod details

    this.pro.getProductById(this.prod.ValveTypeId).subscribe((next) => {// zero everything
      this.prod = next;
      this.valvesize.SizeId = 0;
      this.valvesize.Size = null;
      this.valvesize.EOA = null;
      this.valvesize.PPM = '';
      this.valvesize.VTValveTypeId = 0;

      this.newSizeToken = 1;
    });
  }

  displayNewSize() { if (this.newSizeToken === 1) { return true; } }

  addNewSizeNow() {// add this size to the backend first 
    
    if(this.CanIAddThisValve(this.valvesize)){// can I add this valvesize
    this.pro.addValveSize(this.prod.ValveTypeId, this.valvesize).subscribe((next) => {// get the new valve size from the backend
      this.valvesize = next; 
      this.listOfSizes.push(this.valvesize);
      // sort this list on valveSize
      this.listOfSizes.sort((a,b) => (a.Size < b.Size ? -1 : 1))
      
    })
  } else {
    this.alertify.error("Can't add this valve size, duplicates ??");
    this.newSizeToken = 0;
  }
  }

  backToList() { // go back to list
    this.backTo.emit("1");
  }

  CanIAddThisValve(test: valveSize):boolean{
    var help = false;
    var sizeduplicate = 1;
    var eoaduplicate = 1;

    // find out if this valvesize is already in the listOfValves
    let index = this.listOfSizes.findIndex(d => d.Size === +test.Size); //find index in your array
    if(index === -1){sizeduplicate = 0;}
    
    // find out if this eoa is already in the listOfValves
    let indexeoa = this.listOfSizes.findIndex(d => d.EOA === +test.EOA); //find index in your array
    if(indexeoa === -1){eoaduplicate = 0;}
   
    if(sizeduplicate === 0 && eoaduplicate === 0){help = true;}

    return help;
  }



}
