//  dksingh8957_db_user
//  bJ3RAv2Znyw2x6vN
//  mongodb+srv://dksingh8957_db_user:bJ3RAv2Znyw2x6vN@cluster0.nkcryfl.mongodb.net/

require('dotenv').config();

const express = require('express');
const app = express();

// middleware
const cors = require('cors');
app.use(cors({
    origin: ['http://localhost:5173', 'https://ticket-management-system-2-e7eb.onrender.com'],
    credentials: true
}));
app.use(express.json());

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const mongoose = require('mongoose');
mongoose.connect('mongodb://dksingh8957_db_user:bJ3RAv2Znyw2x6vN@ac-k3j1p5w-shard-00-00.nkcryfl.mongodb.net:27017,ac-k3j1p5w-shard-00-01.nkcryfl.mongodb.net:27017,ac-k3j1p5w-shard-00-02.nkcryfl.mongodb.net:27017/?ssl=true&replicaSet=atlas-x40d18-shard-0&authSource=admin&appName=Cluster0')
.then((res) => { console.log("DB CONNECTED") })
.catch((err) => { console.log(err) })

const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

const ticketRoutes = require('./routes/ticketRoutes');
app.use('/api', ticketRoutes);

const reportRoutes = require('./routes/reportRoutes');
app.use('/api', reportRoutes);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`SERVER IS CONNECTED AT PORT: ${PORT}`);
});

