import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatStepper } from "@angular/material/stepper";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
 
import { StockageService } from "../stockage.service";

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isNgTemplate } from "@angular/compiler";
import { AjouterArticlesComponent } from "../dialog/ajouter-articles/ajouter-articles.component";
import { Detail4g, detail_serie, ligne } from "../bon-transfert/bon-transfert.component";
 
declare var require: any

const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-bon-sortie',
  templateUrl: './bon-sortie.component.html',
  styleUrls: ['./bon-sortie.component.scss']
})
export class BonSortieComponent implements OnInit {
  isLinear = false;
  selectform: any = FormGroup;
  secondFormGroup: any = FormGroup;
  cloture: any = FormGroup;
  code: string = '';
  liste_articles: any;
  table: any = [];
  object: any = {};
   local:any
  @ViewChild('stepper') private myStepper: any = MatStepper;
  constructor( private datePipe: DatePipe,private http: HttpClient,private _formBuilder: FormBuilder, public service: StockageService, public dialog: MatDialog ,private router: Router) {

    // this.service.liste_articles().subscribe((data: any) => {
    //   this.liste_articles = data;
    // });
    sessionStorage.setItem('local', "tunis");
    this.local= sessionStorage.getItem('local'); 
      

    this.chargementModel();
    this.modelePdfBase64();
  }


  modele:any;
   // temps d'attente pour le traitement de fonction 
   delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // conversion de modele de pdf  en base 64 
  async modelePdfBase64() {
    await this.delai(4000);
    const lecteur = new FileReader();
    lecteur.onloadend = () => {
      this.modeleSrc = lecteur.result;
      this.modeleSrc = btoa(this.modeleSrc);
      this.modeleSrc = atob(this.modeleSrc);
      this.modeleSrc = this.modeleSrc.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    lecteur.readAsDataURL(this.modele);
  }
  // récupération de modele pour créer le pdf
  async chargementModel() {
    this.http.get('./../../../assets/images/ficheSortie.jpg', { responseType: 'blob' }).subscribe((reponse: any) => {
      this.modele = reponse;
      return this.modele;
    }, err => console.error(err))
  }

  ngOnInit() {

    this.selectform = this._formBuilder.group({
      code: ['' ],
      id: ['' ],
      id2: ['' ]
    });


    this.secondFormGroup = this._formBuilder.group({
      
    });

    this.cloture = this._formBuilder.group({
     
      reclamation: ['.', Validators.required]
    });
  }


  // Ajouter article au liste a traver le choix
  Ajouter_Article_avec_choix() {
    this.service.Article_Id(this.selectform.id2).subscribe((data) => {
      this.ajouter_article_table(data)
    })
    this.selectform.id2 = ""
  }
  obj: any = {}
  // Ajouter article au liste a traver le code a barre 
  Ajouter_Article_avec_code() {
    this.service.Arrticle_CodeBare(this.selectform.code).subscribe((data) => {
      this.obj = data;
      this.service.quentiteProdLocal(data.id_Produit, this.local).subscribe((data2) => {

        if (Number(data2.body) > 0) {
          this.obj.qteStock = data2.body
          this.ajouter_article_table(this.obj)
        }
        else {
          Swal.fire({
            title: '  Quantité non disponible   ',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ok',

          })
        }

      });
      //   
    })
    this.selectform.code = ""
  }
  // Ajouter article au liste a traver le id
  Ajouter_Article_avec_id() {
    this.service.Article_Id(this.selectform.id).subscribe((data) => {
      this.obj = data;
      this.service.quentiteProdLocal(data.id_Produit, this.local).subscribe((data2) => {

        if (Number(data2.body) > 0) {
          this.obj.qteStock = data2.body
          this.ajouter_article_table(this.obj)
        }
        else {
          Swal.fire({
            title: '  Quantité non disponible   ',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ok',

          })
        }

      });



    })
    this.selectform.id = ""
  }

  resultat_dialog: any;
  //** open Dialog */
  openDialog() {
  
    const dialogRef = this.dialog.open(AjouterArticlesComponent, {
      height: '600px', data: {
        fromPage: this.table,
        local: this.local
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log(res)
      this.resultat_dialog = res.data
      if (res != undefined) {
        for (let i = 0; i < this.resultat_dialog.length; i++) {
          this.ajouter_article_table(this.resultat_dialog[i])
        }
      }
    });
  }



  // ajouter ligne au table
  ajouter_article_table(art: any) {

 
    let test = 0;
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i].id == art.id_Produit) {
        test = 1;
        this.table[i].qte = this.table[i].qte + 1
      }
    }
    if (test == 0) {
      this.object = {}
      this.object.id = art.id_Produit
      this.object.nom = art.nom_Produit
      this.object.qte = 1
      this.object.complet = "Quantité vérifiée"

      this.object.type = "simple"
      this.object.detail = []
      if (art.n_Imei == 'true') {
        this.object.type = "4g"
        this.object.complet = "Quantité non vérifiée"


      } else if (art.n_Serie == 'true') {
        this.object.type = "serie"
        this.object.complet = "Quantité non vérifiée"

      }
      this.table.push(this.object)
    }
  }
  //modifier ligne de table
  Modifier_ligne_table(id: any) {
    console.log(id)
    this.object = {}
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i].id == id) {

        const dialogRef = this.dialog.open(ligne, {

          width: 'auto',
          data: { object: this.table[i] }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
      }
    }

  }
  //  supprimer ligne de table 
  Supprimer_ligne_table(index: any) {

    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez le',
      cancelButtonText: 'Non, garde le'
    }).then((res) => {
      if (res.value) {
        this.table.splice(index, 1);

      } else if (res.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          '',
          'error'
        )
      }
    }
    );

  }

  // detail article 
  plus(produit: any) {
     
    if (produit.type == "simple") {
      Swal.fire({
        title: ' Produit Simple ',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ok',

      })
    } else if (produit.type == "4g") {
      const dialogRef = this.dialog.open(Detail4g , {

        width: 'auto',
        data: { object: produit }
      });
      dialogRef.afterClosed().subscribe(result => {
      });
    } else if (produit.type == "serie") {

      const dialogRef = this.dialog.open(detail_serie , {

        width: 'auto',
        data: { object: produit }
      });
      dialogRef.afterClosed().subscribe(result => {
      });

    }



  }

  valide()
  {
    if (this.cloture.reclamation != 'undefined') { this.cloture.reclamation = "-" }
    let test = "1"
    for (let i = 0; i < this.table.length; i++) {
       console.log(this.table[i].complet + "" == "Quantité non vérifiée")
      if (this.table[i].complet + "" == "Quantité non vérifiée") { test = "0" }
    }
   

    if (test == "0")
    {
      Swal.fire({
        title: 'Bon de Transfert ne pas être fini   ',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ok',

      })
    }
    else {
   this.Creer_Bon_Sortie();
    }
    
  }

  doc:any ;
  bonsortie:any;
  // creer bon sortie 
  Creer_Bon_Sortie()
  {
    this.doc = document.implementation.createDocument("Bon_Sortie", "", null);

    var BR = this.doc.createElement("Bon_Sortie");
 
    var Local = this.doc.createElement("Local"); Local.innerHTML = this.cloture.local

    var InformationsGenerales = this.doc.createElement("Informations-Generales");   
     
    var Responsable = this.doc.createElement("Responsable"); Responsable.innerHTML = "Responsable";
    InformationsGenerales.appendChild(Local); 
    InformationsGenerales.appendChild(Responsable);
    var Produits_Listes = this.doc.createElement('Produits')

    var Produits_series = this.doc.createElement('Produits_Series')
    var Produits_simple = this.doc.createElement('Produits_Simples')
    var Produits_4g = this.doc.createElement('Produits_4gs')
    for (let i = 0; i < this.table.length; i++) {

      var Produit = this.doc.createElement('Produit')
      var id = this.doc.createElement('Id'); id.innerHTML = this.table[i].id
      var Nom = this.doc.createElement('Nom'); Nom.innerHTML = this.table[i].nom
      var Qte = this.doc.createElement('Qte'); Qte.innerHTML = this.table[i].qte
      Produit.appendChild(id);
      Produit.appendChild(Nom);
      Produit.appendChild(Qte);

   
      if(this.table[i].type=='simple')
      {
        Produits_simple.appendChild(Produit);
      }
      else if (this.table[i].type=='serie') 
      {
        var n_series = this.doc.createElement('N_Series'); Qte.innerHTML = this.table[i].qte
        for(let j = 0 ; j<this.table[i].detail.length; j++)
        {
          var ns = this.doc.createElement('N_Serie'); ns.innerHTML = this.table[i].detail[j].ns
  
          n_series.appendChild(ns);
        }
        console.log(n_series)
        Produit.appendChild(n_series);
        Produits_series.appendChild(Produit)

      }
      else if (this.table[i].type=='4g') 
      {
        var p4gs = this.doc.createElement('Produit_4gs'); Qte.innerHTML = this.table[i].qte
        for(let j = 0 ; j<this.table[i].detail.length; j++)
        {
          var p4g = this.doc.createElement('Produit_4g'); Qte.innerHTML = this.table[i].qte
          var ns = this.doc.createElement('N_Serie'); ns.innerHTML = this.table[i].detail[j].ns
          var e1 = this.doc.createElement('E1'); e1.innerHTML = this.table[i].detail[j].e1
          var e2 = this.doc.createElement('E2'); e2.innerHTML = this.table[i].detail[j].e2
          p4g.appendChild(ns);
          p4g.appendChild(e1);
          p4g.appendChild(e2);
          p4gs.appendChild(p4g);
          
        }
        Produit.appendChild(p4gs)
        Produits_4g.appendChild(Produit)
      } 
      Produits_Listes.appendChild(Produits_simple)
      Produits_Listes.appendChild(Produits_4g)
      Produits_Listes.appendChild(Produits_series)
    }
    
    BR.appendChild(InformationsGenerales);
    BR.appendChild(Produits_Listes);

    this.doc.appendChild(BR)
    console.log(this.doc)


    var formData: any = new FormData();
    let url = "assets/BonRejet.xml";
    fetch(url)
      .then(response => response.text())
      .then(data => {
        let xml2string = new XMLSerializer().serializeToString(this.doc.documentElement);
        var myBlob = new Blob([xml2string], { type: 'application/xml' });
        var myFile = this.convertBlobFichier(myBlob, "assets/BonRejet.xml");

        
    
        formData.append('Responsable', "User2");
     
        formData.append('Local', this.cloture.local);
         
        formData.append('Reclamations', this.cloture.reclamation);

        formData.append('Detail', myFile);
        this.service.creer_Bon_Sortie(formData).subscribe(data => {
           
          this.bonsortie = data
          Swal.fire({
            title: 'Bon Sortie!',
            text: 'Bon Sortie est crée et envoyée.',
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: 'green',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Imprimer',
            cancelButtonText: 'Quitter'
          }).then((result) => {

            if (result.isConfirmed) {

               this.generatePDF(this.bonsortie.id, this.bonsortie.date_Creation)

            }

          })
        });

      //  this.router.navigate(['/Menu/WMS-Inventaire/Lister_Bon_Sortie'])
      })
  }
   //convertir blob à un fichier  
   convertBlobFichier = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }

  ch:any
  modeleSrc: any;
  //impression de la fiche recption
  generatePDF(id: any, date_Creation: any) {

    var body = [];
     
    for (let i = 0; i < this.table.length; i++) {
      var obj = new Array();
      obj.push(this.table[i].id);
      obj.push(this.table[i].nom);     
      obj.push(this.table[i].qte); 
      this.ch=""
      if (this.table[i].type=='serie') 
      {
        
        for(let j = 0 ; j<this.table[i].detail.length; j++)
        {
          this.ch=this.ch+"N_Série : "+this.table[i].detail[j].ns +"\n" 
          this.ch=this.ch+" ----------------------  \n"  
        }
       

      }
      else if (this.table[i].type=='4g') 
      {
       
        for(let j = 0 ; j<this.table[i].detail.length; j++)
        {
           this.ch=this.ch+"N_Série : "+this.table[i].detail[j].ns +"\n"     
           this.ch=this.ch+"E1 : "+this.table[i].detail[j].e1 +"\n"     
           this.ch=this.ch+"E2 : "+this.table[i].detail[j].e2 +"\n"  
           this.ch=this.ch+" ----------------------  \n"  
            
        }
        
        
      }   
      obj.push(this.ch)
      body.push(obj);
    }    
    
    var def = {
      
      
      defaultStyle: {
        // alignment: 'justify'
      },
      pageMargins: [40, 250, 40, 180],
      info: {
        title: 'Fiche Bon Sortie',
       },
      footer: function (currentPage:any, pageCount:any) {
        return {
          margin: 35,
          columns: [
            {
              fontSize: 9,
              text: [
  
                {
                  text: currentPage.toString() + '/' + pageCount,
                }
              ],
              relativePosition: {x:250, y: 130}	
            } 
          ]
        };
      },
      header:[ 
        {
          text: '' + id + '\n\n',
          fontSize: 15, 
          color: 'black',
          bold: true,
          relativePosition: {x:370, y:182}	       
        },
      {
        text: ' ' + this.cloture.local ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:70, y:106}	  , 
         
      },
      
      {
        text: 'rochdi'  ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:390, y:96}	  , 
         
      },
      {
        text: ''+this.datePipe.transform(date_Creation, 'dd/MM/yyyy')  ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:520, y:96}	  , 
         
      },
      {
        text: ' ' +this.cloture.reclamation ,
        fontSize: 10, 
        color: 'black',            
        relativePosition: {x: 80, y:665}	       
      }, 
      {
        text: 'rochdi' ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:90, y:131}	       
      },
      {
        text: ''+this.datePipe.transform(date_Creation, 'dd/MM/yyyy')  ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:65, y:154}	       
      },
     ] ,
      background: [
        {
          image: 'data:image/jpeg;base64,' + this.modeleSrc, width: 600
        }
      ],

      content: [
       
        {
          layout: 'lightHorizontalLines',
          table: {          
            widths: [ 40, 270, 20,180 ],         
            body: body, 
          },      
          fontSize: 10, 
          margin: [-30, 0 , 10,300]     
        }
        
         
      ],
      
    };

    pdfMake.createPdf(def).open({ defaultFileName: 'Fiche_sortie'+id+'.pdf' });

  }

}




 