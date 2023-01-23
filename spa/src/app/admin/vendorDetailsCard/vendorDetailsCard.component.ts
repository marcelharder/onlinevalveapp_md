import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Vendor } from 'src/app/_models/Vendor';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { VendorService } from 'src/app/_services/vendor.service';

@Component({
  selector: 'app-vendorDetailsCard',
  templateUrl: './vendorDetailsCard.component.html',
  styleUrls: ['./vendorDetailsCard.component.css']
})
export class VendorDetailsCardComponent implements OnInit {
  @Input() cd: Vendor;
  @Output() details = new EventEmitter<String>();

  constructor(private ven: VendorService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
  }

  deleteVendor(){
    this.ven.deleteVendor(+this.cd.database_no).subscribe((next)=>{
      this.alertify.message(next);
      this.router.navigate(['/vendorlist']);

    })
  }

  showDetails(id:string){
    this.details.emit(id);}

}


