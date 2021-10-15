import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
 
import Swal from 'sweetalert2';
import { StockageService } from '../../stockage.service';

@Component({
  selector: 'app-ajouter-articles',
  templateUrl: './ajouter-articles.component.html',
  styleUrls: ['./ajouter-articles.component.scss']
})
export class AjouterArticlesComponent implements OnInit {
  keyWord: any = [];
  prouduits : any =[]; 
  fromPage: any ; 
  prodChecked : any = [] ; 
  dsiable: boolean = true; 
  Quantite: any = 1;
  line : any = {}
  tva: any = 0;
  fodec: any = 0;
  Totale_TTC: any = 0;
  newAttribute : any = {}  
  ChargeTransport: any = 0;
  Autre_Charge_Fixe: any = 0;
  Ch: any = 0;
  Montant_Fodec: any = 0;
  Total_HT: any = 0;
  Ch_Globale: any = 0;
  Remise: any = 0;
  Prix: any = 0;
  Montant_TVA: any = 0;
  dataArticle : any ; 
  loading : boolean = true; 
  prodInStock : any = []; 
  champ : string = "Sélectionnez votre option";
  value: any; 
  searchFilter: any = '';
  query : any; 
  id: any; 
  nom : any; 
  prix : any ; 
  local : any ; 

  @Output() prodEvent = new EventEmitter();
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;

  constructor(private devisService : StockageService,public dialogRef: MatDialogRef<AjouterArticlesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.fromPage = data;
      this.local = data.local;
    }

  ngOnInit(): void {
    this.addProuduit();
    this.getKeyWord();
  }
// applyFilter
applyFilter(value : any ){
  value = value.target.value
  value = value.trim(); // Remove whitespace
  value = value.toLowerCase(); // MatTableDataSource defaults to lowercase matches
  this.devisService.filterByChampValeurForProd(value, this.value).subscribe((data: any)=>{
    data.body.map((ele: any)=>{
      this.devisService.getInfoProductByIdFromStock(ele.id_Produit.toString()).subscribe((result : any)=>{
        if(result.body != null){
          this.devisService.getArticleById(ele.id_Produit.toString()).subscribe((res) => {    
            this.devisService.quentiteProdLocal(ele.id_Produit, this.local).subscribe((r:any)=>{
              this.dataArticle = res.body;      
              this.newAttribute.qteStock = r.body
              this.newAttribute.id_Produit = ele.id_Produit;
              this.newAttribute.nom_Produit = this.dataArticle.nom_Produit;
              this.newAttribute.n_Imei = this.dataArticle.n_Imei;
              this.newAttribute.n_Serie = this.dataArticle.n_Serie;
              this.newAttribute.tva = this.dataArticle.tva;
              this.tva = this.newAttribute.tva;
              this.newAttribute.ch = this.Ch;
              this.newAttribute.chargeTr = this.ChargeTransport;
              this.newAttribute.autreCharge = this.Autre_Charge_Fixe;
              
              this.newAttribute.remise = Number(this.Remise);
              if (this.dataArticle.fodec == "Sans_Fodec") {
                this.newAttribute.fodec = 0;
              }
              else {
                this.newAttribute.fodec = 1;
              }
           
                this.fodec = this.newAttribute.fodec;
                this.newAttribute.prixU = Number(result.body.prix).toFixed(3); 
                this.newAttribute.quantite =1;
                this.newAttribute.finalPrice=  Number(this.newAttribute.prixU - (this.newAttribute.prixU * (Number(this.newAttribute.remise)) / 100)).toFixed(3)  

                this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);
                this.newAttribute.qprixU = Number(this.Prix).toFixed(3);
                this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
                this.newAttribute.montant_Fodec = Number(this.Montant_Fodec).toFixed(3);
    
                // Montant Tva u = (prix*tva)/100
                this.Montant_TVA = Number((this.newAttribute.finalPrice * Number((this.newAttribute.tva))) / 100).toFixed(3);
                this.newAttribute.montant_TVA = this.Montant_TVA;
                // Total ht = prix * qt
                this.Total_HT = Number(this.newAttribute.finalPrice * this.newAttribute.quantite); 
                this.newAttribute.total_HT = Number(this.Total_HT).toFixed(3);
                //  prix u ttc = prix u  + montant tva u 
                this.newAttribute.prix_U_TTC = (((Number(this.newAttribute.finalPrice) + Number((this.newAttribute.montant_Fodec)/this.newAttribute.quantite) + Number(this.newAttribute.montant_TVA)))).toFixed(3);
    
                this.newAttribute.montant_TTC = Number(this.newAttribute.prix_U_TTC) * Number(this.newAttribute.quantite);
                this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
               
                //  total ttc = prix u ttc * qte
                this.Totale_TTC = Number((this.newAttribute.prix_U_TTC * this.newAttribute.quantite)).toFixed(3) ;                    
                this.newAttribute.totale_TTC =this.Totale_TTC;
    
                this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
                this.newAttribute.ch_Globale = Number(this.Ch_Globale);
  
                this.newAttribute.etatEntree = "Entrée Stock Non Accompli";
                this.newAttribute.fichierSimple = "";
                this.newAttribute.fichierSerie = "";
                this.newAttribute.fichier4G = "";
                this.newAttribute.produitsSeries = "";
                this.newAttribute.produits4g = "";
                this.newAttribute.etat = '' 
                this.newAttribute.etat = 'Dispo.'
                this.prouduits.push(this.newAttribute);

                this.newAttribute ={};
                this.prouduits.sort = this.sort;
                this.prouduits.paginator = this.paginator; 
             });
            }); 
        }            
        });
        this.loading = false;  
    });
  });
}
//** Product is in stock  */
  async isInStock(prod : any){
    this.loading = true;
    for(let i = 0; i< prod.length; i++){
      this.devisService.getInfoProductByIdFromStock(prod[i].id_Produit.toString()).subscribe((result : any)=>{
        if(result.body != null){
          this.devisService.getArticleById(prod[i].id_Produit.toString()).subscribe((res) => { 
            this.dataArticle = res.body; 
            if(prod[i].qte_Local == null){
              this.newAttribute.qteStock = 0; 
            }      
            this.newAttribute.qteStock = prod[i].qte_Local
            this.newAttribute.id_Produit = prod[i].id_Produit;
            this.newAttribute.nom_Produit = this.dataArticle.nom_Produit;
            this.newAttribute.n_Imei = this.dataArticle.n_Imei;
            this.newAttribute.n_Serie = this.dataArticle.n_Serie;
            this.newAttribute.tva = this.dataArticle.tva;
            this.tva = this.newAttribute.tva;
            this.newAttribute.ch = this.Ch;
            this.newAttribute.chargeTr = this.ChargeTransport;
            this.newAttribute.autreCharge = this.Autre_Charge_Fixe;
            
            this.newAttribute.remise = Number(this.Remise);
            if (this.dataArticle.fodec == "Sans_Fodec") {
              this.newAttribute.fodec = 0;
            }
            else {
              this.newAttribute.fodec = 1;
            }
              this.fodec = this.newAttribute.fodec;
              this.newAttribute.prixU = Number(result.body.prix).toFixed(3); 
              this.newAttribute.finalPrice=  (this.newAttribute.prixU - (this.newAttribute.prixU * (Number(this.newAttribute.remise)) / 100)).toFixed(3)  

              this.newAttribute.quantite =1;
              this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);
              this.newAttribute.qprixU = Number(this.Prix).toFixed(3);
              this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
              this.newAttribute.montant_Fodec = Number(this.Montant_Fodec).toFixed(3);
  
              // Montant Tva u = (prix*tva)/100
              this.Montant_TVA = Number((this.newAttribute.finalPrice * Number((this.newAttribute.tva))) / 100).toFixed(3);
              this.newAttribute.montant_TVA = this.Montant_TVA;
              // Total ht = prix * qt
              this.Total_HT = Number(this.newAttribute.finalPrice * this.newAttribute.quantite); 
              this.newAttribute.total_HT = Number(this.Total_HT).toFixed(3);
              //  prix u ttc = prix u  + montant tva u 
              this.newAttribute.prix_U_TTC = (((Number(this.newAttribute.finalPrice) + Number((this.newAttribute.montant_Fodec)/this.newAttribute.quantite) + Number(this.newAttribute.montant_TVA)))).toFixed(3);
  
              this.newAttribute.montant_TTC = Number(this.newAttribute.prix_U_TTC) * Number(this.newAttribute.quantite);
              this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
              //  total ttc = prix u ttc * qte
              this.Totale_TTC = Number((this.newAttribute.prix_U_TTC * this.newAttribute.quantite)).toFixed(3) ;                    
              this.newAttribute.totale_TTC =this.Totale_TTC;

              this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
              this.newAttribute.ch_Globale = Number(this.Ch_Globale);

              this.newAttribute.etatEntree = "Entrée Stock Non Accompli";
              this.newAttribute.fichierSimple = "";
              this.newAttribute.fichierSerie = "";
              this.newAttribute.fichier4G = "";
              this.newAttribute.produitsSeries = "";
              this.newAttribute.produits4g = "";
              this.newAttribute.etat = 'Dispo.'
              this.prouduits.push(this.newAttribute);
              this.newAttribute ={};
              this.prouduits.sort = this.sort;
              this.prouduits.paginator = this.paginator;
            });
        }
      });
    }   
    
    this.loading = false;  
  }

//** Get and Add Article */  
  addProuduit(){
    this.loading = true; 
    let prod : any = []; 
    this.devisService.listProdEnLocal(this.local).subscribe((res: any )=>{
      res.body.forEach((element: any ) => {
        prod.push(element);
      });
      console.log(prod);
      
    this.isInStock(prod)  
    })
}

//** on Change select */
  onChange(ev:any){
    this.champ = ev.target.value;
  }
/** get Value from select option */
 getValue(ev: any){
      this.value = ev.target.value
 }
 clickButtonfilterByChamp(ev: any){
   console.log(ev);
   
 }
//** filter produit By Champ */
filterByChamp(event : any ){
  this.loading = true;  
  this.prouduits = [];
  this.value = event.target.value
  
  if((this.prouduits.length =0) || (this.champ ==='') || (this.champ == undefined)){
    Swal.fire("Produit non trouvé!");
    this.loading = false;
  }
  if(this.champ ==='code_barre'){
    console.log('here');
    this.filterByCodeAbare(this.value.toString());
  }else{
    this.devisService.filterByChampValeurForProd(this.champ, this.value).subscribe((data: any)=>{
      data.body.map((ele: any)=>{
        this.devisService.getInfoProductByIdFromStock(ele.id_Produit.toString()).subscribe((result : any)=>{
          if(result.body != null){
            this.devisService.getArticleById(ele.id_Produit.toString()).subscribe((res) => {    
              this.devisService.quentiteProdLocal(ele.id_Produit, this.local).subscribe((r:any)=>{
                this.dataArticle = res.body;      
                this.newAttribute.qteStock = r.body
                this.newAttribute.id_Produit = ele.id_Produit;
                this.newAttribute.nom_Produit = this.dataArticle.nom_Produit;
                this.newAttribute.n_Imei = this.dataArticle.n_Imei;
                this.newAttribute.n_Serie = this.dataArticle.n_Serie;
                this.newAttribute.tva = this.dataArticle.tva;
                this.tva = this.newAttribute.tva;
                this.newAttribute.ch = this.Ch;
                this.newAttribute.chargeTr = this.ChargeTransport;
                this.newAttribute.autreCharge = this.Autre_Charge_Fixe;
                
                this.newAttribute.remise = Number(this.Remise);
                if (this.dataArticle.fodec == "Sans_Fodec") {
                  this.newAttribute.fodec = 0;
                }
                else {
                  this.newAttribute.fodec = 1;
                }
             
                  this.fodec = this.newAttribute.fodec;
                  this.newAttribute.prixU = Number(result.body.prix).toFixed(3); 
                  this.newAttribute.quantite =1;
                  this.newAttribute.finalPrice=  Number(this.newAttribute.prixU - (this.newAttribute.prixU * (Number(this.newAttribute.remise)) / 100)).toFixed(3)  
  
                  this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);
                  this.newAttribute.qprixU = Number(this.Prix).toFixed(3);
                  this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
                  this.newAttribute.montant_Fodec = Number(this.Montant_Fodec).toFixed(3);
      
                  // Montant Tva u = (prix*tva)/100
                  this.Montant_TVA = Number((this.newAttribute.finalPrice * Number((this.newAttribute.tva))) / 100).toFixed(3);
                  this.newAttribute.montant_TVA = this.Montant_TVA;
                  // Total ht = prix * qt
                  this.Total_HT = Number(this.newAttribute.finalPrice * this.newAttribute.quantite); 
                  this.newAttribute.total_HT = Number(this.Total_HT).toFixed(3);
                  //  prix u ttc = prix u  + montant tva u 
                  this.newAttribute.prix_U_TTC = (((Number(this.newAttribute.finalPrice) + Number((this.newAttribute.montant_Fodec)/this.newAttribute.quantite) + Number(this.newAttribute.montant_TVA)))).toFixed(3);
      
                  this.newAttribute.montant_TTC = Number(this.newAttribute.prix_U_TTC) * Number(this.newAttribute.quantite);
                  this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
                 
                  //  total ttc = prix u ttc * qte
                  this.Totale_TTC = Number((this.newAttribute.prix_U_TTC * this.newAttribute.quantite)).toFixed(3) ;                    
                  this.newAttribute.totale_TTC =this.Totale_TTC;
      
                  this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
                  this.newAttribute.ch_Globale = Number(this.Ch_Globale);
    
                  this.newAttribute.etatEntree = "Entrée Stock Non Accompli";
                  this.newAttribute.fichierSimple = "";
                  this.newAttribute.fichierSerie = "";
                  this.newAttribute.fichier4G = "";
                  this.newAttribute.produitsSeries = "";
                  this.newAttribute.produits4g = "";
                  this.newAttribute.etat = '' 
                  this.newAttribute.etat = 'Dispo.'
                  this.prouduits.push(this.newAttribute);
  
                  this.newAttribute ={};
                  this.prouduits.sort = this.sort;
                  this.prouduits.paginator = this.paginator; 
               });
              }); 
          }            
          });
          this.loading = false;  
      });
    });
  }
}
//** Filter by code à bare  */
filterByCodeAbare(code : string){
    this.devisService.getProduitByCodeBar(code).subscribe((data: any)=>{
      console.log(code, data);
      
      data.body.map((ele: any)=>{
        console.log('ele', ele);    
        this.devisService.getInfoProductByIdFromStock(ele.id_Produit.toString()).subscribe((result : any)=>{
          if(result.body != null){
            this.devisService.getArticleById(ele.id_Produit.toString()).subscribe((res) => {  
              this.devisService.quentiteProdLocal(ele.id_Produit, this.local).subscribe((r:any)=>{
                this.dataArticle = res.body; 
                this.newAttribute.qteStock = r.body
                this.newAttribute.id_Produit = ele.id_Produit;
                this.newAttribute.nom_Produit = this.dataArticle.nom_Produit;
                this.newAttribute.n_Imei = this.dataArticle.n_Imei;
                this.newAttribute.n_Serie = this.dataArticle.n_Serie;
                this.newAttribute.tva = this.dataArticle.tva;
                this.tva = this.newAttribute.tva;
                this.newAttribute.ch = this.Ch;
                this.newAttribute.chargeTr = this.ChargeTransport;
                this.newAttribute.autreCharge = this.Autre_Charge_Fixe;
                
                this.newAttribute.remise = Number(this.Remise);
                if (this.dataArticle.fodec == "Sans_Fodec") {
                  this.newAttribute.fodec = 0;
                }
                else {
                  this.newAttribute.fodec = 1;
                }
             
                  this.fodec = this.newAttribute.fodec;
                  this.newAttribute.prixU = Number(result.body.prix).toFixed(3); 
                  this.newAttribute.finalPrice=  Number(this.newAttribute.prixU - (this.newAttribute.prixU * (Number(this.newAttribute.remise)) / 100)).toFixed(3)  
  
                  this.newAttribute.quantite =1;
                  this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);
                  this.newAttribute.qprixU = Number(this.Prix).toFixed(3);
                  this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
                  this.newAttribute.montant_Fodec = Number(this.Montant_Fodec).toFixed(3);
      
                  // Montant Tva u = (prix*tva)/100
                  this.Montant_TVA = Number((this.newAttribute.finalPrice * Number((this.newAttribute.tva))) / 100).toFixed(3);
                  this.newAttribute.montant_TVA = this.Montant_TVA;
                  // Total ht = prix * qt
                  this.Total_HT = Number(this.newAttribute.finalPrice * this.newAttribute.quantite); 
                  this.newAttribute.total_HT = Number(this.Total_HT).toFixed(3);
                  //  prix u ttc = prix u  + montant tva u 
                  this.newAttribute.prix_U_TTC = (((Number(this.newAttribute.finalPrice) + Number((this.newAttribute.montant_Fodec)/this.newAttribute.quantite) + Number(this.newAttribute.montant_TVA)))).toFixed(3);
      
                  this.newAttribute.montant_TTC = Number(this.newAttribute.prix_U_TTC) * Number(this.newAttribute.quantite);
                  this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
                  //  total ttc = prix u ttc * qte
                  this.Totale_TTC = Number((this.newAttribute.prix_U_TTC * this.newAttribute.quantite)).toFixed(3) ;                    
                  this.newAttribute.totale_TTC =this.Totale_TTC;
  
      
                  this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
                  this.newAttribute.ch_Globale = Number(this.Ch_Globale);
    
                  this.newAttribute.etatEntree = "Entrée Stock Non Accompli";
                  this.newAttribute.fichierSimple = "";
                  this.newAttribute.fichierSerie = "";
                  this.newAttribute.fichier4G = "";
                  this.newAttribute.produitsSeries = "";
                  this.newAttribute.produits4g = "";
                  this.newAttribute.etat = '' 
                  this.newAttribute.etat = 'Dispo.'
                  this.prouduits.push(this.newAttribute);
                  this.newAttribute ={};
                  this.prouduits.sort = this.sort;
                  this.prouduits.paginator = this.paginator;
              });             

              }); 
          }            
          });
          this.loading = false;  
      });
    });
}
//** Get All Product */
checkCheckBoxvalue(event : any , prod: any){
    if(event.target.checked) {
      this.dsiable = false;
      this.prodChecked.push(prod);
    }
    else {
      this.prodChecked =  this.prodChecked.filter((value: any) =>{
         return value.id_Produit != prod.id_Produit ; 
       }); 
    }  
  }
//** Get Key word frm the table "Devis" */
getKeyWord(){
    this.devisService.getListChampsProduit().subscribe(res => this.keyWord = res)
  }

sendProd(){
    this.dialogRef.close({ event: 'close', data: this.prodChecked });
    this.dialogRef.afterClosed().subscribe(result => {  
      this.fromPage = result; 
      });
    this.prodChecked = []; 
  }
}
