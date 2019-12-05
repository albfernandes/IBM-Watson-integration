const cluster = require ('cluster');
const os = require('os');
require('dotenv').config();
const CPUS = os.cpus();

if (cluster.isMaster) {

    const appcron = require("./app/services/cron");

    appcron.startRoutine();

    CPUS.forEach(function(){
        cluster.fork()
    });

    cluster.on("listening", worker => {
        console.log("cluster %d conected", worker.process.pid);
    });

    cluster.on("disconnect", worker => {
        console.log("cluster %d desconected", worker.process.pid);
    });

    cluster.on("exit", function(worker)  {
        console.log("cluster %d down", worker.process.pid);
        cluster.fork();
    });

} else {
    require('./app/server');
}