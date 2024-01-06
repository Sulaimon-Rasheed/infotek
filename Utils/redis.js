const redis = require ("redis")

let client = redis.createClient(6379)
.on("error", (err)=>{
    console.log("Redis connection Error:" + err.message)
}).connect()
  
  module.exports = client //env | grep HOSTNAME
// redis-cli -h <ip_address> -p <port_number>
