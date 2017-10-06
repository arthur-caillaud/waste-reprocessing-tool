define({ "api": [  {    "type": "GET",    "url": "/bordereaux",    "title": "Recherche tous les bordereaux",    "group": "Bordereaux",    "version": "1.0.0",    "examples": [      {        "title": "Exemple",        "content": "curl -i http://localhost:4000/api/bordereaux",        "type": "curl"      }    ],    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "JSONString[]",            "optional": false,            "field": "bordereaux",            "description": "<p>Liste des bordereaux corresponant à la recherche</p>"          }        ]      }    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "BordereauxNotFound",            "description": "<p>Impossible de trouver de bordereaux</p>"          }        ]      }    },    "filename": "backend/routes/bordereaux.controller.js",    "groupTitle": "Bordereaux",    "name": "GetBordereaux"  },  {    "type": "GET",    "url": "/bordereaux/:id",    "title": "Recherche un bordereau selon son id",    "group": "Bordereaux",    "version": "1.0.0",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "number",            "optional": false,            "field": "id",            "description": "<p>Id du bordereau recherché</p>"          }        ]      }    },    "examples": [      {        "title": "Exemple",        "content": "curl -i http://localhost:4000/api/bordereaux/42",        "type": "curl"      }    ],    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "JSONString",            "optional": false,            "field": "bordereau",            "description": "<p>Bordereau recherché</p>"          }        ]      }    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "BordereauNotFound",            "description": "<p>Bordereau recherché inexistant</p>"          }        ]      }    },    "filename": "backend/routes/bordereaux.controller.js",    "groupTitle": "Bordereaux",    "name": "GetBordereauxId"  },  {    "type": "GET",    "url": "/dechets",    "title": "Recherche tous les déchets",    "group": "D_chets",    "version": "1.0.0",    "examples": [      {        "title": "Exemple",        "content": "curl -i http://localhost:4000/api/dechets",        "type": "curl"      }    ],    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "JSONString[]",            "optional": false,            "field": "dechets",            "description": "<p>Liste des dechets corresponant à la recherche</p>"          }        ]      }    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "DechetsNotFound",            "description": "<p>Impossible de trouver de déchets</p>"          }        ]      }    },    "filename": "backend/routes/dechets.controller.js",    "groupTitle": "D_chets",    "name": "GetDechets"  },  {    "type": "GET",    "url": "/dechets/:id",    "title": "Recherche un déchet selon son id",    "group": "D_chets",    "version": "1.0.0",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "number",            "optional": false,            "field": "id",            "description": "<p>Id du déchet recherché</p>"          }        ]      }    },    "examples": [      {        "title": "Exemple",        "content": "curl -i http://localhost:4000/api/dechets/42",        "type": "curl"      }    ],    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "JSONString",            "optional": false,            "field": "dechet",            "description": "<p>Déchet recherché</p>"          }        ]      }    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "DechetNotFound",            "description": "<p>Déchet recherché inexistant</p>"          }        ]      }    },    "filename": "backend/routes/dechets.controller.js",    "groupTitle": "D_chets",    "name": "GetDechetsId"  }] });
