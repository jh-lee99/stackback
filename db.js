import mongoose from 'mongoose';

// 함수화
mongoose.connect('mongodb+srv://jun99h1219:kad3TpD8kuS7vIZB@examplecluster.jkyeuhi.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); 

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});