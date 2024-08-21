// Route pour supprimer un participant par son nom
app.delete('/participants', (req, res) => {
    const { name } = req.body; // Récupère le nom depuis le corps de la requête

    if (!name) {
        return res.status(400).send('Nom requis pour supprimer un participant.');
    }

    // Requête SQL pour supprimer un participant
    const sql = 'DELETE FROM participants WHERE name = ?';
    connection.query(sql, [name], (err, results) => {
        if (err) {
            console.error('Erreur lors de la suppression du participant: ' + err.stack);
            res.status(500).send('Erreur lors de la suppression du participant');
            return;
        }

        // Vérifier si des lignes ont été supprimées
        if (results.affectedRows === 0) {
            return res.status(404).send('Participant non trouvé');
        }

        res.status(200).send(`Participant(s) supprimé(s) avec succès`);
    });
});