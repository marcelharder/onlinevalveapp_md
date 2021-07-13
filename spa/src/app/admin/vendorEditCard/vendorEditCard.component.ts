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
  @Input() vendor: Vendor;
  @Output() backTo = new EventEmitter<String>();
  photo = 0;

  constructor(
    private vs: VendorService, 
    private alertify:AlertifyService) { }

  ngOnInit() {
  }

  requestPhotoChange(){if(this.photo === 1){return true;}}

  uploadLogo(){
    this.photo = 1;
    this.alertify.message("Upload logo here");}

    changeMainPhoto(photoUrl) { this.vendor.reps = photoUrl; }

  Save(){
    //update the vendor
    this.vs.updateVendor(this.vendor).subscribe((next)=>{
      this.alertify.message(next);
      this.backToList();
    })
  }

  backToList() {
    // go back to list
    this.backTo.emit("1");
    
  }


}
