const { Router } = require("express");

const router = Router();

const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

const db = require("../conf");

//  1. GET (light) - Récupération de quelques champs spécifiques (id, names, dates, etc...)
router.get("/light-quotes", (req, res) => {
    db.query("SELECT `author_id`, `quotetext` FROM quote", (err, results) => {
        if (err) {
            res.status(500).send("Can't get 'light' quotes !");
        } else {
            res.status(200).send(results);
        }
    });
});

//  2. GET - Récupération de l'ensemble des données de ta table

//  GET - Récupération d'un ensemble de données en fonction de certains filtres :
//  3. Un filtre "contient ..." (ex: nom contenant la chaîne de caractère 'wcs')
//  4. Un filtre "commence par ..." (ex: nom commençant par 'campus')
//  5. Un filtre "supérieur à ..." (ex: date supérieure à 18/10/2010)

//  6. GET - Récupération de données ordonnées (ascendant, descendant)L'ordre sera passé en tant que paramètre de la route

router.get("/quotes", (req, res) => {
    let slqReq = "SELECT `id`, `timestamp`, `author_id`, `quotetext`, `validated`, `rank` FROM quote";
    // filters
    if (req.query.contains) slqReq += ` WHERE quotetext LIKE '%${req.query.contains}%'`;
    if (req.query.start) slqReq += ` WHERE quotetext LIKE '${req.query.start}%'`;
    if (req.query.older) slqReq += ` WHERE timestamp < DATE(${req.query.older})`;
    // sorting
    if (req.query.sort) slqReq += ` ORDER BY ${req.query.sort.split(",").join(" ")}`;
    db.query(slqReq, (err, results) => {
        if (err) {
            res.status(500).send("Can't get quotes !");
        } else {
            res.status(200).send(results);
        }
    });
});

//  7. POST - Sauvegarde d'une nouvelle entité

router.post("/quotes", (req, res) => {
    let slqReq = "INSERT INTO `quote` SET ?;";
    db.query(slqReq, [req.body], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Can't post quote !");
        } else {
            res.status(200).send("Your new quote is posted (id: " + results.insertId + ").");
        }
    });
});

//  8. PUT - Modification d'une entité

router.put("/quotes/:id(\\d+)", (req, res) => {
    let slqReq = "UPDATE `quote` SET ? WHERE id = ?;";
    db.query(slqReq, [req.body, req.params.id], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Can't update quote !");
        } else {
            res.status(200).send("Your quote is updated.");
        }
    });
});

// 9. PUT - Toggle du booléen
router.put("/quotes/:id(\\d+)/toggle-validated", (req, res) => {
    let slqReq = "UPDATE `quote` SET validated = !validated WHERE id = ?;";
    db.query(slqReq, [req.params.id], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Can't toggle validated quote !");
        } else {
            res.status(200).send("Your quote validated is toggled.");
        }
    });
});

//  10. DELETE - Suppression d'une entité

router.delete("/quotes/:id(\\d+)", (req, res) => {
    let slqReq = "DELETE FROM `quote` WHERE id = ?";
    db.query(slqReq, [req.params.id], (err, results) => {
        if (err) {
            res.status(500).send("Can't delete quote !");
        } else {
            res.status(200).send("Quote id " + req.params.id + " deleted.");
        }
    });
});

// 11. DELETE - Suppression de toutes les entités dont le booléen est false

router.delete("/quotes/del-unvalidated", (req, res) => {
    let slqReq = "DELETE FROM `quote` WHERE validated = 0";
    db.query(slqReq, (err, results) => {
        if (err) {
            res.status(500).send("Can't delete unvalidated quotes !");
        } else {
            res.status(200).send(results.affectedRows + " quote(s) deleted.");
        }
    });
});

module.exports = router;
