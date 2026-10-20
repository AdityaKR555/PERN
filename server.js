const express = require('express');
const app = express();

const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const { connectDB, connection } = require('./src/config/connection');


require('./src/model/user');

const { frontendRoutes } = require('./src/routes/frontendRoutes');

app.use("/api", frontendRoutes);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});


const shoot = async () => {
    
    await connectDB();

    await connection.sync({ alter: true })

    app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    });  
}

shoot();

