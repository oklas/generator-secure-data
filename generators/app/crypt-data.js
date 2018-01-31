const fs = require('fs');
const async = require('async');
const crypto = require('crypto');
const ALGORITHM = 'aes-256-gcm';
const UNIQ_SIZE = 32;
const PBKDF2_ITER = 100000;
const PBKDF2_HASH = 'sha512';
const DATA_FORMAT = 'base64';

function loadFile(filename, callback) {
  const readStream = fs.createReadStream(filename);
  let data = new Buffer('');
  readStream
    .on('data', chunk => {
      data = Buffer.concat([data, chunk]);
    })
    .on('end', () => {
      callback(undefined, data);
    })
    .on('error', err => {
      callback(err);
    });
}

function prepareVectors(task, callback) {
  const salt = Buffer.alloc(UNIQ_SIZE);
  const iv = Buffer.alloc(UNIQ_SIZE);
  if (!task.password) throw Error('no password is in task');

  async.parallel(
    [
      callback => {
        crypto.randomFill(salt, (err, buf) => {
          callback(err, buf);
        });
      },
      callback => {
        crypto.randomFill(iv, (err, buf) => {
          callback(err, buf);
        });
      }
    ],
    (err, results) => {
      task.salt = results[0];
      task.iv = results[1];
      if (err) return callback(err);
      crypto.pbkdf2(
        task.password,
        task.salt,
        PBKDF2_ITER,
        UNIQ_SIZE,
        PBKDF2_HASH,
        (err, key) => {
          task.key = key;
          callback(err, task);
        }
      );
    }
  );
}

function encrypt(task) {
  var cipher = crypto.createCipheriv(ALGORITHM, task.key, task.iv);
  task.cipher = cipher.update(task.data, '', DATA_FORMAT);
  task.cipher += cipher.final(DATA_FORMAT);
  task.authTag = cipher.getAuthTag();
}

module.exports = function(task, callback) {
  if (!task.dataPath) throw new Error('no dataPath is provided');

  if (!task.password) throw new Error('no password is provided');

  task.algorithm = ALGORITHM;
  task.format = DATA_FORMAT;
  task.pbkdf2Iters = PBKDF2_ITER;
  task.pbkdf2Hash = PBKDF2_HASH;
  task.keyLength = UNIQ_SIZE;

  async.parallel(
    [
      callback => loadFile(task.dataPath, callback),
      callback => prepareVectors(task, callback)
    ],
    (err, results) => {
      if (err) return callback(err);
      task.data = results[0];
      encrypt(task);
      callback(undefined, task);
    }
  );
};
