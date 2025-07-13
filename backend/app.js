const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');

const workflowRoutes  = require('./routes/workflowRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.use('/api/workflows', workflowRoutes); // REST endpoint

app.use(errorMiddleware);                 // must be last
module.exports = app;
