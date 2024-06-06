require('dotenv').config({ path: `${process.cwd()}/.env` });

const express =  require('express');
const authRouter = require('./routes/authRoute');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'Success',
        message: 'RESTful APIs are working'
    });
});

// all router

app.use('/api/v1/auth', authRouter);

app.use('*', (req, res, next) => {
    res.status(404).json({
        status: 'Fail',
        message: 'Route not found'
    });
});

const PORT = process.env.APP_PORT;

app.listen(PORT, () => {
    console.log('Server up and running', PORT);
});