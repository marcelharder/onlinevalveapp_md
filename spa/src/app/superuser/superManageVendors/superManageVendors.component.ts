import { Component, Input, OnInit } from '@angular/core';
import { Hospital } from 'src/app/_models/Hospital';
import { DropItem } from 'src/app/_models/dropItem';

@Component({
  selector: 'app-superManageVendors',
  templateUrl: './superManageVendors.component.html',
  styleUrls: ['./superManageVendors.component.css']
})
export class SuperManageVendorsComponent implements OnInit {
  @Input() selectedHospital: Hospital;
  currentVendor: DropItem = {value:0,description:""};
  availableVendors: DropItem[] = [];
  currentVendors: DropItem[] = [];
  constructor() { }

  ngOnInit() {
    this.showCurrentVendors();
  }

  showAvailableVendors(){


    return 
  }
  showCurrentVendors(){
    if(this.selectedHospital.vendors !==  undefined){
      var help = this.selectedHospital.vendors.split(',');
    
      for(let i = 0; i < help.length; i ++){
       this.currentVendor.description = help[i].toString();
       this.currentVendors.unshift(this.currentVendor);
      }

    }
    
   
   
  }

}
