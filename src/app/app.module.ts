import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { ChildComponent } from './child/child.component';
import { SubChildComponent } from './sub-child/sub-child.component';
import { HttpClientModule } from '@angular/common/http';
import { EditBonReceptionComponent } from './WMS/Bon-Reception/edit-bon-reception/edit-bon-reception.component';
import { Ajouter_Bon_Rejet,Support,AjouterBonReceptionComponent } from './WMS/Bon-Reception/ajouter-bon-reception/ajouter-bon-reception.component';
import { ListerBonReceptionComponent } from './WMS/Bon-Reception/lister-bon-reception/lister-bon-reception.component';
import { MenuWmsComponent } from './WMS/menu-wms/menu-wms.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatStepperModule} from '@angular/material/stepper';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule  } from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {ModifierBonReceptionComponent,Modifier_Support } from './WMS/Bon-Reception/modifier-bon-reception/modifier-bon-reception.component';
import { BonRejetComponent } from './WMS/Bon-Reception/bon-rejet/bon-rejet.component';
import { EntreeBonReceptionComponent } from './WMS/Stockage/entree/entree-bon-reception/entree-bon-reception.component';
import { EditInventaireComponent } from './WMS/inventaire/edit-inventaire/edit-inventaire.component';
import { BonSortieComponent} from './WMS/Stockage/bon-sortie/bon-sortie.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table'  
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { ListerBonSortieComponent } from './WMS/Stockage/lister-bon-sortie/lister-bon-sortie.component';
import { DatePipe } from '@angular/common';
import { EditStockageComponent } from './WMS/Stockage/edit-stockage/edit-stockage.component';
import { BonTransfertComponent ,ligne ,Detail4g ,detail_serie } from './WMS/Stockage/bon-transfert/bon-transfert.component';
import { ListerBonTransfertComponent } from './WMS/Stockage/lister-bon-transfert/lister-bon-transfert.component';
import { ListerBonRetourComponent } from './WMS/Stockage/lister-bon-retour/lister-bon-retour.component';
import { BonRetourComponent, Detail4g_retour, detail_serie_retour, ligne_retour   } from './WMS/Stockage/bon-retour/bon-retour.component';
import {MatDatepickerModule } from '@angular/material/datepicker';
 
import {MatRadioModule} from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
 import { AjouterArticlesComponent } from './WMS/Stockage/dialog/ajouter-articles/ajouter-articles.component';
 import {MatProgressBarModule} from '@angular/material/progress-bar';
import { SearchFilterPipe } from './WMS/Stockage/dialog/search-filter-pipe/search-filter.pipe';
 
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
    Ajouter_Bon_Rejet,
    ModifierBonReceptionComponent,
    BonRejetComponent,
    Support,
    Modifier_Support,
   EditStockageComponent,
   EntreeBonReceptionComponent,
   EditInventaireComponent,
   BonSortieComponent,ligne,Detail4g,detail_serie,
   ListerBonSortieComponent,
   BonTransfertComponent,
   ligne ,Detail4g ,detail_serie ,
   ListerBonTransfertComponent, ListerBonRetourComponent, 
   BonRetourComponent,
   ligne_retour,Detail4g_retour,detail_serie_retour, AjouterArticlesComponent,
   SearchFilterPipe
  ],
  exports: [
     
     
     
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatStepperModule,
    FormsModule, ReactiveFormsModule,
    MatSelectModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule ,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    

    
  ],
   
  providers: [
    DatePipe,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
