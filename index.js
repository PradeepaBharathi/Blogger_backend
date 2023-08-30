import express from "express";

import { user_router } from "./router/user_router.js";
import { blog_router } from "./router/blog_router.js";
import cors from 'cors'

const PORT = process.env.PORT;

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // Update with your client's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies and headers to be included
}))
app.use(express.json())

app.use('/', user_router)
app.use('/', blog_router)

app.get('/', (req, res) => {
    res.send("first")
})

app.listen(PORT, () => {
    console.log(`Server connceted to PORT ${PORT}`)
})

