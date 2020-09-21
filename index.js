require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');


const db = require('./models/index');
const errorHandler = require('./handlers/error');
const userRoutes = require('./routes/auth');
const urlRoutes = require('./routes/url');
const {loginRequired,ensureCorrectUser} = require('./middleware/auth');

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth',userRoutes);
app.use('/api/:id/url',loginRequired,ensureCorrectUser, urlRoutes);

app.use((req,res,next)=>{
    return next({
        status: 404,
        message: "Route not found"
    });
});

app.use(errorHandler);

app.listen(port,()=>{
    console.log('server is running on port',port);
})