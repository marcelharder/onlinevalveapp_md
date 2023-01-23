import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Valve } from '../_models/Valve';
import { AlertifyService } from '../_services/alertify.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { AuthService } from '../_services/auth.service';

@Component({
    selector: 'app-list-valve',
    templateUrl: './list-valve.component.html',
    styleUrls: ['./list-valve.component.scss']
})

export class ListValveComponent {
    @Input() valves: Valve[];
    @Input() productRequested: string;
    @Output() requestDetails: EventEmitter<number> = new EventEmitter();


    constructor(private alertify: AlertifyService, private auth: AuthService) { }

    selectDetails(id: number) { this.requestDetails.emit(id); }

    comesFromVendor() {
        if (this.auth.decodedToken.role !== 'companyadmin') { return true; } else { return false; }
    }

    getPatchSize(type: string){
        if(type === "Pericardial Patch"){return true;} else {return false;}
    }

    GeneratePDF() {
        this.alertify.success('Printing to PDF');
        const data = document.getElementById('contentToConvert');
        html2canvas(data).then(canvas => {
            const imgWidth = 208;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            const heightLeft = imgHeight;

            const contentDataURL = canvas.toDataURL('image/png');
            const pdf = new jspdf('p', 'mm', 'a4');
            const position = 0;
            pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
            pdf.save('test.pdf');

        });

    }

    contentFound()
    {
        if(this.valves.length > 0){return true;}
    }
}
