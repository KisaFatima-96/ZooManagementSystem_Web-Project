const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./Schemas/User');

const mongoURI = 'mongodb+srv://Bilalkhan:Pakistan@cluster1.moct8fi.mongodb.net/ZooManagementSystem';

async function createAdmin(email, password, name) {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB...');

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists! Updating role to admin...');
      existingUser.role = 'admin';
      await existingUser.save();
      console.log('User updated to Admin successfully.');
    } else {
      // Create new admin
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new User({
        name,
        email,
        password: hashedPassword,
        role: 'admin'
      });
      await newAdmin.save();
      console.log(`Admin created successfully: ${email}`);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
}

// Change these values to create your own admin
createAdmin('admin2@zoo.com', 'admin123', 'System Admin');
