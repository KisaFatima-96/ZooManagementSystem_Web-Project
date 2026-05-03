const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use('/uploads', express.static('uploads'));


app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://Bilalkhan:Pakistan@cluster1.moct8fi.mongodb.net/ZooManagementSystem', {
    
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB', err));

// Routes
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/animals', require('./Routes/animals.js'));
app.use('/api/staff', require('./Routes/staffroute.js'));
app.use('/api/tasks', require('./Routes/tasksroute.js'));
app.use('/api/enclosures', require('./Routes/enclosureRoute.js')); // NEW
app.use('/api/payments', require('./Routes/paymentRoute.js')); // NEW
app.use('/api/documents', require('./Routes/documentRoute.js')); // NEW
app.use('/api/visitors', require('./Routes/visitorroute.js'));
app.use('/api/feeding', require('./Routes/feedingRoute.js'));
app.use('/api/support', require('./Routes/supportRoute.js'));
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
