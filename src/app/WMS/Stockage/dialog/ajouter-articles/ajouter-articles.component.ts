import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { timeStamp } from 'console';

import Swal from 'sweetalert2';
import { StockageService } from '../../stockage.service';

@Component({
  selector: 'app-ajouter-articles',
  templateUrl: './ajouter-articles.component.html',
  styleUrls: ['./ajouter-articles.component.scss']
})
export class AjouterArticlesComponent implements OnInit {
  keyWord: any = [];
  prouduits: any = [];
  fromPage: any;
  prodChecked: any = [];
  dsiable: boolean = true;
  Quantite: any = 1;
  line: any = {}
  tva: any = 0;
  fodec: any = 0;
  Totale_TTC: any = 0;
  newAttribute: any = {}
  ChargeTransport: any = 0;
  Autre_Charge_Fixe: any = 0;
  Ch: any = 0;
  Montant_Fodec: any = 0;
  Total_HT: any = 0;
  Ch_Globale: any = 0;
  Remise: any = 0;
  Prix: any = 0;
  Montant_TVA: any = 0;
  dataArticle: any;
  loading: boolean = true;
  prodInStock: any = [];
  champ: string = "Sélectionnez votre option";
  value: any;
  searchFilter: any = '';
  query: any;
  id: any = "";
  nom: any = "";
  prix: any;
  local: any;

  @Output() prodEvent = new EventEmitter();
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;

  constructor(private Service: StockageService, public dialogRef: MatDialogRef<AjouterArticlesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.fromPage = data;
    this.local = data.local;
  }

  ngOnInit(): void {
    this.addProuduit();
    // this.getKeyWord();
  }

  filtre() {
    console.log(this.nom + "  " + this.id)
    this.Service.filtre_produit_id_nom(this.id, this.nom).subscribe((data) => {
      this.prouduits = data

    })
  }



  //** Product is in stock  */
  async isInStock(prod: any) {
    this.loading = true;
    for (let i = 0; i < prod.length; i++) {
      this.Service.getInfoProductByIdFromStock(prod[i].id_Produit.toString()).subscribe((result: any) => {
        if (result.body != null) {
          this.Service.getArticleById(prod[i].id_Produit.toString()).subscribe((res) => {
            this.dataArticle = res.body;
            if (prod[i].qte_Local == null) {
              this.newAttribute.qteStock = 0;
            }
            this.newAttribute.qteStock = prod[i].qte_Local
            this.newAttribute.id_Produit = prod[i].id_Produit;
            this.newAttribute.nom_Produit = this.dataArticle.nom_Produit;
            this.newAttribute.n_Imei = this.dataArticle.n_Imei;
            this.newAttribute.n_Serie = this.dataArticle.n_Serie;
            this.prouduits.push(this.newAttribute);
            this.newAttribute = {};
            this.prouduits.sort = this.sort;
            this.prouduits.paginator = this.paginator;
          });
        }
      });
    }

    this.loading = false;
  }

  //** Get and Add Article */  
  addProuduit() {
    this.loading = true;
    let prod: any = [];
    this.Service.listProdEnLocal(this.local).subscribe((res: any) => {
      res.body.forEach((element: any) => {
        prod.push(element);
      });
      this.isInStock(prod)
    })
  }





  //** Get All Product */
  checkCheckBoxvalue(event: any, prod: any) {
    if (event.target.checked) {
      this.dsiable = false;
      this.prodChecked.push(prod);
    }
    else {
      this.prodChecked = this.prodChecked.filter((value: any) => {
        return value.id_Produit != prod.id_Produit;
      });
    }
  }


  sendProd() {
    this.dialogRef.close({ event: 'close', data: this.prodChecked });
    this.dialogRef.afterClosed().subscribe(result => {
      this.fromPage = result;
    });
    this.prodChecked = [];
  }
}
