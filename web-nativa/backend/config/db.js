const mongoose = require('mongoose');

const connectDB = async (uri) => {
  // si no se pasa uri, usar variable de entorno o fallback a la BD 'libros'
  const connectionString = uri || process.env.MONGO_URI || 'mongodb://localhost:27017/libros';

  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB conectado a', connectionString);

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB desconectado');
    });

  } catch (err) {
    console.error('Error conectando a MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
