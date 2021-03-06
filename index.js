const express = require('express')
const path = require('path')
const csurf = require('csurf')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const homeRoutes = require('./routes/home')
const ordersRouters = require('./routes/orders')
const coursesRoutes = require('./routes/courses')
const addRoutes = require('./routes/add')
const cardRoutes = require('./routes/card')
const authRoutes = require('./routes/auth')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')

const MONGODB_URI = 'mongodb+srv://serhii:CiBsyRsDylkZmXCj@cluster0.choq7.mongodb.net/shop'
const app = express()
const hbs = exphbs.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: 'main',
  extname: 'hbs'
})

const store = new MongoStore({
  collection: 'session',
  uri: MONGODB_URI
})

app.engine('hbs', hbs.engine)

app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false,
  store
}))
app.use(csurf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/auth', authRoutes)
app.use('/courses', coursesRoutes)
app.use('/add', addRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRouters)

const PORT = process.env.PORT || 3000

async function start() {
  try {
     await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()


