
import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
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
  dateRangeForm: any = FormGroup;

  optionFormGroup: any = FormGroup;
  info: any = FormGroup;
  selectform: any = FormGroup;
  secondFormGroup: any = FormGroup;
  cloture: any = FormGroup;
  code: string = '';
  liste_articles: any;
  table: any = [];
  object: any = {};
  locals: any;
  source: any
  facture: any;
  Clients: any;
  Liste_bls: any;
  @ViewChild('stepper') private myStepper: any = MatStepper;
  constructor(private datePipe: DatePipe, private http: HttpClient, private _formBuilder: FormBuilder, public service: StockageService, public dialog: MatDialog, private router: Router) {

    // this.service.liste_articles().subscribe((data: any) => {
    //   this.liste_articles = data;
    // });
    this.service.locals().subscribe((data: any) => {
      this.locals = data
    })
    this.service.Clients().subscribe((data: any) => {
      this.Clients = data
    })
    this.chargementModel();
    this.modelePdfBase64();
  }


  modele: any;
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
    this.http.get('./../../../assets/images/ficheRetour.jpg', { responseType: 'blob' }).subscribe((reponse: any) => {
      this.modele = reponse;
      return this.modele;
    }, err => console.error(err))
  }

  range = new FormGroup({
    fromDate: new FormControl('', Validators.required),
    toDate: new FormControl('', Validators.required)
  });

  ngOnInit() {
    let myDate = new Date(); let myDate2 = new Date();
    myDate2.setMonth(myDate2.getMonth() - 1);
    this.dateRangeForm = this._formBuilder.group({
      fromDate: new FormControl(myDate2, Validators.required),
      toDate: new FormControl(myDate, Validators.required)
    });

    this.info = this._formBuilder.group({
      client: ['', Validators.required],

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


  // lister les facture pour un client 
  lister_facture() {
    console.log(this.datePipe.transform(this.dateRangeForm.get('fromDate').value, 'dd/MM/yyyy'));
    this.Liste_bls = [];
    this.service.get_bl_client(this.info.client, this.datePipe.transform(this.dateRangeForm.get('fromDate').value, 'dd/MM/yyyy'), this.datePipe.transform(this.dateRangeForm.get('toDate').value, 'dd/MM/yyyy')).subscribe((data) => {
      this.Liste_bls = data
    })

  }

  test: any;
  // check local source et destination  
  get_Factures() {
    this.lister_facture()

  }

  // etape 2 
  suivant2() {
    this.table = [];
    this.get_detail_bl(this.info.facture);
    this.myStepper.next();
  }


  //get detail bl 
  detail: any;
  bl: any
  xmldata: any;
  newAttribute: any = {}
  inst: any = {}
  get_detail_bl(id: any) {
    this.service.Detail_detail_bl(id).subscribe((detail: any) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        this.bl = reader.result;
        var parseString = require('xml2js').parseString;
        let data1;
        parseString(atob(this.bl.substr(28)), function (err: any, result: any) {
          data1 = result.Bon_Livraison;

        })
        this.xmldata = data1


        if (this.xmldata.Produits[0].Produits_Simples[0].Produit != undefined) {
          for (let i = 0; i < this.xmldata.Produits[0].Produits_Simples[0].Produit.length; i++) {


            this.object = {}
            this.object.id = (this.xmldata.Produits[0].Produits_Simples[0].Produit[i].Id[0]);
            this.object.nom = (this.xmldata.Produits[0].Produits_Simples[0].Produit[i].Nom[0]);
            this.object.qte = (this.xmldata.Produits[0].Produits_Simples[0].Produit[i].Qte[0]);
            this.object.type = "simple"
            this.object.qte2 = 0;
            this.table.push(this.object)
          }
        }
        if (this.xmldata.Produits[0].Produits_4Gs[0].Produit != undefined) {
          for (let i = 0; i < this.xmldata.Produits[0].Produits_4Gs[0].Produit.length; i++) {


            this.object = {}
            this.object.id = (this.xmldata.Produits[0].Produits_4Gs[0].Produit[i].Id[0]);
            this.object.nom = (this.xmldata.Produits[0].Produits_4Gs[0].Produit[i].Nom[0]);
            this.object.qte = (this.xmldata.Produits[0].Produits_4Gs[0].Produit[i].Qte[0]);
            this.object.qte2 = 0;
            this.object.type = "4g"

            this.object.detail = []

            if (this.xmldata.Produits[0].Produits_4Gs[0].Produit[0].n_Imei != undefined) {
              for (let j = 0; j < this.xmldata.Produits[0].Produits_4Gs[0].Produit[0].Produit_4Gs[i].Produit_4G.length; j++) {

                this.inst = {}
                this.inst.ns = this.xmldata.Produits[0].Produits_4Gs[0].Produit[0].Produit_4Gs[0].Produit_4G[j].N_Serie;
                this.inst.e1 = this.xmldata.Produits[0].Produits_4Gs[0].Produit[0].Produit_4Gs[0].Produit_4G[j].E1
                this.inst.e2 = this.xmldata.Produits[0].Produits_4Gs[0].Produit[0].Produit_4Gs[0].Produit_4G[j].E2
                this.inst.click = false;
                this.object.detail.push(this.inst)
              }
            }
            this.table.push(this.object)
          }
        }
        if (this.xmldata.Produits[0].Produits_Series[0].Produit != undefined) {
          for (let i = 0; i < this.xmldata.Produits[0].Produits_Series[0].Produit.length; i++) {


            this.object = {}
            this.object.qte2 = 0;
            this.object.id = (this.xmldata.Produits[0].Produits_Series[0].Produit[i].Id[0]);
            this.object.nom = (this.xmldata.Produits[0].Produits_Series[0].Produit[i].Nom);
            this.object.qte = (this.xmldata.Produits[0].Produits_Series[0].Produit[i].Qte[0]);
            this.inst.click = false;
            this.object.type = "serie"
            this.object.detail = []

            for (let j = 0; j < this.xmldata.Produits[0].Produits_Series[0].Produit[i].N_Series[0].N_Serie.length; j++) {

              this.inst = {}
              this.inst.ns = this.xmldata.Produits[0].Produits_Series[0].Produit[0].N_Series[0].N_Serie[j]
               this.object.detail.push(this.inst)
            }
            this.table.push(this.object)
          }
        }




      }
      reader.readAsDataURL(detail);
    })
  }



  table2: any = [];
// etap 3 
  suivante3()
  {
       this.table2  = [];
      for( let i = 0 ; i<this.table.length;i++)
      {
       
        if(this.table[i].qte2>0)
        {
             this.table2.push(this.table[i])
        }
      }
  }


  // detail article 
  plus(produit: any) {

   
    if (produit.type == "simple") {
      const dialogRef = this.dialog.open(ligne_retour, {

        width: 'auto',
        data: { object: produit }
      });
      dialogRef.afterClosed().subscribe(result => {
      });
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

  valide() {
    this.creer_Bon_retour();
  }

  doc: any;
  bonsortie: any;
  // creer bon  retour
  creer_Bon_retour() {
    this.doc = document.implementation.createDocument("Bon_Retour", "", null);

    var BR = this.doc.createElement("Bon_Retour");

    var Local = this.doc.createElement("Local"); Local.innerHTML = this.cloture.local

    var InformationsGenerales = this.doc.createElement("Informations-Generales");

    var Responsable = this.doc.createElement("Responsable"); Responsable.innerHTML = "Responsable";
    InformationsGenerales.appendChild(Local);
    InformationsGenerales.appendChild(Responsable);
    var Produits_Listes = this.doc.createElement('Produits')

    var Produits_series = this.doc.createElement('Produits_Series')
    var Produits_simple = this.doc.createElement('Produits_Simples')
    var Produits_4g = this.doc.createElement('Produits_4gs')
    for (let i = 0; i < this.table2.length; i++) {

      var Produit = this.doc.createElement('Produit')
      var id = this.doc.createElement('Id'); id.innerHTML = this.table2[i].id
      var Nom = this.doc.createElement('Nom'); Nom.innerHTML = this.table2[i].nom
      var Qte = this.doc.createElement('Qte'); Qte.innerHTML = this.table2[i].qte2
      Produit.appendChild(id);
      Produit.appendChild(Nom);
      Produit.appendChild(Qte);


      if (this.table2[i].type == 'simple') {
        Produits_simple.appendChild(Produit);
      }
      else if (this.table2[i].type == 'serie') {
        var n_series = this.doc.createElement('N_Series'); Qte.innerHTML = this.table2[i].qte
        for (let j = 0; j < this.table[i].detail.length; j++) {
          var ns = this.doc.createElement('N_Serie'); ns.innerHTML = this.table2[i].detail[j].ns

          n_series.appendChild(ns);
        }
       
        Produit.appendChild(n_series);
        Produits_series.appendChild(Produit)

      }
      else if (this.table2[i].type == '4g') {
        var p4gs = this.doc.createElement('Produit_4gs'); Qte.innerHTML = this.table[i].qte2
        for (let j = 0; j < this.table2[i].detail.length; j++) {
          var p4g = this.doc.createElement('Produit_4g'); Qte.innerHTML = this.table2[i].qte2
          var ns = this.doc.createElement('N_Serie'); ns.innerHTML = this.table2[i].detail[j].ns
          var e1 = this.doc.createElement('E1'); e1.innerHTML = this.table2[i].detail[j].e1
          var e2 = this.doc.createElement('E2'); e2.innerHTML = this.table2[i].detail[j].e2
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
     

    var formData: any = new FormData();
    let url = "assets/BonRejet.xml";
    fetch(url)
      .then(response => response.text())
      .then(data => {
        let xml2string = new XMLSerializer().serializeToString(this.doc.documentElement);
        var myBlob = new Blob([xml2string], { type: 'application/xml' });
        var myFile = this.convertBlobFichier(myBlob, "assets/BonRejet.xml");



        formData.append('Id_Responsable', "User retour ");
        //formData.append('Local_Destination', this.destination);
        formData.append('Local', this.cloture.local);
        formData.append('Description', this.cloture.reclamation);
        formData.append('Id_Clt', this.info.client);
        formData.append('N_Facture', this.info.facture);

        formData.append('Detail', myFile);
        this.service.creer_Bon_Retour(formData).subscribe(data => {

          this.bonsortie = data
          Swal.fire({
            title: 'Bon Retour!',
            text: 'Bon Retour est crée et envoyée.',
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: 'green',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Imprimer',
            cancelButtonText: 'Quitter'
          }).then((result) => {

            if (result.isConfirmed) {

              this.generatePDF(this.bonsortie.id_Bon_Retour, this.bonsortie.date_Creation)

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

  ch: any
  modeleSrc: any;
  //impression de la fiche recption
  generatePDF(id: any, date_Creation: any) {

    var body = [];
     

    for (let i = 0; i < this.table2.length; i++) {

      if (this.table2[i].type == 'simple') {

        var obj = new Array();
        obj.push(this.table2[i].id);
        obj.push(this.table2[i].nom);
        obj.push(this.table2[i].qte2);
        this.ch = "";
        obj.push(this.ch)

        body.push(obj);
      }
      if (this.table2[i].type == 'serie') {
        var obj = new Array();
        obj.push(this.table2[i].id);
        obj.push(this.table2[i].nom);
        obj.push(this.table2[i].qte2);
        this.ch = ""
   
        for (let j = 0; j < this.table2[i].detail.length; j++) {
         if (this.table2[i].detail[j].click != undefined) {
          if ( this.table2[i].detail[j].click+"" == "true"  ) {
            this.ch = this.ch + "N_Série : " + this.table2[i].detail[j].ns + "\n"
            this.ch = this.ch + " ----------------------  \n"
          }
        }
        }

        obj.push(this.ch)
        body.push(obj);
      }
      else if (this.table2[i].type == '4g') {
        var obj = new Array();
        obj.push(this.table2[i].id);
        obj.push(this.table2[i].nom);
        obj.push(this.table2[i].qte);
        this.ch = ""
        for (let j = 0; j < this.table2[i].detail.length; j++) {
          if (this.table2[i].detail[j].click != undefined) {
            if ( this.table2[i].detail[j].click+"" == "true"  ) {
          
            this.ch = this.ch + "N_Série : " + this.table2[i].detail[j].ns + "\n"
            this.ch = this.ch + "E1 : " + this.table2[i].detail[j].e1 + "\n"
            this.ch = this.ch + "E2 : " + this.table2[i].detail[j].e2 + "\n"
            this.ch = this.ch + " ----------------------  \n"
          }}

        }
        obj.push(this.ch)
        body.push(obj);

      }

    }

    var def = {


      defaultStyle: {
        // alignment: 'justify'
      },
      pageMargins: [40, 250, 40, 180],
      info: {
        title: 'Fiche Bon retour',
      },
      footer: function (currentPage: any, pageCount: any) {
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
              relativePosition: { x: 250, y: 130 }
            }
          ]
        };
      },
      header: [
        {
          text: '' + id + '\n\n',
          fontSize: 15,
          color: 'black',
          bold: true,
          relativePosition: { x: 370, y: 182 }
        },
        {
          text: ' ' + this.cloture.local,
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 80, y: 107 },

        },
        {
          text: ' ' + this.info.client,
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 80, y: 179 },

        },
        {
          text: ' ' + this.info.facture,
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 210, y: 179 },

        },

        {
          text: 'rochdi',
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 390, y: 96 },

        },
        {
          text: '' + this.datePipe.transform(date_Creation, 'dd/MM/yyyy'),
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 520, y: 96 },

        },
        {
          text: ' ' + this.cloture.reclamation,
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 80, y: 665 }
        },
        {
          text: 'rochdi',
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 90, y: 131 }
        },
        {
          text: '' + this.datePipe.transform(date_Creation, 'dd/MM/yyyy'),
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 65, y: 154 }
        },
      ],
      background: [
        {
          image: 'data:image/jpeg;base64,' + this.modeleSrc, width: 600
        }
      ],

      content: [

        {
          layout: 'lightHorizontalLines',
          table: {
            widths: [40, 270, 23, 180],
            body: body,
          },
          fontSize: 10,
          margin: [-30, 0, 10, 300]
        }


      ],

    };

    pdfMake.createPdf(def).open({ defaultFileName: 'Fiche_retour' + id + '.pdf' });

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
    if (ev.target.value > this.obj.qte) {

      Swal.fire({

        icon: 'warning',
        title: " Qte < = " + this.obj.qte

      }).then((res) => {

      }
      );
    } else {
      this.obj.qte2 = ev.target.value
    }
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
  numero_Serie: any;
  constructor(public dialogRef: MatDialogRef<Detail4g_retour>, @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder, private service: StockageService) {
    this.obj = data.object
  }


  update(obj: any) {
    obj.click = !(obj.click)
    if(obj.click==true){      
      this.obj.qte2 =  Number(Number(this.obj.qte2)+1)      
    }else{this.obj.qte2 = Number(this.obj.qte2)-1}
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

  numero_Serie: any;
  @ViewChild('input') input: any = ElementRef;
  constructor(public dialogRef: MatDialogRef<detail_serie_retour>, @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder, private service: StockageService) {
    this.obj = data.object



  }

  update(obj: any) {

    obj.click = !(obj.click);
    if(obj.click==true){      
      this.obj.qte2 =  Number(Number(this.obj.qte2)+1)      
    }else{this.obj.qte2 = Number(this.obj.qte2)-1}

  }
  //fermer dialogue
  close() {
    this.dialogRef.close();
  }
}