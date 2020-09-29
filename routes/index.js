const { Router } = require('express');

const router = Router();

const db = require('../conf');

/* GET index page. */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Express'
  });
});

// Tu es libre du sujet de ton application. En revanche, il faudra que ta ou tes tables contiennent obligatoirement des champs avec le type suivant :

//     Un champs type "texte"  // citation + auteur name + auteur prenom + id

//     Un champs type "date" // date time ajout

//     Un champs type "booléen" // validated true/false

//     Un champs type "entier" // note 1-10

// Liste des fonctionnalités

// Voici les fonctionnalités auxquelles ton API devra répondre :

//     GET - Récupération de l'ensemble des données de ta table

// router.get('/quotes', (req, res) => {
//   db.query('SELECT  `timestamp`, `author_id`, `quotetext`, `validated`, `rank` FROM quote', (err, results) => {
//     if (err) {
//       res.status(500).send("Can't get quotes !");
//     } else {
//       res.status(200).send(results);
//     }
//   });
// });

//     GET (light) - Récupération de quelques champs spécifiques (id, names, dates, etc...)
router.get('/light-quotes', (req, res) => {
  db.query('SELECT `author_id`, `quotetext` FROM quote', (err, results) => {
    if (err) {
      res.status(500).send("Can't get 'light' quotes !");
    } else {
      res.status(200).send(results);
    }
  });
});

//     GET - Récupération d'un ensemble de données en fonction de certains filtres :
// Un filtre "contient ..." (ex: nom contenant la chaîne de caractère 'wcs')Un filtre "commence par ..." (ex: nom commençant par 'campus')Un filtre "supérieur à ..." (ex: date supérieure à 18/10/2010)
//     Une route par type de filtre
//     GET - Récupération de données ordonnées (ascendant, descendant)L'ordre sera passé en tant que paramètre de la route
router.get('/quotes', (req, res) => {
  let slqReq = 'SELECT `id`, `timestamp`, `author_id`, `quotetext`, `validated`, `rank` FROM quote';

  // filters
  if (req.query.contains) slqReq += ` WHERE quotetext LIKE '%${req.query.contains}%'`;
  if (req.query.start) slqReq += ` WHERE quotetext LIKE '${req.query.start}%'`;
  if (req.query.older) slqReq += ` WHERE timestamp < ${req.query.older}`;

  // sorting
  if (req.query.sort) slqReq += ` ORDER BY ${req.query.sort.split(',').join(' ')}`;

  db.query(slqReq, (err, results) => {
    if (err) {
      res.status(500).send("Can't get quotes !");
    } else {
      res.status(200).send(results);
    }
  });
});

//     POST - Sauvegarde d'une nouvelle entité

//     PUT - Modification d'une entité

//     PUT - Toggle du booléen

//     DELETE - Suppression d'une entité

//     DELETE - Suppression de toutes les entités dont le booléen est false

module.exports = router;
