import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';



const app = express();



app.get("/", (req, res) => {
    res.send('hello world')
 })


const connection = mysql.createConnection({
    host: 'mysql-sounguejeanclaude.alwaysdata.net',
    user: '373300_root',
    password: 'root@root',
    database: 'sounguejeanclaude_inviter_db'
});

//Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err);
        return;
    }
    console.log('Connected to MySQL');
});


//recuperation les information de la base de  donnee
const sql = "SELECT * FROM participant"

app.route("/participants"). get((req, res) =>{
    connection.query(sql, (err, results) =>{
        if(err){
            console.error('Erreur  lors de la recuperation des donnees:', err);
        }
            else{
                res.status(200).json(results);
            }
    })
})


//recuperation les informations d'un participant a parti d'ID

const mySql = "SELECT * FROM participant WHERE id=?";

app.route("/participants/:id").get((req, res) => {
    const idParticipants = req.params.id; // Utilisez 'id_part' pour récupérer l'ID depuis les paramètres de la requête

    connection.query(mySql, [idParticipants], (err, results) => {
        if (err) {
            console.error("Erreur lors de l'execution de la requête: " + err.stack);
            res.status(500).send("Erreur lors de la récupération de l'apprenant");
            return;
        }

        if (results.length === 0) {
            res.status(404).send("Participant non trouvé"); // Gestion du cas où aucun participant n'est trouvé
        } else {
            res.json(results[0]); // Envoyer le premier résultat trouvé
        }
    });
});

//Middleware pour traiter les donnees JSON
app.use(bodyParser.json()); //Pour traiter les donnees JSON


//ajouter des participants sur la base de donne
app.post('/participants', (req, res) =>{
    const { nom, prenom, numero, adress } = req.body; //Assurez-vous que le corps de la requete contient ces champs 

    //validation simple des donnees
    if(!nom || !prenom || !numero || !adress){
        return res.status(400).send("nom, prenom, numero et adress ne sont pas requis."); 
    }

    //Requete SQL pour inserer un nouveau participant
    const sq = 'INSERT INTO participant (nom, prenom, numero, adress) VALUE(?, ?, ?, ?)';
    connection.query(sq, [nom, prenom, numero, adress], (err, results) =>{
        if (err){
            console.error('Erreur lors de l\'insertion du participant:' + err.stack);
            res.status(500).send('Erreur lors de l\'ajout du participant');
        }
        res.status(201).send (`Participant ajout avec ID: ${results.insertId}`);
    });
});


// Route pour supprimer un participant
app.delete('/participants/:id', (req, res) => {
    const idParticipants = req.params.id_part; // Récupère l'ID depuis les paramètres de la requête

    // Requête SQL pour supprimer un participant
    const del = 'DELETE FROM participant WHERE id = ?';
    connection.query(del, [idParticipants], (err, results) => {
        if (err) {
            console.error('Erreur lors de la suppression du participant: ' + err.stack);
            res.status(500).send('Erreur lors de la suppression du participant');
            return;
        }

        // Vérifier si une ligne a été supprimée
        if (results.affectedRows === 0) {
            return res.status(404).send('Participant non trouvé');
        }

        res.status(200).send('Participant supprimé avec succès');
    });
});



// Demarrer le serveur
app.listen(3002)
console.log("attente de la requette au port 3002")