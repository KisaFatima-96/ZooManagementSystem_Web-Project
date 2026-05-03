const mongoose = require('mongoose');
const User = require('./Schemas/User');

const DB_URI = 'mongodb+srv://Bilalkhan:Pakistan@cluster1.moct8fi.mongodb.net/ZooManagementSystem';

const seedAdmin = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('Connected to DB');

        const adminExists = await User.findOne({ email: 'admin@zoo.com' });
        if (adminExists) {
            console.log('Admin already exists');
        } else {
            const admin = new User({
                name: 'Zoo Administrator',
                email: 'admin@zoo.com',
                password: 'password123',
                role: 'admin'
            });
            await admin.save();
            console.log('Admin user created: admin@zoo.com / password123');
        }

        const staffExists = await User.findOne({ email: 'staff@zoo.com' });
        if (staffExists) {
            console.log('Staff already exists');
        } else {
            const staff = new User({
                name: 'Zoo Keeper',
                email: 'staff@zoo.com',
                password: 'password123',
                role: 'user'
            });
            await staff.save();
            console.log('Staff user created: staff@zoo.com / password123');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
