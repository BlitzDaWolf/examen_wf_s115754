var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient
var db;

MongoClient.connect('mongodb://localhost:27017', (err, database) => {
  if (err) return console.log(err)
  db = database.db('exam')
})

/* GET ALL students */
router.get('/', (req, res) => {
  db.collection('students').find().toArray((err, result) => {
    if (err) return
    res.render('list.ejs', { students: result })
  })
})

/* SHOW ADD student FORM */
router.get('/add', (req, res) => {
   res.render('add.ejs', {})
})

/* ADD student TO DB */
router.post('/add', (req, res) => {  
  var query = { name: { $ne:req.body.name }}
  db.collection('students').findOne(query, (err, result) => {
    if(err) return;
    db.collection('students').insertOne(req.body, (err2, result2) => {
      if (err2) return;
      res.redirect('/')
    })
  });

  /*db.collection('students').insertOne(req.body, (err, result) => {
    if (err) return
    res.redirect('/')
  })*/
})

/* SEARCH FORM */
router.get('/search', (req, res) => {
   res.render('search.ejs', {})
})

/* FIND A student */
router.post('/search', (req, res) => {
 var query = { name: req.body.name }
 db.collection('students').findOne(query, (err, result) => {
   if (err) return
   if (result == '')
       res.render('search_not_found.ejs', {})
   else
       res.render('search_result.ejs', { student: result })
 });
})

/* DELETE A student */
router.post('/delete', (req, res) => {
  db.collection('students').findOneAndDelete({ id: req.body.id }, (err, result) => {
    if (err) return res.send(500, err)
    res.redirect('/')
  })
})

module.exports = router;