const mongoose = require('mongoose');
const app = require('./app');
const http = require('http');


const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;


mongoose.connect(MONGO_URI).then(() => {
    const server = http.createServer(app);


    // Start server
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

