import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChildComponent } from './child/child.component';
import { MenuComponent } from './menu/menu.component';
import { SubChildComponent } from './sub-child/sub-child.component';
import { AjouterBonReceptionComponent } from './WMS/Bon-Reception/ajouter-bon-reception/ajouter-bon-reception.component';
import { BonRejetComponent } from './WMS/Bon-Reception/bon-rejet/bon-rejet.component';
import { EditBonReceptionComponent } from './WMS/Bon-Reception/edit-bon-reception/edit-bon-reception.component';
import { ListerBonReceptionComponent } from './WMS/Bon-Reception/lister-bon-reception/lister-bon-reception.component';
import { ModifierBonReceptionComponent } from './WMS/Bon-Reception/modifier-bon-reception/modifier-bon-reception.component';
import { BonSortieComponent } from './WMS/Stockage/bon-sortie/bon-sortie.component';
import { EditInventaireComponent } from './WMS/inventaire/edit-inventaire/edit-inventaire.component';
import { ListerBonSortieComponent } from './WMS/Stockage/lister-bon-sortie/lister-bon-sortie.component';
import { MenuWmsComponent } from './WMS/menu-wms/menu-wms.component';
 import { EntreeBonReceptionComponent } from './WMS/Stockage/entree/entree-bon-reception/entree-bon-reception.component';
import { EditStockageComponent } from './WMS/Stockage/edit-stockage/edit-stockage.component';
   
 
const routes: Routes =
  [
    { path: '', redirectTo: 'Menu', pathMatch: 'full' },

    {
      path: 'Menu', component: MenuComponent, children: [         
        {
          path: 'child', component: ChildComponent, children: [          
            { path: 'Sub_child', component: SubChildComponent},   
          ]
        } ,

        //       wms routing 

        {path: 'WMS', component: MenuWmsComponent},
        {
          path: 'WMS-Reception', component: EditBonReceptionComponent, children: [
            { path: '', redirectTo: 'WMS-Reception', pathMatch: 'full' },          
            { path: 'Lister', component: ListerBonReceptionComponent},
            { path: 'Ajouter', component: AjouterBonReceptionComponent},   
            { path: 'Rejet', component: BonRejetComponent},   
            { path: 'Modifier/:id', component: ModifierBonReceptionComponent},   
          ]
        } ,
        {
           path: 'WMS-Stockage', component: EditStockageComponent, children: [
             { path: '', redirectTo: 'WMS-Stockage', pathMatch: 'full' },          
            { path: 'Entree', component: EntreeBonReceptionComponent},
            { path: 'Bon_Sortie', component: BonSortieComponent},
            { path: 'Lister_Bon_Sortie', component: ListerBonSortieComponent},
            
          ]
        } ,
        {
          path: 'WMS-Inventaire', component: EditInventaireComponent, children: [
            { path: '', redirectTo: 'WMS-Inventaire', pathMatch: 'full' },          
          
        
         ]
       } 


        //WMS-Inventaire/Bon_Sortie
        //   wms routing 


    ]}]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
