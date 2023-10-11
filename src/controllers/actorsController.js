const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


module.exports = {
    'list': (req, res) => {
        db.Actor.findAll({
            
        })
            .then(actors => {
                // res.json(movies[0]) podemos ver que nos trae el genero 
                res.render('actorList.ejs', {actors})
            })
    },
    'detail': (req, res) => {
        db.Actor.findByPk(req.params.id, { include: 'movies' })
            .then(actor => {
                res.render('actorsDetail.ejs', { actor });
            })
            .catch(error => {
                console.error('Error:', error);
                res.status(500).send('Error fetching actor details');
            });
    },
    
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll()
            .then(function (allGenres){
                return res.render('actorsAdd',{allGenres})
            })
    },
    create: async function (req, res) {
        try {
            const newActor = await db.Actor.create(req.body);
            if (newActor) {
                res.redirect('/actors'); // Redirige a la lista de actores después de agregar el nuevo actor.
            } else {
                res.status(500).send('Error creating actor');
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Error creating actor');
        }
    
    },
    edit: async function (req, res) {
        await db.Actor.findByPk(req.params.id, { include: 'movies' })
            .then(async function (actor) {
                if (actor) {
                    return res.render('actorsEdit', {
                        actor: actor
                    });
                } else {
                    res.status(404).send('Actor not found');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                res.status(500).send('Error fetching actor for editing');
            });
    },
    
    update: async function (req, res) {
        try {
            const actorId = req.params.id;
            const updatedActor = await db.Actor.update(req.body, { where: { id: actorId } });
    
            if (updatedActor[0] === 1) {
                res.redirect('/actors'); // Redirige a la lista de actores después de la actualización.
            } else {
                res.status(404).send('Actor not found');
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Error updating actor');
        }
    },
    
    delete: function (req, res) {
        db.Actor.findByPk(req.params.id)
            .then(function (actor) {
                if (actor) {
                    res.render('actorsDelete', { actor });
                } else {
                    res.status(404).send('Actor not found');
                }
            })
            .catch(function (error) {
                console.error('Error:', error);
                res.status(500).send('Error fetching actor for deletion');
            });
    },
    
    destroy: function (req, res) {
        const actorId = req.params.id;
    
        db.Actor.destroy({ where: { id: actorId } })
            .then(function (deletedActorCount) {
                if (deletedActorCount === 1) {
                    res.redirect('/actors');
                } else {
                    res.status(404).send('Actor not found');
                }
            })
            .catch(function (error) {
                console.error('Error:', error);
                res.status(500).send('Error deleting actor');
            });
    }
    
    
}
