import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import { NgModule } from '@angular/core';
import {FileUploadModule} from 'ng2-file-upload';
import {GoogleChartsModule} from 'angular-google-charts';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {ModalModule} from 'ngx-bootstrap/modal';
import {PaginationModule} from 'ngx-bootstrap/pagination';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { SettingsComponent } from './superuser/settings/settings.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { AlertifyService } from './_services/alertify.service';
import { AuthService } from './_services/auth.service';

import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from './_guards/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { EditValveComponent } from './ValveDefinitions/editValve/editValve.component';
import { ListOfValveDefinitionsComponent } from './ValveDefinitions/listOfValveDefinitions/listOfValveDefinitions.component';
import { ListHospitalsForRefComponent } from './companyadmin/list-hospitals-for-ref/list-hospitals-for-ref.component';
import { ExpiryComponent } from './companyadmin/expiry/expiry.component';
import { SettingsCompanyComponent } from './companyadmin/settings-company/settings-company.component';
import { CompanyadminComponent } from './companyadmin/companyadmin.component';
import { AddValveComponent } from './add-valve/add-valve.component';
import { EditValveInHospitalComponent } from './editValveInHospital/edit-valve-in-hospital.component';
import { HospitalService } from './_services/hospital.service';
import { GeneralService } from './_services/general.service';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { ProductService } from './_services/product.service';
import { VendorService } from './_services/vendor.service';
import { DropService } from './_services/drop.service';
import { ValveService } from './_services/valve.service';
import { UserService } from './_services/user.service';
import { ValveResolver } from './_resolvers/ValveResolver';
import { AddCompanyValveComponent } from './companyadmin/AddCompanyValve/AddCompanyValve.component';
import { ListValveComponent } from './list-valve/list-valve.component';
import { CommunicationComponent } from './communication/communication.component';
import { SuperuserComponent } from './superuser/superuser.component';
import { ListProductsForRefComponent } from './companyadmin/list-products-for-ref/list-products-for-ref.component';
import { EditHospitalComponent } from './editHospital/editHospital.component';
import { EditProductComponent } from './companyadmin/editProduct/editProduct.component';
import { MessageComponent } from './companyadmin/messages/message.component';
import { MessagesResolver } from './_resolvers/MessageResolver';
import { HospitalMessagesComponent } from './editHospital/hospital-messages/hospital-messages.component';
import { ExpiringProductsResolver } from './_resolvers/ExpiringProductsResolver';
import { SearchserialComponent } from './companyadmin/searchserial/searchserial.component';
import { AddProductComponent } from './companyadmin/addProduct/addProduct.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileResolver } from './_resolvers/ProfileResolver';
import { PhotoEditorComponent } from './photo-uploader/photoEditor.component';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { SurgeonComponent } from './Surgeon/Surgeon.component';
import { ComboChartComponent } from './Surgeon/comboChart/comboChart.component';
import { GraphService } from './_services/graph.service';
import { List_TransfersComponent } from './companyadmin/list_Transfers/list_Transfers.component';
import { ListUserComponent } from './admin/list-user/list-user-component';
import { ListUserResolver } from './_resolvers/ListUserResolver';
import { Expiry3monthsComponent } from './companyadmin/expiry3months/expiry3months.component';
import { SelectValveComponent } from './Surgeon/selectValve/selectValve.component';
import { SuitableAOValvesComponent } from './Surgeon/selectValve/suitableAOValves/suitableAOValves.component';
import { SuitableMValvesComponent } from './Surgeon/selectValve/suitableMValves/suitableMValves.component';
import { ListProductsComponent } from './admin/list-products/list-products.component';
import { ListProductsResolver } from './_resolvers/ListProductsResolver';
import { ProductDetailsCardComponent } from './admin/productDetailsCard/productDetailsCard.component';
import { productEditDetailsComponent } from './admin/productEditDetails/productEditDetails.component';
import { LookInOVIComponent } from './Surgeon/selectValve/lookInOVI/lookInOVI.component';
import { SelectValveTypeListComponent } from './Surgeon/selectValve/selectValveTypeList/selectValveTypeList.component';
import { SelectValveTypeDetailsComponent } from './Surgeon/selectValve/selectValveTypeDetails/selectValveTypeDetails.component';
import { ListVendorsComponent } from './admin/list-vendors/list-vendors.component';
import { ListVendorsResolver } from './_resolvers/ListVendorsResolver';
import { VendorDetailsCardComponent } from './admin/vendorDetailsCard/vendorDetailsCard.component';
import { VendorEditCardComponent } from './admin/vendorEditCard/vendorEditCard.component';
import { ListHospitalsComponent } from './admin/list-hospitals/list-hospitals.component';
import { ListHospitalsResolver } from './_resolvers/ListHospitalsResolver';
import { HospitalEditCardComponent } from './admin/hospitalEditCard/hospitalEditCard.component';
import { TimeagoModule } from 'ngx-timeago';
import { SuperManageContactsComponent } from './superuser/superManageContacts/superManageContacts.component';
import { SuperManageVendorsComponent } from './superuser/superManageVendors/superManageVendors.component';


export function tokenGet() { return localStorage.getItem('token'); }

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      AboutComponent,
      NavMenuComponent,
      SettingsComponent,
      StatisticsComponent,
      EditValveComponent,
      ListOfValveDefinitionsComponent,
      ListProductsForRefComponent,
      ListHospitalsForRefComponent,
      SettingsCompanyComponent,
      ExpiryComponent,
      Expiry3monthsComponent,
      CompanyadminComponent,
      ListValveComponent,
      AddValveComponent,
      AddCompanyValveComponent,
      EditValveInHospitalComponent,
      CommunicationComponent,
      SuperuserComponent,
      EditHospitalComponent,
      EditProductComponent,
      MessageComponent,
      HospitalMessagesComponent,
      SearchserialComponent,
      AddProductComponent,
      ProfileComponent,
      PhotoEditorComponent,
      SurgeonComponent,
      ComboChartComponent,
      List_TransfersComponent,
      ListUserComponent,
      SelectValveComponent,
      SuitableAOValvesComponent,
      SuitableMValvesComponent,
      ListProductsComponent,
      ListVendorsComponent,
      ListHospitalsComponent,
      ProductDetailsCardComponent,
      productEditDetailsComponent,
      VendorDetailsCardComponent,
      VendorEditCardComponent,
      LookInOVIComponent,
      SelectValveTypeListComponent,
      SelectValveTypeDetailsComponent,
      HospitalEditCardComponent,
      SuperManageContactsComponent,
      SuperManageVendorsComponent
   ],
   imports: [
      CommonModule,
      HttpClientModule,
      FileUploadModule,
      TimeagoModule.forRoot(),
      ModalModule.forRoot(),
      BsDropdownModule.forRoot(),
      TabsModule.forRoot(),
      PaginationModule,
      BrowserModule,
      FormsModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      GoogleChartsModule,
      PaginationModule.forRoot(),
      BsDatepickerModule.forRoot(),
      JwtModule.forRoot({
         config: {
             tokenGetter: tokenGet,
             whitelistedDomains: ['localhost:5000'],
             blacklistedRoutes: ['localhost:5000/api/auth']
         }
     }),
   ],
   providers: [
      AuthService,
       AlertifyService,
        AuthGuard,
        ErrorInterceptorProvider,
        GeneralService,
        ProductService,
        HospitalService,
        VendorService,
        DropService,
        ValveService,
        UserService,
        ValveResolver,
        MessagesResolver,
        ExpiringProductsResolver,
        ListProductsResolver,
        ListVendorsResolver,
        ListHospitalsResolver,
        PreventUnsavedChanges,
        ProfileResolver,
        ListUserResolver,
        GraphService
        ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
