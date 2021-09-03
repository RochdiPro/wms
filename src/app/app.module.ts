import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { ChildComponent } from './child/child.component';
import { SubChildComponent } from './sub-child/sub-child.component';
import { HttpClientModule } from '@angular/common/http';
import { EditBonReceptionComponent } from './WMS/Bon-Reception/edit-bon-reception/edit-bon-reception.component';
import { AjouterBonReceptionComponent } from './WMS/Bon-Reception/ajouter-bon-reception/ajouter-bon-reception.component';
import { ListerBonReceptionComponent } from './WMS/Bon-Reception/lister-bon-reception/lister-bon-reception.component';
import { MenuWmsComponent } from './WMS/menu-wms/menu-wms.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
 
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ChildComponent,
    SubChildComponent,
    EditBonReceptionComponent,
    AjouterBonReceptionComponent,
    ListerBonReceptionComponent,
    MenuWmsComponent,
   
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
