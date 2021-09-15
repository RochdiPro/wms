import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BonReceptionServiceService } from '../bon-reception-service.service';
import Swal from 'sweetalert2'
import { MatStepper } from '@angular/material/stepper';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Ajouter_Bon_Rejet } from '../ajouter-bon-reception/ajouter-bon-reception.component';
import { Console } from 'console';
declare var require: any

const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-modifier-bon-reception',
  templateUrl: './modifier-bon-reception.component.html',
  styleUrls: ['./modifier-bon-reception.component.scss']
})
export class ModifierBonReceptionComponent implements OnInit {
  @ViewChild('stepper') private myStepper: any = MatStepper;

  SupportFormGroup: any = FormGroup;
  ArticleFormGroup: any = FormGroup;
  controleFormGroup: any = FormGroup;

  isLinear = false;
  selected = 'id';
  disableSelect = new FormControl(false);
  bonEntrees_Local: any = []
  bonEntrees_impo: any = []
  bonretour: any = []
  bontransfert: any = []
  type_bon: any;
  id: any;
  nbSupport: any;
  listeArticleBon: any;
  Source: any;
  Destination: any;
  modele: any;
  bonReception: any;
  constructor(private router: Router, private route: ActivatedRoute, public dialog: MatDialog, private _formBuilder: FormBuilder, private http: HttpClient, public service: BonReceptionServiceService) {
    this.service.Famille_Logistique().subscribe((data: any) => {
      this.Famille_Logistique = data;
    });
    this.chargementModel();
    this.modelePdfBase64();
    this.id = this.route.snapshot.params['id'];
    this.service.get_Bon_Reception_By_Id(this.id).subscribe(data => {
      this.bonReception = data;
      this.type_bon = this.bonReception.type_Be;
      this.Destination = this.bonReception.local
      this.nbSupport=this.bonReception.nb_Support       


    }, error => console.log(error));
    this.getDetail();


  }
  ngOnInit() {



    this.SupportFormGroup = this._formBuilder.group({
      typeSupport: new FormControl({ value: 'Pallette', disabled: true }, Validators.required),
      poids: new FormControl({ value: '1', disabled: true }, Validators.required),
      hauteur: new FormControl({ value: '1', disabled: true }, Validators.required),
      largeur: new FormControl({ value: '1', disabled: true }, Validators.required),
      longeur: new FormControl({ value: '1', disabled: true }, Validators.required),
      qte: new FormControl({ value: '1', disabled: true }, Validators.required),
    });
    this.ArticleFormGroup = this._formBuilder.group({
      famille_Logistique: new FormControl({ value: '', disabled: true }, Validators.required),
      sousFamille: new FormControl({ value: '', disabled: true }, Validators.required),
      qteth: new FormControl({ value: '', disabled: true }, Validators.required),
      support: new FormControl({ value: '', disabled: true }, Validators.required),
      totale: new FormControl({ value: '', disabled: true }, Validators.required),
    });
  }


  xmldata: any;
  obj_articles: any = [];
  supports: any = [];
  new_obj: any = {}
  sup:any ={}
  // Get Detail bon reception 
  getDetail() {
    this.service.Detail_Bon_Reception(this.id).subscribe((detail: any) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        this.bonReception = reader.result;
        var parseString = require('xml2js').parseString;
        let data1;
        parseString(atob(this.bonReception.substr(28)), function (err: any, result: any) {
          data1 = result.Bon_Reception;

        })


        this.xmldata = data1
        for (let k = 0; k < this.xmldata.Liste_Supports[0].Support.length; k++) {
          this.arraySupport.push(this.ajouterligneSupport());
          this.arraySupport[k].Numero = this.xmldata.Liste_Supports[0].Support[k].Numero;
          this.arraySupport[k].typeSupport = this.xmldata.Liste_Supports[0].Support[k].typeSupport;
          this.arraySupport[k].poids = this.xmldata.Liste_Supports[0].Support[k].poids;
          this.arraySupport[k].hauteur = this.xmldata.Liste_Supports[0].Support[k].hauteur;
          this.arraySupport[k].largeur = this.xmldata.Liste_Supports[0].Support[k].largeur;
          this.arraySupport[k].longeur = this.xmldata.Liste_Supports[0].Support[k].longeur;
        }
        
        
        for (let i = 0; i < this.xmldata.Produits[0].Produit.length; i++) {    
 
          this.new_obj={}
          this.new_obj.id = this.xmldata.Produits[0].Produit[i].Id;
          this.new_obj.nom = this.xmldata.Produits[0].Produit[i].Nom;
          this.new_obj.fiche_Technique = this.xmldata.Produits[0].Produit[i].Fiche_Technique;

          this.new_obj.qte = this.xmldata.Produits[0].Produit[i].Qte;
          this.new_obj.famaille = this.xmldata.Produits[0].Produit[i].famaille;
          this.new_obj.sous_famaille = this.xmldata.Produits[0].Produit[i].sous_famaille;
          this.new_obj.total = this.xmldata.Produits[0].Produit[i].Total;
          this.support = []    
          for (let h = 0; h <= this.xmldata.Produits[0].Produit[i].Supports.length; h++) {
            this.sup = {}
            this.sup.id = h;
            this.sup.qte =  this.xmldata.Produits[0].Produit[0].Supports[0].Support[h].Qte;
            this.support.push(this.sup)
            
          } 
          this.new_obj.supports=this.support; 
          this.new_obj.controle_qt = this.xmldata.Produits[0].Produit[i].Qte_Verifier;
          this.new_obj.controle_tech = this.xmldata.Produits[0].Produit[i].Fiche_Technique_Verifier;
          this.obj_articles.push(this.new_obj)


        }
          console.log(this.obj_articles  )


      }
      reader.readAsDataURL(detail);
    })



  }
 



  /*
  ****************************************           fonctions relative a steep 1   ********************************************** 
  */
  //supports: any = [];
  arraySupport: any = [];
  newAttribute: any;
  listArticleBonEntree: any = [];
  //generer tableau de support
  genererTemplateSupport(nbSupport: any) {
    this.arraySupport = [];
    for (let i = 0; i < nbSupport; i++) {
      this.arraySupport.push(this.ajouterligneSupport());

    }

    this.SupportFormGroup = this._formBuilder.group({
      ClassDetails: this._formBuilder.array(this.arraySupport)
    });

    this.myStepper.next();
  }
  // Ajouter une ligne dans le tableau du support  
  ajouterligneSupport(): FormGroup {
    return this._formBuilder.group({
      typeSupport: new FormControl({ value: 'Pallette', disabled: false }, Validators.required),
      poids: new FormControl({ value: '1', disabled: false }, Validators.required),
      hauteur: new FormControl({ value: '1', disabled: false }, Validators.required),
      largeur: new FormControl({ value: '1', disabled: false }, Validators.required),
      longeur: new FormControl({ value: '1', disabled: false }, Validators.required),
    });
  }


  /*
  ****************************************           fonctions relative a steep 3  ********************************************** 
  */



  Supports: any = [];
  support: any = {};
  

  Sous_Famille_Logistique: any = [];
  Famille_Logistique: any = [];
  // get liste des famailles 
  Famille(event: any, id: any) {
    let ch = event.value
    console.log(ch, id)
    for (let i = 0; i < this.obj_articles.length; i++) {
      if (this.obj_articles[i].id == id) {
        this.obj_articles[i].famaille = ch
      }
    }
  }
  // get sous famaille 
  getSousFamille(id: any) {

    for (let i = 0; i < this.obj_articles.length; i++) {
      if (this.obj_articles[i].id == id) {
        this.service.sousFamille(this.obj_articles[i].famaille).subscribe((data: any) => {
          this.Sous_Famille_Logistique = data;
        });
      }
    }
  }
  // get sous famaille d'une famille selectioner 
  SousFamille(event: any, id: any) {
    let ch = event.value
    for (let i = 0; i < this.obj_articles.length; i++) {
      if (this.obj_articles[i].id == id) {
        this.obj_articles[i].sous_famaille = event.value
      }
    }
  }

  //calcule Totale Support
  getTotale(ev: any, i: any, id: any) {

    for (let j = 0; j < this.obj_articles.length; j++) {
      if (id == this.obj_articles[j].id) {
        let sm = 0;

        for (let k = 0; k < this.obj_articles[j].supports.length; k++) {
          if (this.obj_articles[j].supports[k].id == i) {
            this.obj_articles[j].supports[k].qte = ev.target.value
          }
          sm = Number(sm) + Number(this.obj_articles[j].supports[k].qte)
        }
        this.obj_articles[j].total = sm;
        if (this.obj_articles[j].total == this.obj_articles[j].qte) { this.obj_articles[j].controle_qt = true } else { this.obj_articles[j].controle_qt = false }
      }
    }
    console.log(this.obj_articles)

  }

  /*
  ****************************************           fonctions relative a steep 4  ********************************************** 
  */

  sysDate = new Date();
  // verifier le qualite d'article
  checkQualite(id: any) {
    for (let i = 0; i < this.obj_articles.length; i++) {
      if (this.obj_articles[i].id == id) {

        if (this.obj_articles[i].controle_tech == false) {
          this.obj_articles[i].controle_tech = true
        }
        else { this.obj_articles[i].controle_tech = false }

      }
    }
  }
  // function verife les controle Quaite QTe si verifier alors on peur imrimer enregistrer sinon le conserver  
  VerifierEetatbon: any = false;
  Verifier_etat_bon() {
    this.VerifierEetatbon = true;
    for (let i = 0; i < this.obj_articles.length; i++) {

      if (this.obj_articles[i].controle_tech == false) { this.VerifierEetatbon = false; }
      if (this.obj_articles[i].controle_qt == false) { this.VerifierEetatbon = false; }
    }
  }

  /*
   ****************************************           fonctions relative a steep 5  ********************************************** 
   */


  Valider: any = true;
  doc: any
  bon_reception: any
  // creer le bon reception si etat verifier 
  Modifier_Bon_Reception() {
    this.doc = document.implementation.createDocument("Bon_Reception", "", null);
    var BR = this.doc.createElement("Bon_Reception");
    var Etat = this.doc.createElement("Etat"); Etat.innerHTML = "Validé"
    var source = this.doc.createElement("Source"); source.innerHTML = this.Source
    var distination = this.doc.createElement("Destination"); distination.innerHTML = this.Destination
    var InformationsGenerales = this.doc.createElement("Informations-Generales");
    var Date = this.doc.createElement("Date"); Date.innerHTML = this.sysDate.toDateString()
    var Id_Bon = this.doc.createElement("Id_Bon"); Id_Bon.innerHTML = this.id
    var Type_Bon = this.doc.createElement("Type_Bon"); Type_Bon.innerHTML = this.type_bon
    var Responsable = this.doc.createElement("Responsable"); Responsable.innerHTML = "Responsable";
    InformationsGenerales.appendChild(source);
    InformationsGenerales.appendChild(distination);
    InformationsGenerales.appendChild(Date);
    InformationsGenerales.appendChild(Id_Bon);
    InformationsGenerales.appendChild(Type_Bon);
    InformationsGenerales.appendChild(Responsable);

    var Produits_Listes = this.doc.createElement('Produits')

    for (let i = 0; i < this.obj_articles.length; i++) {

      var Produit = this.doc.createElement('Produit')
      var id = this.doc.createElement('Id'); id.innerHTML = this.obj_articles[i].id
      var Nom = this.doc.createElement('Nom'); Nom.innerHTML = this.obj_articles[i].nom
      var Qte = this.doc.createElement('Qte'); Qte.innerHTML = this.obj_articles[i].qte
      var FicheTechnique = this.doc.createElement('Fiche_Technique'); FicheTechnique.innerHTML = this.obj_articles[i].fiche_Technique
      var verif_qte = this.doc.createElement('Qte_Verifier'); verif_qte.innerHTML = this.obj_articles[i].controle_qt
      var verif_fiche = this.doc.createElement('Fiche_Technique_Verifier'); verif_fiche.innerHTML = this.obj_articles[i].controle_tech
      var total = this.doc.createElement('Total'); total.innerHTML = this.obj_articles[i].total

      var Supports = this.doc.createElement('Supports')
      for (let j = 0; j < this.obj_articles[i].supports.length; j++) {
        if (this.obj_articles[i].supports[j].qte > 0) {
          var Support = this.doc.createElement('Support');
          var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = j;
          var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].qte;
          Support.appendChild(n_s); Support.appendChild(qte_s); Supports.appendChild(Support);
        }
      }


      Produit.appendChild(id);
      Produit.appendChild(Nom);
      Produit.appendChild(Qte);
      Produit.appendChild(FicheTechnique);
      Produit.appendChild(verif_qte);
      Produit.appendChild(verif_fiche);
      Produit.appendChild(total);
      Produit.appendChild(Supports);
      Produits_Listes.appendChild(Produit)
    }
    var Supports_Listes = this.doc.createElement('Liste_Supports')
    for (let i = 0; i < this.arraySupport.length; i++) {
      var Support = this.doc.createElement('Support')
      var Numero = this.doc.createElement('Numero'); Numero.innerHTML = i + 1;
      var typeSupport = this.doc.createElement('typeSupport'); typeSupport.innerHTML = this.arraySupport[i].value.typeSupport;
      var poids = this.doc.createElement('poids'); poids.innerHTML = this.arraySupport[i].value.poids;
      var hauteur = this.doc.createElement('hauteur'); hauteur.innerHTML = this.arraySupport[i].value.hauteur;
      var largeur = this.doc.createElement('largeur'); largeur.innerHTML = this.arraySupport[i].value.largeur;
      var longeur = this.doc.createElement('longeur'); longeur.innerHTML = this.arraySupport[i].value.longeur;
      Support.appendChild(Numero);
      Support.appendChild(typeSupport);
      Support.appendChild(poids);
      Support.appendChild(hauteur);
      Support.appendChild(largeur);
      Support.appendChild(longeur);
      Supports_Listes.appendChild(Support);
    }
    BR.appendChild(Etat);
    BR.appendChild(InformationsGenerales);
    BR.appendChild(Produits_Listes);
    BR.appendChild(Supports_Listes);
    this.doc.appendChild(BR)
    console.log(this.doc)

    var formData: any = new FormData();
    let url = "assets/BonRecpetion.xml";


    fetch(url)
      .then(response => response.text())
      .then(data => {
        let xml2string = new XMLSerializer().serializeToString(this.doc.documentElement);
        var myBlob = new Blob([xml2string], { type: 'application/xml' });
        var myFile = this.convertBlobFichier(myBlob, "assets/BonRecpetion.xml");
        console.log("id bon :", this.id)
        formData.append('Id', this.id);
        formData.append('Id_Be', this.id);
        formData.append('Etat', "Traiter");
        formData.append('Responsable', "rochdi");
        formData.append('date', this.sysDate);
        formData.append('Local', this.Destination);
        formData.append('Type_Be', this.type_bon);
        formData.append('Detail', myFile);
        formData.append('Nb_Support', this.nbSupport);

        this.service.Modifier_BonReception( formData).subscribe((data) => {
          this.bon_reception = data
          Swal.fire(
            'Modification',
            'Bon De Reception Modifier Avec Sucées',
            'success'
          ).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: 'Voulez vous imprimer ce Bon de Réception',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Oui',
                cancelButtonText: 'Non',
              }).then((result) => {
                if (result.isConfirmed) {

                  this.generatePDF(this.bon_reception.id, this.bon_reception.date_Creation);
                  this.router.navigate(['Menu/WMS-Reception/Lister']);
                } else if (result.isDismissed) {
                  console.log('erreur  ');
                }
              });
            }
          });
        }, (err) => {



        });
      });




  }
  //convertir blob à un fichier  
  convertBlobFichier = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }

  // conserver le bon si le etat non verifier 
  Conserver() {
    this.doc = document.implementation.createDocument("Bon_Reception", "", null);
    var BR = this.doc.createElement("Bon_Reception");
    var Etat = this.doc.createElement("Etat"); Etat.innerHTML = "En Attente"
    var source = this.doc.createElement("Source"); source.innerHTML = this.Source
    var distination = this.doc.createElement("Destination"); distination.innerHTML = this.Destination
    var InformationsGenerales = this.doc.createElement("Informations-Generales");
    var Date = this.doc.createElement("Date"); Date.innerHTML = this.sysDate.toDateString()
    var Id_Bon = this.doc.createElement("Id_Bon"); Id_Bon.innerHTML = this.id
    var Type_Bon = this.doc.createElement("Type_Bon"); Type_Bon.innerHTML = this.type_bon
    var Responsable = this.doc.createElement("Responsable"); Responsable.innerHTML = "Responsable";
    InformationsGenerales.appendChild(source);
    InformationsGenerales.appendChild(distination);
    InformationsGenerales.appendChild(Date);
    InformationsGenerales.appendChild(Id_Bon);
    InformationsGenerales.appendChild(Type_Bon);
    InformationsGenerales.appendChild(Responsable);

    var Produits_Listes = this.doc.createElement('Produits')

    for (let i = 0; i < this.obj_articles.length; i++) {

      var Produit = this.doc.createElement('Produit')
      var id = this.doc.createElement('Id'); id.innerHTML = this.obj_articles[i].id
      var Nom = this.doc.createElement('Nom'); Nom.innerHTML = this.obj_articles[i].nom
      var Qte = this.doc.createElement('Qte'); Qte.innerHTML = this.obj_articles[i].qte
      var FicheTechnique = this.doc.createElement('Fiche_Technique'); FicheTechnique.innerHTML = this.obj_articles[i].fiche_Technique
      var verif_qte = this.doc.createElement('Qte_Verifier'); verif_qte.innerHTML = this.obj_articles[i].controle_qt
      var verif_fiche = this.doc.createElement('Fiche_Technique_Verifier'); verif_fiche.innerHTML = this.obj_articles[i].controle_tech
      var total = this.doc.createElement('Total'); total.innerHTML = this.obj_articles[i].total

      var Supports = this.doc.createElement('Supports')
      for (let j = 0; j < this.obj_articles[i].supports.length; j++) {
        if (this.obj_articles[i].supports[j].qte > 0) {
          var Support = this.doc.createElement('Support');
          var n_s = this.doc.createElement('Numero_Support'); n_s.innerHTML = j;
          var qte_s = this.doc.createElement('Qte'); qte_s.innerHTML = this.obj_articles[i].qte;
          Support.appendChild(n_s); Support.appendChild(qte_s); Supports.appendChild(Support);
        }
      }

      Produit.appendChild(id);
      Produit.appendChild(Nom);
      Produit.appendChild(Qte);
      Produit.appendChild(FicheTechnique);
      Produit.appendChild(verif_qte);
      Produit.appendChild(verif_fiche);
      Produit.appendChild(total);
      Produit.appendChild(Supports);
      Produits_Listes.appendChild(Produit)
    }
    var Supports_Listes = this.doc.createElement('Liste_Supports')
    for (let i = 0; i < this.arraySupport.length; i++) {
      var Support = this.doc.createElement('Support')
      var Numero = this.doc.createElement('Numero'); Numero.innerHTML = i + 1;
      var typeSupport = this.doc.createElement('typeSupport'); typeSupport.innerHTML = this.arraySupport[i].value.typeSupport;
      var poids = this.doc.createElement('poids'); poids.innerHTML = this.arraySupport[i].value.poids;
      var hauteur = this.doc.createElement('hauteur'); hauteur.innerHTML = this.arraySupport[i].value.hauteur;
      var largeur = this.doc.createElement('largeur'); largeur.innerHTML = this.arraySupport[i].value.largeur;
      var longeur = this.doc.createElement('longeur'); longeur.innerHTML = this.arraySupport[i].value.longeur;
      Support.appendChild(Numero);
      Support.appendChild(typeSupport);
      Support.appendChild(poids);
      Support.appendChild(hauteur);
      Support.appendChild(largeur);
      Support.appendChild(longeur);
      Supports_Listes.appendChild(Support);
    }


    BR.appendChild(Etat);
    BR.appendChild(InformationsGenerales);
    BR.appendChild(Produits_Listes);
    BR.appendChild(Supports_Listes);

    this.doc.appendChild(BR)
    console.log(this.doc)

    var formData: any = new FormData();
    let url = "assets/BonRecpetion.xml";


    fetch(url)
      .then(response => response.text())
      .then(data => {
        let xml2string = new XMLSerializer().serializeToString(this.doc.documentElement);
        var myBlob = new Blob([xml2string], { type: 'application/xml' });
        var myFile = this.convertBlobFichier(myBlob, "assets/BonRecpetion.xml");
        console.log("id bon :", this.id)
        formData.append('Id', this.id);
        formData.append('Id_Be', this.id);
        formData.append('Etat', "Conserver");
        formData.append('Responsable', "rochdi");
        formData.append('date', this.sysDate);
        formData.append('Local', this.Destination);
        formData.append('Type_Be', this.type_bon);
        formData.append('Detail', myFile);
        formData.append('Nb_Support', this.nbSupport);
        this.service.createBonReception(formData).subscribe(data => {
          console.log("data: ", data);
          //this.bonReception = data

          Swal.fire(
            'Ajout Effecté',
            'Bon De Reception Ajouté Avec Sucées',
            'success'
          )

        },
          error => console.log(error));
      });


  }


  modeleSrc: any;
  //impression de la fiche recption
  generatePDF(id: any, date_Creation: any) {

    var body = [];
    var title = new Array('Id Article', 'Article', 'Fiche_Technique', 'Vérification', 'Quantite', 'vérification');
    body.push(title);
    var tabArt: any = [];
    for (let i = 0; i < this.obj_articles.length; i++) {
      var obj = new Array();
      obj.push(this.obj_articles[i].id);
      obj.push(this.obj_articles[i].nom);
      obj.push(this.obj_articles[i].fiche_Technique);
      if (this.obj_articles[i].fiche_Technique = 'true') { obj.push("oui"); } else { obj.push("non"); }
      obj.push(this.obj_articles[i].qte);
      if (this.obj_articles[i].controle_qt = 'true') { obj.push("oui"); } else { obj.push("non"); }
      body.push(obj);
    }

    var body2 = [];
    var title = new Array('Id Support', 'Type', 'Poids', 'Hauteur', 'Largeur', 'Longeur');
    body2.push(title);
    var tabArt: any = [];
    for (let i = 0; i < this.arraySupport.length; i++) {
      var obj = new Array();
      obj.push(i + 1);
      obj.push(this.arraySupport[i].value.typeSupport);
      obj.push(this.arraySupport[i].value.poids);
      obj.push(this.arraySupport[i].value.hauteur);
      obj.push(this.arraySupport[i].value.largeur);
      obj.push(this.arraySupport[i].value.longeur);

      body2.push(obj);
    }

    var def = {
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
      defaultStyle: {
        // alignment: 'justify'
      },
      pageMargins: [40, 120, 40, 60],


      info: {
        title: 'Fiche Bon Réception',

      },
      background: [
        {
          image: 'data:image/jpeg;base64,' + this.modeleSrc, width: 600
        }
      ],

      content: [
        {
          text: 'Bon Reception N° ' + id + '\n\n',
          fontSize: 15,

          alignment: 'center',

          color: 'black',
          bold: true
        },

        {
          columns: [

            {
              text:
                'Type Bon :' + '\t' + this.type_bon
                + '\n\n' +
                'Id Bon  :' + '\t' + this.id
                + '\n\n' +
                'Local  :' + '\t' + this.Destination

              ,

              fontSize: 10,

              alignment: 'left',

              color: 'black'
            },
            {
              text:
                ' Utilisateur :' + '\t' + "rochdi"
                + '\n\n' + 'Date      :' + date_Creation + '\t'
              ,

              fontSize: 10,

              alignment: 'left',

              color: 'black'
            },


          ]
        },

        {
          text: '\n\n' + 'Liste des Articles ' + '\t\n',
          fontSize: 12,
          alignment: 'Center',
          color: 'black',
          bold: true
        },
        {
          table: {

            alignment: 'right',
            body: body
          }
        },
        {
          text: '\n\n' + 'Liste des Supports ' + '\t\n',
          fontSize: 12,
          alignment: 'Center',
          color: 'black',
          bold: true
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*', '*'],
            body: body2
          }
        },
      ],
    };

    pdfMake.createPdf(def).open({ defaultFileName: 'FicheRecpetion.pdf' });

  }

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
    this.http.get('./../../../assets/images/ficheRecpetion.jpg', { responseType: 'blob' }).subscribe((reponse: any) => {
      this.modele = reponse;
      return this.modele;
    }, err => console.error(err))
  }

  /***
   *    etape genertation bon rejet
   * 
   */
  Bon_rejet() {
    Swal.fire({
      title: 'Bon Rejet',
      text: "Marchandise Non Verifé",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Rejeter Marchandise',
      cancelButtonText: 'Ressayé'

    }).then((result) => {
      if (result.isConfirmed) {

        const dialogRef = this.dialog.open(Ajouter_Bon_Rejet, {

          width: 'auto',
          data: { objects: this.obj_articles, id_Bon: this.id, local: this.Destination, type: this.type_bon }
        });
        dialogRef.afterClosed().subscribe(result => {
        });

      }

    })

  }




}

