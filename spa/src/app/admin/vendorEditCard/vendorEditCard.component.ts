import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Vendor } from 'src/app/_models/Vendor';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { VendorService } from 'src/app/_services/vendor.service';

@Component({
  selector: 'app-vendorEditCard',
  templateUrl: './vendorEditCard.component.html',
  styleUrls: ['./vendorEditCard.component.css']
})
export class VendorEditCardComponent implements OnInit {
  @Input() ven: Vendor;
  @Output() backTo = new EventEmitter<String>();
  photo = 0;
  des = 0;

  constructor(
    private vs: VendorService, 
    private alertify:AlertifyService) { }

  ngOnInit() {
    if(this.ven.description === ""){this.des = 1;};
  }

  requestPhotoChange(){if(this.photo === 1){return true;}}
  showDescriptionEdit(){if(this.des === 1){return true;}}

  uploadLogo(){
    this.photo = 1;
    this.alertify.message("Upload logo here");}

    changeMainPhoto(photoUrl) { this.ven.reps = photoUrl; }

  Save(){
    //update the vendor
    debugger;
    this.ven.database_no = this.ven.id.toString();
    this.vs.updateVendor(this.ven).subscribe((next)=>{
      this.alertify.message(next);
      this.backToList();
    })
  }

  backToList() {
    // go back to list
    this.backTo.emit("1");
    
  }


}
