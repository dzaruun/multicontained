const keys = require('./keys'),
      expressLib = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      redisConnector = require('redis');

const wserver = expressLib();
wserver.use(cors());
wserver.use(bodyParser.json());

//postgress client setup
const { Pool } = require('pg');
const pgClient = new Pool({
    user:keys.pgUser,
    host:keys.pgHost,
    database:keys.pgDatabase,
    password:keys.pgPassword,
    port:keys.pgPort
});
pgClient.on('error', _=>console.log('Lost postgress connection'));
pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
        .catch(err=>console.log(err));

// Setup redis
const redisClient = redisConnector.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: _=>1000
  });
  const redisPublisher = redisClient.duplicate();

  wserver.get('/', (req,res)=>res.send('Labs'));
  wserver.get('/values/all', async (req,res)=>{
    const values = await pgClient.query('SELECT * from values');
    res.send(values.rows);
  });
  wserver.get('/values/current', async (req,res)=>{
    redisClient.hgetall('values', (err,values)=>{
      res.send(values);
    })
  });
  wserver.post('/values', async (req, res)=>{
      const ix = req.body.index;
      if (parseInt(ix) > 40) {
        return res.status(422).send('Per didelis indeksas');
      }
      redisClient.hset("values", ix, 'Still Waiting');
      redisPublisher.publish("insert", ix);
      pgClient.query('INSERT INTO values(number) VALUES($1)', [ix]);
      res.send({working:true});
  });
  wserver.listen(5000, _=>console.log('Klausausi is porto 5000'));