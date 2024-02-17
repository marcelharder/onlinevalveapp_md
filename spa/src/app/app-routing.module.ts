import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { AuthGuard } from './_guards/auth.guard';
import { CompanyadminComponent } from './companyadmin/companyadmin.component';
import { ValveResolver } from './_resolvers/ValveResolver';
import { AddCompanyValveComponent } from './companyadmin/AddCompanyValve/AddCompanyValve.component';
import { SuperuserComponent } from './superuser/superuser.component';
import { SettingsCompanyComponent } from './companyadmin/settings-company/settings-company.component';
import { MessageComponent } from './companyadmin/messages/message.component';
import { MessagesResolver } from './_resolvers/MessageResolver';
import { ExpiryComponent } from './companyadmin/expiry/expiry.component';
import { ExpiringProductsResolver } from './_resolvers/ExpiringProductsResolver';
import { SearchserialComponent } from './companyadmin/searchserial/searchserial.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileResolver } from './_resolvers/ProfileResolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { SurgeonComponent } from './Surgeon/Surgeon.component';
import { ListUserResolver } from './_resolvers/ListUserResolver';
import { ListUserComponent } from './admin/list-user/list-user-component';
import { Expiry3monthsComponent } from './companyadmin/expiry3months/expiry3months.component';
import { SelectValveComponent } from './Surgeon/selectValve/selectValve.component';
import { ListProductsComponent } from './admin/list-products/list-products.component';
import { ListProductsResolver } from './_resolvers/ListProductsResolver';
import { ListVendorsComponent } from './admin/list-vendors/list-vendors.component';
import { ListVendorsResolver } from './_resolvers/ListVendorsResolver';
import { ListHospitalsComponent } from './admin/list-hospitals/list-hospitals.component';
import { ListHospitalsResolver } from './_resolvers/ListHospitalsResolver';
import { SettingsComponent } from './superuser/settings/settings.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'selectValve', component: SelectValveComponent },
  { path: 'about', component: AboutComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [

      { path: 'profile/:id', component: ProfileComponent, resolve: { user: ProfileResolver }, canDeactivate: [PreventUnsavedChanges] },
      { path: 'surgeon', component: SurgeonComponent },
      //    { path: 'admin', component: AdminComponent },

      { path: 'userlist', component: ListUserComponent, resolve: {users: ListUserResolver} },
      { path: 'hospitallist', component: ListHospitalsComponent, resolve: {hospitals: ListHospitalsResolver} },
      { path: 'productlist', component: ListProductsComponent, resolve: {products: ListProductsResolver} },
      { path: 'vendorlist', component: ListVendorsComponent, resolve: {vendors: ListVendorsResolver} },
      { path: 'companyadmin', component: CompanyadminComponent },
      { path: 'addCompanyValve/:id', component: AddCompanyValveComponent, resolve: {valve: ValveResolver} },
      { path: 'superuser', component: SuperuserComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'search', component: SearchserialComponent },
      //    { path: 'tutorials', component: TutorialsComponent },
      //    { path: 'statistics', component: StatisticsComponent },
      { path: 'companysettings/:id', component: SettingsCompanyComponent },
      { path: 'messages', component: MessageComponent, resolve: {messages: MessagesResolver} },
      { path: 'expiry1/:id', component: ExpiryComponent, resolve: {products: ExpiringProductsResolver} },
      { path: 'expiry3/:id', component: Expiry3monthsComponent, resolve: {products: ExpiringProductsResolver} },
      //    { path: 'addProduct/:id', component: AddProductComponent, resolve: {valve: ValveResolver} },
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
