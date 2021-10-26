import { Component, OnInit } from '@angular/core';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ExpiringProducts } from 'src/app/_models/ExpiringProducts';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expiry',
  templateUrl: './expiry.component.html',
  styleUrls: ['./expiry.component.css']
})
export class ExpiryComponent implements OnInit {
  products: Array<ExpiringProducts> = [];
  country = 'Latvia';
  timePeriod = '';
  
  ListPanel = 0;

  constructor(private alertify: AlertifyService, private route: ActivatedRoute) { }
  ngOnInit() {
   
    this.route.data.subscribe(data => {
      if (data.products.length === 0) {
        // hide panel and show that there is nothing to see ..
        this.ListPanel = 0;
        this.timePeriod = '';
        this.country = '';
        this.products = [];
      } else {
        this.ListPanel = 1;
        this.products = data.products;
        this.timePeriod = this.products[0].timePeriod;
        this.country = this.products[0].country;
      }
    });
   

  }
  selectDetails(id: number) { }
  showList(){if (this.ListPanel === 1) {return true;}}

}
