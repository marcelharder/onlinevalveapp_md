import { Component, OnInit } from '@angular/core';
import { ExpiringProducts } from 'src/app/_models/ExpiringProducts';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expiry3months',
  templateUrl: './expiry3months.component.html',
  styleUrls: ['./expiry3months.component.css']
})
export class Expiry3monthsComponent implements OnInit {

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
