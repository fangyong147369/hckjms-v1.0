'use strict';

/**
 * Created by pwx on 2016/8/4.
 */
const redis = require('redis');
const redisCli = redis.createClient(com.env.redis.port, com.env.redis.host);

exports.checkFrequentAction =function*(key,pexpire){
    if(typeof pexpire == 'function'){
        pexpire = null;
    }
    console.log("checkFrequentAction-key:"+key)
    console.log("checkFrequentAction-pexpire:"+pexpire)
    return new Promise(( resolve, reject ) => {
        pexpire = pexpire || 1000;
        key = 'Frequent-'+key;
        redisCli.setnx(key, 'ok', (err, res) => {
            if (res == 1) {
                redisCli.pexpire(key, pexpire);
                resolve(null)
            }
            else{
                resolve('请勿频繁请求，稍后再试');
            }
        });
    })
}

exports.set = function*(key,value,pexpire){
    if(typeof pexpire == 'function'){
        pexpire = null;
    }
    console.log("set-key:"+key)
    console.log("set-value:"+value)
    return new Promise(( resolve, reject ) => {
        pexpire = pexpire || 1000;
        redisCli.set(key, JSON.stringify(value), (err, res) => {
            if (res == 'OK') {
                redisCli.pexpire(key, pexpire);
                resolve(null)
            }else{
                resolve(err);
            }
        });
    })
}

exports.get = function*(key,pexpire){
    if(typeof pexpire == 'function'){
        pexpire = null;
    }
    console.log("get-key:"+key)
    console.log("get-pexpire:"+pexpire)
    return new Promise(( resolve, reject ) => {
        redisCli.get(key,(err, res) => {
            if (!err && res) {
                let dta=null;
                try {
                    dta = JSON.parse(res);
                } catch (e) {
                    dta = null;
                }
                resolve(dta);
            }else{
                resolve(err);
            }
        });
    })
}