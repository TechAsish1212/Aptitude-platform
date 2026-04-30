import express from "express"
import {config} from 'dotenv'
import cors from 'cors'
import connectDB from "./db/db";
import routes from "./routes/index";

const app=express();
config();

const port=process.env.PORT || 4002;

// DB connection
connectDB();

// middleware
app.use(express.json());
app.use(cors({
    origin:process.env.HOST_URL||"*"
}))

app.use('/api',routes);

app.get('/test', (req, res) => {
    res.send('hiii');
});

app.listen(port,()=>{
    console.log(`server started at: ${port}`);
})