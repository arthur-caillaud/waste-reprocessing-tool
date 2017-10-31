define({ "api": [
  {
    "type": "GET",
    "url": "/architecture/",
    "title": "Donne architecture",
    "description": "<p>Récupère l'architecture globale de l'organisation de tous les sites possibles</p>",
    "group": "Dashboard",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Exemple",
        "content": "curl -i http://localhost:4000/api/dashboard/dashboard",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSONString",
            "optional": false,
            "field": "dashboard",
            "description": "<p>Architecture du site</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès:",
          "content": "{\n\"niveau\": 0,\n\"SEI\": {\n    \"niveau\": 1,\n    \"SEI REUNION\": {\n        \"niveau\": 2,\n        \"SEI REUNION CLIENTÈLE\": {\n            \"niveau\": 3,\n            \"AGENCE LE PORT\": {\n                \"niveau\": 4\n            },\n            \"CLIENTÈLE MOUFIA\": {\n                \"niveau\": 4\n            }\n        },\n        \"SEI REUNION PRODUCTION\": {\n            \"niveau\": 3,\n            \"GROUPE HYDRAULIQUE BOURBIER\": {\n                \"niveau\": 4\n            },\n            \"GROUPEMENT THERMIQUE CENTRALE DU PORT\": {\n                \"niveau\": 4\n            },\n            \"GROUPEMENT THERMIQUE TAC\": {\n                \"niveau\": 4\n            }\n        }\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ResourceNotFound",
            "description": "<p>Impossible de trouver le lieu spécifié</p>"
          }
        ]
      }
    },
    "filename": "backend/doc/dashboard.doc.js",
    "groupTitle": "Dashboard",
    "name": "GetArchitecture"
  },
  {
    "type": "GET",
    "url": "/dashboard/details/:level/:name",
    "title": "Donne détails pour dashboard",
    "description": "<p>Recherche les informations nécessaires pour construire la dashboard en fonction de l'endroit voulu. Ici les détails sont données (on donne les bordereaux concernés par chaque problème)</p>",
    "group": "Dashboard",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "queryArgs": [
          {
            "group": "queryArgs",
            "type": "number",
            "optional": false,
            "field": "level",
            "description": "<p>niveau voulu dans la hierarchie (allant de 0 : central à 4 : site)</p>"
          },
          {
            "group": "queryArgs",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>nom du lieu voulu dans sa hierarchie (facultatif dans le cas d'une hierarchie 1 (niveau central))</p>"
          }
        ],
        "queryParams": [
          {
            "group": "queryParams",
            "type": "number",
            "optional": false,
            "field": "beginDate",
            "description": "<p>première date</p>"
          },
          {
            "group": "queryParams",
            "type": "number",
            "optional": false,
            "field": "endDate",
            "description": "<p>dernière date</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple",
        "content": "curl -i http://localhost:4000/api/dashboard/details/2/SEI REUNION?beginDate=2017-01-01&endDate=2017-12-31",
        "type": "curl"
      },
      {
        "title": "Exemple global",
        "content": "curl -i http://localhost:4000/api/dashboard/details/0?beginDate=2017-01-01&endDate=2017-02-01",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSONString",
            "optional": false,
            "field": "dashboard",
            "description": "<p>Informations nécessaires à la construction de la dashboard sur le site voulu</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès :",
          "content": "{\n    \"ecarts_pesee\": [],\n    \"incoherences_filieres_norm\": [],\n    \"incoherences_filieres_dd\": [],\n    \"filieres_interdites_norm\": [],\n    \"filieres_interdites_dd\": [],\n    \"retards_norm\": [\n        {\n            \"bordereau\": {\n                \"id\": 11419,\n                \"num_bordereau\": \"4815162342\",\n                \"cas\": null,\n                \"nom_emetteur\": \"ORNYTHORYNQUE\",\n                \"bordereau_finished\": 0,\n                \"mode_suivi\": \"BON\",\n                \"id_traitement_prevu\": 1,\n                \"id_dechet\": 1,\n                \"ref_dossier\": null,\n                \"id_site\": 1,\n                \"id_transport_1\": 6221,\n                \"quantitee_transportee\": 1337,\n                \"quantitee_finale\": 42,\n                \"quantitee_estimee\": 1,\n                \"id_traitement_inter\": null,\n                \"id_transport_2\": null,\n                \"id_traitement_final\": 8051\n            },\n            \"dechet\": {\n                \"codeinterne\": \"052B\",\n                \"is_listeverte\": 1,\n                \"is_dangereux\": 0,\n                \"libelle\": \"DND EN MÉLANGE, ASSIMILABLES AUX ORDURES MÉNAGÈRES (HORS PAPIER, CARTON, MÉTAL, PLASTIQUE, VERRE ET BOIS) - 052B\",\n                \"code_europeen\": \"20 03 01\",\n                \"categorie\": \"DIB\",\n                \"indicateur_national_valorisation\": 1,\n                \"famille\": \"LISTE VERTE,TOUS DÉCHETS,BILAN EUROP-34 DND OM ET ASSIM,BILAN EUROP-35 DIB MÉNAGERS,TOUT VENANT,EXPLOITATION\",\n                \"id\": 1\n            },\n            \"site\": {\n                \"nom\": \"AGENCE LE PORT\",\n                \"site_production\": \"AGENCE CLIENTÈLE DU PORT\",\n                \"unite_dependance\": \"SEI REUNION CLIENTÈLE\",\n                \"up_dependance\": \"SEI REUNION\",\n                \"metier_dependance\": \"SEI\",\n                \"id\": 1\n            },\n            \"transport1\": {\n                \"id\": 6221,\n                \"date\": \"2016-02-13T23:00:00.000Z\",\n                \"mode\": null,\n                \"id_transporteur\": 1,\n                \"recepisse\": null,\n                \"immatriculation\": null\n            }\n        },\n        {\n            \"bordereau\": {\n                \"id\": 594,\n                \"num_bordereau\": \"17B0001\",\n                \"cas\": \"1\",\n                \"nom_emetteur\": \"ADYKARINN MICHELLE\",\n                \"bordereau_finished\": 0,\n                \"mode_suivi\": \"BSDD\",\n                \"id_traitement_prevu\": 2,\n                \"id_dechet\": 71,\n                \"ref_dossier\": null,\n                \"id_site\": 83,\n                \"id_transport_1\": 366,\n                \"quantitee_transportee\": 0.29,\n                \"quantitee_finale\": 0,\n                \"quantitee_estimee\": 1,\n                \"id_traitement_inter\": null,\n                \"id_transport_2\": null,\n                \"id_traitement_final\": 480\n            },\n            \"dechet\": {\n                \"codeinterne\": \"400\",\n                \"is_listeverte\": 1,\n                \"is_dangereux\": 0,\n                \"libelle\": \"COMPTEURS ÉLECTRIQUES - 400\",\n                \"code_europeen\": \"16 02 14\",\n                \"categorie\": \"DIB\",\n                \"indicateur_national_valorisation\": 1,\n                \"famille\": \"LISTE VERTE,TOUS DÉCHETS,DEEE (IN ET OUT),BILAN EUROP-25 DND ÉQUIP HS,EXPLOITATION\",\n                \"id\": 71\n            },\n            \"site\": {\n                \"nom\": \"CLIENTÈLE MOUFIA\",\n                \"site_production\": null,\n                \"unite_dependance\": \"SEI REUNION CLIENTÈLE\",\n                \"up_dependance\": \"SEI REUNION\",\n                \"metier_dependance\": \"SEI\",\n                \"id\": 83\n            },\n            \"transport1\": {\n                \"id\": 366,\n                \"date\": \"2017-03-23T23:00:00.000Z\",\n                \"mode\": \"ROUTE\",\n                \"id_transporteur\": 80,\n                \"recepisse\": \"974-156\",\n                \"immatriculation\": null\n            }\n        }\n    ],\n    \"retards_dd\": [],\n    \"bordereaux\": 44,\n    \"non_dates\": [\n        {\n            \"bordereau\": {\n                \"id\": 594,\n                \"num_bordereau\": \"17B0001\",\n                \"cas\": \"1\",\n                \"nom_emetteur\": \"ADYKARINN MICHELLE\",\n                \"bordereau_finished\": 0,\n                \"mode_suivi\": \"BSDD\",\n                \"id_traitement_prevu\": 2,\n                \"id_dechet\": 71,\n                \"ref_dossier\": null,\n                \"id_site\": 83,\n                \"id_transport_1\": 366,\n                \"quantitee_transportee\": 0.29,\n                \"quantitee_finale\": 0,\n                \"quantitee_estimee\": 1,\n                \"id_traitement_inter\": null,\n                \"id_transport_2\": null,\n                \"id_traitement_final\": 480\n            }\n        },\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ResourceNotFound",
            "description": "<p>Impossible de trouver le lieu spécifié</p>"
          }
        ]
      }
    },
    "filename": "backend/doc/dashboard.doc.js",
    "groupTitle": "Dashboard",
    "name": "GetDashboardDetailsLevelName"
  },
  {
    "type": "GET",
    "url": "/dashboard/:level/:name",
    "title": "Donne infos pour dashboard",
    "description": "<p>Recherche les informations nécessaires pour construire la dashboard en fonction de l'endroit voulu.</p>",
    "group": "Dashboard",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "queryArgs": [
          {
            "group": "queryArgs",
            "type": "number",
            "optional": false,
            "field": "level",
            "description": "<p>niveau voulu dans la hierarchie (allant de 0 : central à 4 : site)</p>"
          },
          {
            "group": "queryArgs",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>nom du lieu voulu dans sa hierarchie (facultatif dans le cas d'une hierarchie 1 (niveau central))</p>"
          }
        ],
        "queryParams": [
          {
            "group": "queryParams",
            "type": "number",
            "optional": false,
            "field": "beginDate",
            "description": "<p>première date</p>"
          },
          {
            "group": "queryParams",
            "type": "number",
            "optional": false,
            "field": "endDate",
            "description": "<p>dernière date</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple",
        "content": "curl -i http://localhost:4000/api/dashboard/4/AGEN BARBUSSE?beginDate=2017-01-01&endDate=2017-03-01",
        "type": "curl"
      },
      {
        "title": "Exemple global",
        "content": "curl -i http://localhost:4000/api/dashboard/0?beginDate=2017-01-01&endDate=2017-02-01",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSONString",
            "optional": false,
            "field": "dashboard",
            "description": "<p>Informations nécessaires à la construction de la dashboard sur le site voulu</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès :",
          "content": "\n  [\n    {\n        \"id\": 118530,\n        \"ecarts_pesee\": 0,\n        \"incoherences_filieres_norm\": 0,\n        \"filieres_interdites_norm\": 0,\n        \"retards_norm\": 0,\n        \"volume_total\": 3.114,\n        \"valorisation_totale\": 3.114,\n        \"valorisation_l_verte\": 3.114,\n        \"date\": \"2016-12-31T23:00:00.000Z\",\n        \"incoherences_filieres_dd\": 0,\n        \"filieres_interdites_dd\": 0,\n        \"retards_dd\": 0,\n        \"details\": \"\",\n        \"id_site\": 3,\n        \"volume_l_verte\": 3.114,\n        \"bordereaux\": 2,\n        \"non_dates\": 0\n    },\n    {\n        \"id\": 119020,\n        \"ecarts_pesee\": 0,\n        \"incoherences_filieres_norm\": 0,\n        \"filieres_interdites_norm\": 0,\n        \"retards_norm\": 0,\n        \"volume_total\": 5.26,\n        \"valorisation_totale\": 4.22,\n        \"valorisation_l_verte\": 0,\n        \"date\": \"2017-01-31T23:00:00.000Z\",\n        \"incoherences_filieres_dd\": 0,\n        \"filieres_interdites_dd\": 0,\n        \"retards_dd\": 0,\n        \"details\": \"Aucun déchet en liste verte;\",\n        \"id_site\": 3,\n        \"volume_l_verte\": 0,\n        \"bordereaux\": 4,\n        \"non_dates\": 0\n    }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ResourceNotFound",
            "description": "<p>Impossible de trouver le lieu spécifié</p>"
          }
        ]
      }
    },
    "filename": "backend/doc/dashboard.doc.js",
    "groupTitle": "Dashboard",
    "name": "GetDashboardLevelName"
  },
  {
    "type": "GET",
    "url": "/graphs/dechets/:level/:name",
    "title": "Obtient déchets pour vision déchets",
    "description": "<p>Recherche les informations nécessaires pour construire les graphes en fonction des déchets et prestataires</p>",
    "group": "Graphs",
    "version": "1.1.0",
    "parameter": {
      "fields": {
        "queryArgs": [
          {
            "group": "queryArgs",
            "type": "number",
            "optional": false,
            "field": "level",
            "description": "<p>niveau voulu dans la hierarchie (allant de 0 : central à 4 : site)</p>"
          },
          {
            "group": "queryArgs",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>nom du lieu voulu dans sa hierarchie (facultatif dans le cas d'une hierarchie 1 (niveau central))</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple",
        "content": "curl -i http://localhost:4000/api/new/graphs/dechets/4/GROUPEMENT%20THERMIQUE%20TAC",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSONString",
            "optional": false,
            "field": "data",
            "description": "<p>Informations nécessaires à la construction du graphe voulu</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès:",
          "content": "{\n    \"globalData\": {\n        \"volume_total\": 95121.75550000033,\n        \"valorisation_totale\": 88635.06649999996,\n        \"volume_l_verte\": 87914.7784999999,\n        \"valorisation_l_verte\": 84639.44099999985,\n        \"volume_region\": 31.74400000000002,\n        \"valorisation_region\": 23.28400000000001,\n        \"volume_l_verte_region\": 26.484000000000023,\n        \"valorisation_l_verte_region\": 19.064000000000004\n    },\n    \"dechets\": [\n        {\n            \"codeinterne\": \"227\",\n            \"is_listeverte\": 0,\n            \"is_dangereux\": 1,\n            \"libelle\": \"MÉLANGES DE DÉCHETS PROVENANT DE DESSABLEURS ET DE SÉPARATEURS EAU/HYDROCARBURES - 227\",\n            \"code_europeen\": \"13 05 08*\",\n            \"categorie\": \"DIS\",\n            \"indicateur_national_valorisation\": 0,\n            \"famille\": \"HYDROCARBURES,TOUS DÉCHETS,BOUES ET SEDIMENTS,EXPLOITATION\",\n            \"id\": 169\n        },\n        {\n            \"codeinterne\": \"118\",\n            \"is_listeverte\": 1,\n            \"is_dangereux\": 1,\n            \"libelle\": \"ABSORBANTS, MATÉRIAUX FILTRANTS, CHIFFONS D'ESSUYAGE ET VÊTEMENTS DE PROTECTION CONTAMINÉS PAR DES SUSBTANCES DANGEREUSES - 118\",\n            \"code_europeen\": \"15 02 02*\",\n            \"categorie\": \"DIS\",\n            \"indicateur_national_valorisation\": 1,\n            \"famille\": \"LISTE VERTE,TOUS DÉCHETS,BILAN EUROP-06 DD DÉC CHIMIQU,EXPLOITATION\",\n            \"id\": 27\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ResourceNotFound",
            "description": "<p>Impossible de trouver le lieu spécifié</p>"
          }
        ]
      }
    },
    "filename": "backend/doc/graphs.doc.js",
    "groupTitle": "Graphs",
    "name": "GetGraphsDechetsLevelName"
  },
  {
    "type": "GET",
    "url": "/graphs/dechets/:level/:name/prestataires/:idDechet",
    "title": "Obtient prestataires pour un déchet",
    "description": "<p>Recherche les informations nécessaires pour construire les graphes en fonction des déchets et prestataires</p>",
    "group": "Graphs",
    "version": "1.1.0",
    "parameter": {
      "fields": {
        "queryArgs": [
          {
            "group": "queryArgs",
            "type": "number",
            "optional": false,
            "field": "level",
            "description": "<p>niveau voulu dans la hierarchie (allant de 0 : central à 4 : site)</p>"
          },
          {
            "group": "queryArgs",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>nom du lieu voulu dans sa hierarchie (facultatif dans le cas d'une hierarchie 1 (niveau central))</p>"
          },
          {
            "group": "queryArgs",
            "type": "number",
            "optional": false,
            "field": "idDechet",
            "description": "<p>id du déchet recherché</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple",
        "content": "curl -i http://localhost:4000/api/new/graphs/dechets/4/GROUPEMENT%20THERMIQUE%20TAC/prestataires/27",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSONString",
            "optional": false,
            "field": "data",
            "description": "<p>Informations nécessaires à la construction du graphe voulu</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès:",
          "content": "{\n    \"sites\": {\n        \"quantity\": [\n            {\n                \"prestataire\": {\n                    \"nom\": \"SCORIFRONTIGNAN\",\n                    \"siret\": \"31524980500138\",\n                    \"id\": 755,\n                    \"localisation\": \"SUEZ\"\n                },\n                \"quantitee_traitee\": 0.333\n            }\n        ],\n        \"recycled\": [\n            {\n                \"prestataire\": {\n                    \"nom\": \"SCORIFRONTIGNAN\",\n                    \"siret\": \"31524980500138\",\n                    \"id\": 755,\n                    \"localisation\": \"SUEZ\"\n                },\n                \"quantitee_traitee\": 0.333\n            }\n        ]\n    },\n    \"global\": {...},\n    \"region\": {...}\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ResourceNotFound",
            "description": "<p>Impossible de trouver le lieu spécifié</p>"
          }
        ]
      }
    },
    "filename": "backend/doc/graphs.doc.js",
    "groupTitle": "Graphs",
    "name": "GetGraphsDechetsLevelNamePrestatairesIddechet"
  },
  {
    "type": "GET",
    "url": "/graphs/prestataire/:level/:name",
    "title": "Obtient prestataires pour vision prestataires",
    "description": "<p>Recherche les informations nécessaires pour construire les graphes en fonction des déchets et prestataires</p>",
    "group": "Graphs",
    "version": "1.1.0",
    "parameter": {
      "fields": {
        "queryArgs": [
          {
            "group": "queryArgs",
            "type": "number",
            "optional": false,
            "field": "level",
            "description": "<p>niveau voulu dans la hierarchie (allant de 0 : central à 4 : site)</p>"
          },
          {
            "group": "queryArgs",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>nom du lieu voulu dans sa hierarchie (facultatif dans le cas d'une hierarchie 1 (niveau central))</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple",
        "content": "curl -i http://localhost:4000/api/new/graphs/prestataires/4/GROUPEMENT%20THERMIQUE%20TAC",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSONString",
            "optional": false,
            "field": "data",
            "description": "<p>Informations nécessaires à la construction du graphe voulu</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès:",
          "content": "  {\n    \"globalData\": {\n        \"volume_total\": 95121.75550000033,\n        \"valorisation_totale\": 88635.06649999996,\n        \"volume_l_verte\": 87914.7784999999,\n        \"valorisation_l_verte\": 84639.44099999985,\n        \"volume_region\": 31.74400000000002,\n        \"valorisation_region\": 23.28400000000001,\n        \"volume_l_verte_region\": 26.484000000000023,\n        \"valorisation_l_verte_region\": 19.064000000000004\n    },\n    \"prestataires\": [\n        {\n            \"nom\": \"SCORIFRONTIGNAN\",\n            \"localisation\": \"SUEZ\",\n            \"siret\": \"31524980500138\",\n            \"id\": 755\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ResourceNotFound",
            "description": "<p>Impossible de trouver le lieu spécifié</p>"
          }
        ]
      }
    },
    "filename": "backend/doc/graphs.doc.js",
    "groupTitle": "Graphs",
    "name": "GetGraphsPrestataireLevelName"
  },
  {
    "type": "GET",
    "url": "/graphs/prestataire/:level/:name/dechets/:idPrestataire",
    "title": "Obtient déchets pour un prestataire",
    "description": "<p>Recherche les informations nécessaires pour construire les graphes en fonction des déchets et prestataires</p>",
    "group": "Graphs",
    "version": "1.1.0",
    "parameter": {
      "fields": {
        "queryArgs": [
          {
            "group": "queryArgs",
            "type": "number",
            "optional": false,
            "field": "level",
            "description": "<p>niveau voulu dans la hierarchie (allant de 0 : central à 4 : site)</p>"
          },
          {
            "group": "queryArgs",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>nom du lieu voulu dans sa hierarchie (facultatif dans le cas d'une hierarchie 1 (niveau central))</p>"
          },
          {
            "group": "queryArgs",
            "type": "number",
            "optional": false,
            "field": "idPrestataire",
            "description": "<p>id du prestataire recherché</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple",
        "content": "curl -i http://localhost:4000/api/new/graphs/prestataires/4/GROUPEMENT%20THERMIQUE%20TAC/dechets/755",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSONString",
            "optional": false,
            "field": "data",
            "description": "<p>Informations nécessaires à la construction du graphe voulu</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès:",
          "content": "  {\n    \"sites\": {\n        \"quantity\": [\n            {\n                \"dechet\": {\n                    \"id\": 169,\n                    \"codeinterne\": \"227\",\n                    \"famille\": \"HYDROCARBURES,TOUS DÉCHETS,BOUES ET SEDIMENTS,EXPLOITATION\",\n                    \"libelle\": \"MÉLANGES DE DÉCHETS PROVENANT DE DESSABLEURS ET DE SÉPARATEURS EAU/HYDROCARBURES - 227\",\n                    \"is_listeverte\": 0\n                },\n                \"quantitee_traitee\": 2.278\n            },\n            {\n                \"dechet\": {\n                    \"id\": 27,\n                    \"codeinterne\": \"118\",\n                    \"famille\": \"LISTE VERTE,TOUS DÉCHETS,BILAN EUROP-06 DD DÉC CHIMIQU,EXPLOITATION\",\n                    \"libelle\": \"ABSORBANTS, MATÉRIAUX FILTRANTS, CHIFFONS D'ESSUYAGE ET VÊTEMENTS DE PROTECTION CONTAMINÉS PAR DES SUSBTANCES DANGEREUSES - 118\",\n                    \"is_listeverte\": 1\n                },\n                \"quantitee_traitee\": 0.333\n            }\n        ],\n        \"recycled\": [\n            {\n                \"dechet\": {\n                    \"id\": 169,\n                    \"codeinterne\": \"227\",\n                    \"famille\": \"HYDROCARBURES,TOUS DÉCHETS,BOUES ET SEDIMENTS,EXPLOITATION\",\n                    \"libelle\": \"MÉLANGES DE DÉCHETS PROVENANT DE DESSABLEURS ET DE SÉPARATEURS EAU/HYDROCARBURES - 227\",\n                    \"is_listeverte\": 0\n                },\n                \"quantitee_traitee\": 2.278\n            },\n            {\n                \"dechet\": {\n                    \"id\": 27,\n                    \"codeinterne\": \"118\",\n                    \"famille\": \"LISTE VERTE,TOUS DÉCHETS,BILAN EUROP-06 DD DÉC CHIMIQU,EXPLOITATION\",\n                    \"libelle\": \"ABSORBANTS, MATÉRIAUX FILTRANTS, CHIFFONS D'ESSUYAGE ET VÊTEMENTS DE PROTECTION CONTAMINÉS PAR DES SUSBTANCES DANGEREUSES - 118\",\n                    \"is_listeverte\": 1\n                },\n                \"quantitee_traitee\": 0.333\n            }\n        ]\n    },\n    \"global\": {...},\n    \"region\": {...}\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ResourceNotFound",
            "description": "<p>Impossible de trouver le lieu spécifié</p>"
          }
        ]
      }
    },
    "filename": "backend/doc/graphs.doc.js",
    "groupTitle": "Graphs",
    "name": "GetGraphsPrestataireLevelNameDechetsIdprestataire"
  }
] });
