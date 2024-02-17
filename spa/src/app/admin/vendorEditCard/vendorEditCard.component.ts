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
  @Input() cd: Vendor;
  @Output() backTo = new EventEmitter<String>();
  photo = 0;
  photos:Array<string>=[];
  des = 0;

  constructor(
    private vs: VendorService, 
    private alertify:AlertifyService) { }

  ngOnInit() {
    this.photos.push(this.cd.reps);
    if(this.cd.description === ""){this.des = 1;};
  }

  requestPhotoChange(){if(this.photo === 1){return true;}}

  showDescriptionEdit(){if(this.des === 1){return true;}}

  uploadLogo(){ this.photo = 1; this.alertify.message("Upload logo here");}

  changeMainPhoto(photoUrl) { this.cd.reps = photoUrl; this.photo = 0;}

  Save(){
    //update the vendor
    this.cd.database_no = this.cd.id.toString();
    this.vs.updateVendor(this.cd).subscribe((next)=>{
      this.alertify.message(next);
      this.backToList();
    })
  }

  backToList() {
    // go back to list
    this.backTo.emit("1");
    
  }


}
