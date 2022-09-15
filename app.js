const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const path = require('path')
const db = require('./db/connection')
const bodyParser = require('body-parser')
const Job = require('./models/Job')
const { title } = require('process')
const Sequelize = require('sequelize')
const { query } = require('express')
const Op = Sequelize.Op
const PORT = 3000

app.listen(PORT, function() {
    console.log(`Running on port ${PORT}`)
})

// body parser
app.use(bodyParser.urlencoded({ extended: false }))

// handle bars
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

//static folder
app.use(express.static(path.join(__dirname, 'public')))

// data base connection
db
  .authenticate()
  .then(() => {
    console.log('Database connected')
  })
  .catch(err => {
    console.log('Error connecting: '+err)
  })

// routes
app.get('/', (req, res) => {
  let search = req.query.job
  let query = '%'+search+'%'

  if (!search) {
    Job.findAll({order: [
      ['createdAt', 'DESC']
    ]})
    .then(jobs => {
      res.render('index', {
        jobs
      }) 
    })
    .catch(err => console.log('Algo deu errado: '+ err))
  } else {
    Job.findAll({
      where: {title: {[Op.like]: query}},
      order: [
      ['createdAt', 'DESC']
    ]})
    .then(jobs => {
      res.render('index', {
        jobs, search
      }) 
    })
    .catch(err => console.log('Algo deu errado: '+ err))
  }
  
})

// jobs routes
app.use('/jobs', require('./routes/jobs'))