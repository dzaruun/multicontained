const keys = require('./keys'),
      redisConnector = require('redis');

const redisClient = redisConnector.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: _=>1000
});
const subscription = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}
subscription.subscribe("insert");
subscription.on("message", (channel, message)=>{
  redisClient.hset("values", message, fib(parseInt(message))); 
});