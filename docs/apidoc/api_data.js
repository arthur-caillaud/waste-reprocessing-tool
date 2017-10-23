define({ "api": [
  {
    "type": "GET",
    "url": "/bordereaux",
    "title": "Recherche tous les bordereaux",
    "group": "Bordereaux",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Exemple",
        "content": "curl -i http://localhost:4000/api/bordereaux",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSONString[]",
            "optional": false,
            "field": "bordereaux",
            "description": "<p>Liste des bordereaux corresponant à la recherche</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BordereauxNotFound",
            "description": "<p>Impossible de trouver de bordereaux</p>"
          }
        ]
      }
    },
    "filename": "backend/routes/bordereaux.controller.js",
    "groupTitle": "Bordereaux",
    "name": "GetBordereaux"
  },
  {
    "type": "GET",
    "url": "/bordereaux/:id",
    "title": "Recherche un bordereau selon son id",
    "group": "Bordereaux",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "id",
            "description": "<p>Id du bordereau recherché</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple",
        "content": "curl -i http://localhost:4000/api/bordereaux/42",
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
            "field": "bordereau",
            "description": "<p>Bordereau recherché</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BordereauNotFound",
            "description": "<p>Bordereau recherché inexistant</p>"
          }
        ]
      }
    },
    "filename": "backend/routes/bordereaux.controller.js",
    "groupTitle": "Bordereaux",
    "name": "GetBordereauxId"
  },
  {
    "type": "GET",
    "url": "/architecture/ Récupère l'architecture globale de l'organisation",
    "title": "de tous les sites possibles",
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
      }
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
    "filename": "backend/routes/dashboard.controller.js",
    "groupTitle": "Dashboard",
    "name": "GetArchitectureRCupReLArchitectureGlobaleDeLOrganisation"
  },
  {
    "type": "GET",
    "url": "/dashboard/:level/:id Recherche les informations nécessaires pour",
    "title": "construire la dashboard en fonction de l'endroit voulu.",
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
        "queryParam": [
          {
            "group": "queryParam",
            "type": "number",
            "optional": false,
            "field": "beginDate",
            "description": "<p>première date</p>"
          },
          {
            "group": "queryParam",
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
        "content": "curl -i http://localhost:4000/api/dashboard/2/42?beginDate=2017-01-01&endDate=2017-06-01",
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
      }
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
    "filename": "backend/routes/dashboard.controller.js",
    "groupTitle": "Dashboard",
    "name": "GetDashboardLevelIdRechercheLesInformationsNCessairesPour"
  },
  {
    "type": "GET",
    "url": "/dechets",
    "title": "Recherche tous les déchets",
    "group": "Dechets",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "queryParam": [
          {
            "group": "queryParam",
            "type": "number",
            "optional": true,
            "field": "id",
            "description": "<p>Id des déchets</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "codeinterne",
            "description": "<p>code interne des déchets</p>"
          },
          {
            "group": "queryParam",
            "type": "number",
            "optional": true,
            "field": "is_listeverte",
            "description": "<p>Indique si les déchets sont en liste verte</p>"
          },
          {
            "group": "queryParam",
            "type": "number",
            "optional": true,
            "field": "is_dangereux",
            "description": "<p>Indique si les déchets sont dangereux (0 ou 1)</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "libelle",
            "description": "<p>libellé des déchets</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "code_europeen",
            "description": "<p>Code européen des déchets</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "categorie",
            "description": "<p>Catégorie des déchets</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "indicateur_national_valorisation",
            "description": "<p>Indicateur national de valorisation des déchets</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "famille",
            "description": "<p>Famille des déchets</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "order",
            "description": "<p>Tri de la liste des résultats</p>"
          },
          {
            "group": "queryParam",
            "type": "string[]",
            "optional": true,
            "field": "fields",
            "description": "<p>Sélection des champs</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple",
        "content": "curl -i http://localhost:4000/api/dechets",
        "type": "curl"
      },
      {
        "title": "Exemple avec arguments",
        "content": "curl -i http://localhost:4000/api/dechets/?fields=id,libelle&order=-libelle&is_listeverte=true",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSONString[]",
            "optional": false,
            "field": "dechets",
            "description": "<p>Liste des dechets corresponant à la recherche</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DechetsNotFound",
            "description": "<p>Impossible de trouver de déchets</p>"
          }
        ]
      }
    },
    "filename": "backend/routes/dechets.controller.js",
    "groupTitle": "Dechets",
    "name": "GetDechets"
  },
  {
    "type": "GET",
    "url": "/dechets/:id",
    "title": "Recherche un déchet selon son id",
    "group": "Dechets",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "id",
            "description": "<p>Id du déchet recherché</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple",
        "content": "curl -i http://localhost:4000/api/dechets/42",
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
            "field": "dechet",
            "description": "<p>Déchet recherché</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DechetNotFound",
            "description": "<p>Déchet recherché inexistant</p>"
          }
        ]
      }
    },
    "filename": "backend/routes/dechets.controller.js",
    "groupTitle": "Dechets",
    "name": "GetDechetsId"
  },
  {
    "type": "GET",
    "url": "/dashboard/:prestataire/:dechet Recherche les informations nécessaires pour",
    "title": "construire les graphes en fonction des déchets et prestataires",
    "group": "Graphs",
    "version": "1.0.0",
    "deprecated": {
      "content": "use now version 1.1.0"
    },
    "parameter": {
      "fields": {
        "queryArgs": [
          {
            "group": "queryArgs",
            "type": "number",
            "optional": false,
            "field": "prestataireId",
            "description": "<p>id du prestataire considéré</p>"
          },
          {
            "group": "queryArgs",
            "type": "number",
            "optional": false,
            "field": "dechetId",
            "description": "<p>id du déchet considéré</p>"
          }
        ],
        "queryParam": [
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "beginDate",
            "description": "<p>première date voulue (format yyyy-mm-dd)</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "endDate",
            "description": "<p>première date voulue (format yyyy-mm-dd)</p>"
          },
          {
            "group": "queryParam",
            "type": "number",
            "optional": true,
            "field": "level",
            "description": "<p>niveau voulu dans la hierarchie (allant de 0 : central à 4 : site) default: 0</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "name",
            "description": "<p>nom du lieu voulu dans sa hierarchie (facultatif dans le cas d'une hierarchie 1 (niveau central))</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple",
        "content": "curl -i http://localhost:4000/api/graphs/49/3",
        "type": "curl"
      },
      {
        "title": "Exemple avec arguments",
        "content": "curl -i http://localhost:4000/api/graphs/49/3/?beginDate=2017-11-11&endDate=2017-03-18&level=1&name=SEI",
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
      }
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
    "filename": "backend/routes/graphs.controller.js",
    "groupTitle": "Graphs",
    "name": "GetDashboardPrestataireDechetRechercheLesInformationsNCessairesPour"
  },
  {
    "type": "GET",
    "url": "/graphs/prestataires/",
    "title": "A CHANGER",
    "group": "Graphs",
    "version": "1.1.0",
    "parameter": {
      "fields": {
        "queryParam": [
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "beginDate",
            "description": "<p>première date voulue (format yyyy-mm-dd)</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "endDate",
            "description": "<p>première date voulue (format yyyy-mm-dd)</p>"
          },
          {
            "group": "queryParam",
            "type": "number",
            "optional": true,
            "field": "level",
            "description": "<p>niveau voulu dans la hierarchie (allant de 0 : central à 4 : site) default: 0</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "name",
            "description": "<p>nom du lieu voulu dans sa hierarchie (facultatif dans le cas d'une hierarchie 0 (niveau central))</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple",
        "content": "curl -i http://localhost:4000/api/graphs/prestataires/0",
        "type": "curl"
      },
      {
        "title": "Exemple avec arguments",
        "content": "curl -i http://localhost:4000/api/graphs/prestataires/1/SEI/?beginDate=2017-11-11&endDate=2017-03-18&level=1&name=SEI",
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
            "description": "<p>Informations nécessaires</p>"
          }
        ]
      }
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
    "filename": "backend/routes/graphs.new.controller.js",
    "groupTitle": "Graphs",
    "name": "GetGraphsPrestataires"
  },
  {
    "type": "GET",
    "url": "/graphs/prestataires/:level/:name/dechets/:id Donne la liste des déchets",
    "title": "avec les déchets valorisés pour un prestataire donné sur un lieu donné",
    "group": "Graphs",
    "version": "1.1.0",
    "parameter": {
      "fields": {
        "queryParam": [
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "beginDate",
            "description": "<p>première date voulue (format yyyy-mm-dd)</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "endDate",
            "description": "<p>première date voulue (format yyyy-mm-dd)</p>"
          },
          {
            "group": "queryParam",
            "type": "number",
            "optional": true,
            "field": "level",
            "description": "<p>niveau voulu dans la hierarchie (allant de 0 : central à 4 : site) default: 0</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "name",
            "description": "<p>nom du lieu voulu dans sa hierarchie (facultatif dans le cas d'une hierarchie 0 (niveau central))</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple",
        "content": "curl -i http://localhost:4000/api/graphs/prestataires/0/dechets/1",
        "type": "curl"
      },
      {
        "title": "Exemple avec arguments",
        "content": "curl -i http://localhost:4000/api/graphs/0/prestataires/1/?beginDate=2017-11-11&endDate=2017-03-18&level=1&name=SEI",
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
            "description": "<p>Informations nécessaires</p>"
          }
        ]
      }
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
    "filename": "backend/routes/graphs.new.controller.js",
    "groupTitle": "Graphs",
    "name": "GetGraphsPrestatairesLevelNameDechetsIdDonneLaListeDesDChets"
  },
  {
    "type": "GET",
    "url": "/getIndicatorsForPrestataire",
    "title": "Récupères les indicateurs pour un prestataire",
    "version": "1.0.0",
    "deprecated": {
      "content": "use now version 1.1.0"
    },
    "group": "Prestataires",
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "JSONString",
            "optional": false,
            "field": "prestataireName",
            "description": "<p>Nom du prestataire</p>"
          }
        ]
      }
    },
    "filename": "backend/routes/prestataires.controller.js",
    "groupTitle": "Prestataires",
    "name": "GetGetindicatorsforprestataire"
  },
  {
    "type": "GET",
    "url": "/getPrestataire/:prestataireName",
    "title": "Récupère les prestataires selon leur nom",
    "version": "1.0.0",
    "deprecated": {
      "content": "use now version 1.1.0"
    },
    "group": "Prestataires",
    "parameter": {
      "fields": {
        "Paramètres": [
          {
            "group": "Paramètres",
            "type": "String",
            "optional": false,
            "field": "prestataireName",
            "description": "<p>Nom du prestataire</p>"
          }
        ]
      }
    },
    "filename": "backend/routes/prestataires.controller.js",
    "groupTitle": "Prestataires",
    "name": "GetGetprestatairePrestatairename"
  },
  {
    "type": "GET",
    "url": "/getPrestataires",
    "title": "Récupère tous les prestataires",
    "version": "1.0.0",
    "deprecated": {
      "content": "use now version 1.1.0"
    },
    "group": "Prestataires",
    "filename": "backend/routes/prestataires.controller.js",
    "groupTitle": "Prestataires",
    "name": "GetGetprestataires"
  },
  {
    "type": "GET",
    "url": "/getPrestatairesCloseToPrestataire",
    "title": "Recherche les prestataires à proximité",
    "version": "1.0.0",
    "deprecated": {
      "content": "use now version 1.1.0"
    },
    "group": "Prestataires",
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "JSONString",
            "optional": false,
            "field": "prestataireName",
            "description": "<p>Nom du prestataire au centre de la recherche</p>"
          }
        ]
      }
    },
    "filename": "backend/routes/prestataires.controller.js",
    "groupTitle": "Prestataires",
    "name": "GetGetprestatairesclosetoprestataire"
  },
  {
    "type": "GET",
    "url": "/prestataires",
    "title": "Recherche tous les prestataires",
    "group": "Prestataires",
    "version": "1.1.0",
    "parameter": {
      "fields": {
        "queryParam": [
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "nom",
            "description": "<p>Noms des prestataires</p>"
          },
          {
            "group": "queryParam",
            "type": "number",
            "optional": true,
            "field": "id",
            "description": "<p>Id des prestataires</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "localisation",
            "description": "<p>Localisation des prestataires</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "siret",
            "description": "<p>SIRET des prestataires</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "order",
            "description": "<p>Tri de la liste des résultats</p>"
          },
          {
            "group": "queryParam",
            "type": "string[]",
            "optional": true,
            "field": "fields",
            "description": "<p>Sélection des champs</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple sans argument",
        "content": "curl -i http://localhost:4000/api/prestataires",
        "type": "curl"
      },
      {
        "title": "Exemple avec arguments",
        "content": "curl -i http://localhost:4000/api/prestataires/?fields=id,nom&order=-nom&localisation=paris",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSONString[]",
            "optional": false,
            "field": "prestataires",
            "description": "<p>Liste des prestataires correspondant à la recherche</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PrestatairesNotFound",
            "description": "<p>Impossible de trouver les prestataires</p>"
          }
        ]
      }
    },
    "filename": "backend/routes/prestataires-new.controller.js",
    "groupTitle": "Prestataires",
    "name": "GetPrestataires"
  },
  {
    "type": "GET",
    "url": "/prestataires",
    "title": "Recherche tous les prestataires",
    "version": "1.0.0",
    "deprecated": {
      "content": "use now version 1.1.0"
    },
    "group": "Prestataires",
    "filename": "backend/routes/prestataires.controller.js",
    "groupTitle": "Prestataires",
    "name": "GetPrestataires"
  },
  {
    "type": "GET",
    "url": "/prestataires/:id",
    "title": "Recherche un prestataire selon son id",
    "group": "Prestataires",
    "version": "1.1.0",
    "examples": [
      {
        "title": "Exemple",
        "content": "curl -i http://localhost:4000/api/prestataires/42",
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
            "field": "prestataire",
            "description": "<p>Prestataire recherché</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PrestataireNotFound",
            "description": "<p>Prestataire introuvable</p>"
          }
        ]
      }
    },
    "filename": "backend/routes/prestataires-new.controller.js",
    "groupTitle": "Prestataires",
    "name": "GetPrestatairesId"
  },
  {
    "type": "GET",
    "url": "/sites",
    "title": "Recherche tous les sites",
    "group": "Sites",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "queryParam": [
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "nom",
            "description": "<p>Noms des sites</p>"
          },
          {
            "group": "queryParam",
            "type": "number",
            "optional": true,
            "field": "id",
            "description": "<p>Id des sites</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "site_production",
            "description": "<p>je sais pas ce que c'est</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "unite_dependance",
            "description": "<p>unité de dépendance des sites</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "up_dependance",
            "description": "<p>aucune idée non plus</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "metier_dependance",
            "description": "<p>métier de dépendance des sites</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "any",
            "description": "<p>recherche sur n'importe quel champ possible</p>"
          },
          {
            "group": "queryParam",
            "type": "string",
            "optional": true,
            "field": "order",
            "description": "<p>Tri de la liste des résultats</p>"
          },
          {
            "group": "queryParam",
            "type": "string[]",
            "optional": true,
            "field": "fields",
            "description": "<p>Sélection des champs</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple sans argument",
        "content": "curl -i http://localhost:4000/api/sites",
        "type": "curl"
      },
      {
        "title": "Exemple recherche sur tous les champs",
        "content": "curl -i http://localhost:4000/api/sites/?any=aquitaine",
        "type": "curl"
      },
      {
        "title": "Exemple avec arguments",
        "content": "curl -i http://localhost:4000/api/sites/?fields=id,nom&order=-nom",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSONString[]",
            "optional": false,
            "field": "prestataires",
            "description": "<p>Liste des sites correspondant à la recherche</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PrestatairesNotFound",
            "description": "<p>Impossible de trouver les prestataires</p>"
          }
        ]
      }
    },
    "filename": "backend/routes/sites.controller.js",
    "groupTitle": "Sites",
    "name": "GetSites"
  },
  {
    "type": "GET",
    "url": "/sites/:id",
    "title": "Recherche un site selon son id",
    "group": "Sites",
    "version": "1.1.0",
    "examples": [
      {
        "title": "Exemple",
        "content": "curl -i http://localhost:4000/api/sites/42",
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
            "field": "prestataire",
            "description": "<p>Prestataire recherché</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PrestataireNotFound",
            "description": "<p>Prestataire introuvable</p>"
          }
        ]
      }
    },
    "filename": "backend/routes/sites.controller.js",
    "groupTitle": "Sites",
    "name": "GetSitesId"
  }
] });
