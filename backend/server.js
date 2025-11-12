const express=require('express');
const cors=require('cors');
const {sequelize}=require('./models');
require('dotenv').config();

const app=express();
app.use(cors({origin:'http://localhost:3000',credentials:true}));
app.use(express.json());

app.use('/api/auth',require('./routes/auth'));
app.use('/api/posts',require('./routes/posts'));
app.use('/api/categories',require('./routes/categories'));

const PORT=process.env.PORT||3001;
sequelize.sync().then(()=>app.listen(PORT,()=>console.log(`Server running on port ${PORT}`)));
