 
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

declare var require: any

const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-bon-retour',
  templateUrl: './bon-retour.component.html',
  styleUrls: ['./bon-retour.component.scss']
})
export class BonRetourComponent implements OnInit {

  isLinear = false;
  optionFormGroup: any = FormGroup;
  info : any = FormGroup;
  selectform: any = FormGroup;
  secondFormGroup: any = FormGroup;
  cloture: any = FormGroup;
  code: string = '';
  liste_articles: any;
  table: any = [];
  object: any = {};
  locals:any;
  source :any
  facture:any;
  Clients:any;
  Liste_Factures:any;
  @ViewChild('stepper') private myStepper: any = MatStepper;
  constructor( private datePipe: DatePipe,private http: HttpClient,private _formBuilder: FormBuilder, public service: StockageService, public dialog: MatDialog ,private router: Router) {

    this.service.liste_articles().subscribe((data: any) => {
      this.liste_articles = data;
    });
    this.service.locals().subscribe((data:any) => {
      this.locals=data
    })
    this.service.Clients().subscribe((data:any) => {
      this.Clients=data
    })
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

    this.info = this._formBuilder.group({
      client: ['', Validators.required],
      facture: ['', Validators.required],
     
    });
    this.selectform = this._formBuilder.group({   
      code: ['', Validators.required],
      id: ['', Validators.required],
      id2: ['', Validators.required]
    });


    this.secondFormGroup = this._formBuilder.group({
      
    });
    this.optionFormGroup = this._formBuilder.group({
      bl: ['', Validators.required],
      facture: ['', Validators.required],
    });
    this.cloture = this._formBuilder.group({
      local: ['', Validators.required],
      reclamation: ['.', Validators.required]
    });
  }

  //  set type de bon facture ou bl 
   choix:any
  setchoix(choix:any){
    if ( choix=="1"){ this.choix = "1"}
    if ( choix=="2"){this.choix = "2"}
     
  }

 // lister les facture pour un client 
  lister_facture()
  {
   
    if ( this.choix == "2" ){
    this.service.get_facture_client(this.info.client).subscribe((data) =>{ 
      this.Liste_Factures=data 
    })
    }else if ( this.choix == "1" ){
      this.service.get_bl_client(this.info.client).subscribe((data) =>{ 
        this.Liste_Factures=data 
      })
    }
  }

  test:any;
  // check local source et destination  
  get_Factures()
  {  
    this.lister_facture()
    
  }
  // set slocal source
  setfacture()
  {
      this.facture=this.info.facture   
  }
  // etape 2 
  suivant2()
  {
    if(this.test==1){ this.myStepper.next();}
  }
   
  // Ajouter article au liste a traver le choix
  Ajouter_Article_avec_choix() {
    this.service.Article_Id(this.selectform.id2).subscribe((data) => {
      this.ajouter_article_table(data)
    })
    this.selectform.id2 = ""
  }
  // Ajouter article au liste a traver le code a barre 
  Ajouter_Article_avec_code() {
    this.service.Arrticle_CodeBare(this.selectform.code).subscribe((data) => {

      this.ajouter_article_table(data)
    })
    this.selectform.code = ""
  }
  // Ajouter article au liste a traver le id
  Ajouter_Article_avec_id() {
    this.service.Article_Id(this.selectform.id).subscribe((data) => {

      this.ajouter_article_table(data)
    })
    this.selectform.id = ""
  }



  // ajouter ligne au table
  ajouter_article_table(art: any) {

    console.log(art.id_Produit)
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
      this.object.type = "simple"
      this.object.detail = []
      if (art.n_Imei == 'true') {
        this.object.type = "4g"


      } else if (art.n_Serie == 'true') {
        this.object.type = "serie"

      }

      console.log(this.object)
      this.table.push(this.object)
    }
  }
  //modifier ligne de table
  Modifier_ligne_table(id: any) {
    console.log(id)
    this.object = {}
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i].id == id) {

        const dialogRef = this.dialog.open(ligne_retour, {
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
      const dialogRef = this.dialog.open(Detail4g_retour, {

        width: 'auto',
        data: { object: produit }
      });
      dialogRef.afterClosed().subscribe(result => {
      });
    } else if (produit.type == "serie") {

      const dialogRef = this.dialog.open(detail_serie_retour, {

        width: 'auto',
        data: { object: produit }
      });
      dialogRef.afterClosed().subscribe(result => {
      });

    }



  }

  valide()
  {
     this.creer_Bon_transfert();
  }

  doc:any ;
  bonsortie:any;
  // creer bon sortie 
  creer_Bon_transfert()
  {
    this.doc = document.implementation.createDocument("Bon_Transfert", "", null);

    var BR = this.doc.createElement("Bon_Transfert");
 
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

        
    
        formData.append('Responsable', "User transfert ");
        //formData.append('Local_Destination', this.destination);
        formData.append('Local_Source',this.source );   
        formData.append('Description', this.cloture.reclamation);

        formData.append('Detail', myFile);
        this.service.creer_Bon_Transfert(formData).subscribe(data => {
           
          this.bonsortie = data
          Swal.fire({
            title: 'Bon Transfert!',
            text: 'Bon Transfert est crée et envoyée.',
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: 'green',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Imprimer',
            cancelButtonText: 'Quitter'
          }).then((result) => {

            if (result.isConfirmed) {

              // this.generatePDF(this.bonsortie.id, this.bonsortie.date_Creation)

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
          relativePosition: {x:440, y:197}	       
        },
      {
        text: ' ' + this.cloture.local ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:80, y:107}	  , 
         
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
        relativePosition: {x:85, y:131}	       
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




//modifier table dialogue
@Component({
  selector: 'ligne_table',
  templateUrl: 'ligne_table.html',
})
export class ligne_retour {
  obj: any;
  constructor(public dialogRef: MatDialogRef<ligne_retour>, @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder) {
    this.obj = data.object
  }
  modifier(ev: any) {
    this.obj.qte = ev.target.value
  }
  //fermer dialogue
  close() {
    this.dialogRef.close();
  }
}



//Detail serie 
@Component({
  selector: 'detail4g',
  templateUrl: 'detail4g.html',
})
export class Detail4g_retour {
  obj: any;
  inst: any = {}
  numero_Serie:any;
  constructor(public dialogRef: MatDialogRef<Detail4g_retour>, @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder ,private service:StockageService) {
    this.obj = data.object
    while (this.obj.detail.length < this.obj.qte) {
      this.inst = {}
      this.inst.ns = ""
      this.inst.e1 = ""
      this.inst.e2 = ""
      this.obj.detail.push(this.inst)
    }
   
  this.select_nserie();
  }

select_nserie()
{
  this.service.Detail_Produit_4g(this.obj.id).subscribe((data2)=>
  {
     this.numero_Serie=data2;   
     
  })    
}

   d:any;
  save(ns: any, obj: any ,id:any,i :any) {
    obj.ns=ns    
    this.service.Detail_Produit_N_serie(ns,id).subscribe((data3)=>
    {
      this.d=data3;
      console.log(data3)
      console.log(this.d)
      console.log(this.d.e1+"  "+this.d.e2)
      obj.e1=this.d.e1
      obj.e2=this.d.e2
    })
    
    
    this.numero_Serie.splice(i,1);       
  }

  
  //fermer dialogue
  close() {
    this.dialogRef.close();
  }
}


//Detail 4g 
@Component({
  selector: 'detail_serie',
  templateUrl: 'detail_serie.html',
})
export class detail_serie_retour {
  obj: any;
  inst: any = {}
  
  numero_Serie:any;
  @ViewChild('input') input:any=ElementRef; 
  constructor(public dialogRef: MatDialogRef<detail_serie_retour>, @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder , private service:StockageService) {
    this.obj = data.object
    while (this.obj.detail.length < this.obj.qte) {
      this.inst = {}
      this.inst.ns = ""
      this.obj.detail.push(this.inst)
    }
    
    this.select_nserie();
  }

  select_nserie()
  {
    this.service.numero_Serie_Produit(this.obj.id).subscribe((data2)=>
    {
       this.numero_Serie=data2;   
       
    })    
  }
  
  save(ns: any, obj: any ,i :any) {
    obj.ns=ns    
     
  }
  //fermer dialogue
  close() {
    this.dialogRef.close();
  }
}