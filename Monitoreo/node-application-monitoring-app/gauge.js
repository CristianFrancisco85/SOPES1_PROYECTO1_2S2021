const promClient = require('prom-client');
const fetch = require('node-fetch');


var UBUNTU = async function (option){
    var respuesta ;
    switch(option){
        case 1:
            const url1 = `http://34.70.73.150:3000/cpu`
            var respuesta1  = await fetch (url1)
            var response1 = await respuesta1.json();
            return response1;   
        case 2:
            const url = `http://34.70.73.150:3000/ram`
            var respuesta  = await fetch (url)
            var response = await respuesta.json();
            return response;  
    }  
}

var DEBIAN = async function (option){
    var respuesta ;
    switch(option){
        case 1:
            const url1 = `http://34.69.155.25:3000/cpu`
            var respuesta1  = await fetch (url1)
            var response1 = await respuesta1.json();
            return response1;   
        case 2:
            const url = `http://34.69.155.25:3000/ram`
            var respuesta  = await fetch (url)
            var response = await respuesta.json();
            return response;  
    }  
}

var CENTOS = async function (option){
    var respuesta ;
    switch(option){
        case 1:
            const url1 = `http://34.135.158.181:3000/cpu`
            var respuesta1  = await fetch (url1)
            var response1 = await respuesta1.json();
            return response1;   
        case 2:
            const url = `http://34.135.158.181:3000/ram`
            var respuesta  = await fetch (url)
            var response = await respuesta.json();
            return response;  
    }  
}

const gauge = async (register) => {
//----------------Métricas Ubuntu
    const total_ubuntu = new promClient.Gauge({
        name: 'node_total_ubuntu',
        help: 'This is my gauge',
        labelNames: ['code'],
        buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
    });

    setInterval(() => {
        UBUNTU(2).then(val=>total_ubuntu.set(val.total));
    }, 100);

    register.registerMetric(total_ubuntu);


    const en_uso_ubuntu = new promClient.Gauge({
    name: 'node_en_uso_ubuntu',
    help: 'This is my gauge',
    labelNames: ['code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
    });

    setInterval(() => {
        UBUNTU(2).then(val=>en_uso_ubuntu.set(val.en_uso));
    }, 100);

    register.registerMetric(en_uso_ubuntu);

    const libre_ubuntu = new promClient.Gauge({
    name: 'node_libre_ubuntu',
    help: 'This is my gauge',
    labelNames: ['code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
    });

    setInterval(() => {
        UBUNTU(2).then(val=>libre_ubuntu.set(val.libre));
    }, 100);

    register.registerMetric(libre_ubuntu);

    const procesos_ubuntu = new promClient.Gauge({
    name: 'node_procesos_ubuntu',
    help: 'This is my gauge',
    labelNames: ['code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
    });

    setInterval(() => {
        UBUNTU(1).then(val=>procesos_ubuntu.set(val.procesos));
    }, 100);

    register.registerMetric(procesos_ubuntu);
//----------------Métricas DEBIAN
    const total_debian = new promClient.Gauge({
        name: 'node_total_debian',
        help: 'This is my gauge',
        labelNames: ['code'],
        buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
    });
    
    setInterval(() => {
        DEBIAN(2).then(val=>total_debian.set(val.total));
    }, 100);
    
    register.registerMetric(total_debian);
    
    
    const en_uso_debian = new promClient.Gauge({
    name: 'node_en_uso_debian',
    help: 'This is my gauge',
    labelNames: ['code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
    });
    
    setInterval(() => {
        DEBIAN(2).then(val=>en_uso_debian.set(val.en_uso));
    }, 100);
    
    register.registerMetric(en_uso_debian);
    
    const libre_debian = new promClient.Gauge({
    name: 'node_libre_debian',
    help: 'This is my gauge',
    labelNames: ['code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
    });
    
    setInterval(() => {
        DEBIAN(2).then(val=>libre_debian.set(val.libre));
    }, 100);
    
    register.registerMetric(libre_debian);
    
    const procesos_debian = new promClient.Gauge({
    name: 'node_procesos_debian',
    help: 'This is my gauge',
    labelNames: ['code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
    });
    
    setInterval(() => {
        DEBIAN(1).then(val=>procesos_debian.set(val.procesos));
    }, 100);
    
    register.registerMetric(procesos_debian);

//----------------Métricas CENTOS
    const total_centos = new promClient.Gauge({
        name: 'node_total_centos',
        help: 'This is my gauge',
        labelNames: ['code'],
        buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
    });

    setInterval(() => {
        CENTOS(2).then(val=>total_centos.set(val.total));
    }, 100);

    register.registerMetric(total_centos);


    const en_uso_centos = new promClient.Gauge({
    name: 'node_en_uso_centos',
    help: 'This is my gauge',
    labelNames: ['code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
    });

    setInterval(() => {
        CENTOS(2).then(val=>en_uso_centos.set(val.en_uso));
    }, 100);

    register.registerMetric(en_uso_centos);

    const libre_centos = new promClient.Gauge({
    name: 'node_libre_centos',
    help: 'This is my gauge',
    labelNames: ['code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
    });

    setInterval(() => {
        CENTOS(2).then(val=>libre_centos.set(val.libre));
    }, 100);

    register.registerMetric(libre_centos);

    const procesos_centos = new promClient.Gauge({
    name: 'node_procesos_centos',
    help: 'This is my gauge',
    labelNames: ['code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
    });

    setInterval(() => {
        CENTOS(1).then(val=>procesos_centos.set(val.procesos));
    }, 100);

    register.registerMetric(procesos_centos);
};

module.exports = { gauge };
