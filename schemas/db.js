import mongoose from 'mongoose';

const connect = async () => {
  if(process.env.NODE_ENV !== 'production' ) {
    mongoose.set('debug', true)
  }

  try {
    await mongoose.connect('mongodb+srv://jun99h1219:kad3TpD8kuS7vIZB@examplecluster.jkyeuhi.mongodb.net/?retryWrites=true&w=majority', {
    dbName: 'Project',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    });
    console.log('몽고디비 연결 성공');
  } catch (error) {
  console.log('몽고디비 연결 오류', error);
  }
};

mongoose.connection.on('error', (error) => {
  console.error('몽고디비 연결 에러', error);
});
mongoose.connection.on('disconnected', () => {
  console.error('몽고디비 연결이 종료되었습니다. 연결을 재시도합니다.');
  connect();
});

export default connect;