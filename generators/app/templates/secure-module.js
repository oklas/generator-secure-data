const crypto = require('crypto');

module.exports = function(password) {
  const algorithm = "<%- algorithm %>";
  const format = "<%- format %>";
  const pbkdf2Iters = <%- pbkdf2Iters %>;
  const pbkdf2Hash = "<%- pbkdf2Hash %>";
  const keyLength = <%- keyLength %>;
  const salt = "<%- salt.toString(format) %>";
  const iv = "<%- iv.toString(format) %>";
  const cipher =
    <%- cipher.match(/.{1,64}/g).map(t=>`"${t}"`).join("\n  + ") %>;

  const result = new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      Buffer.from(salt, format),
      pbkdf2Iters, keyLength, pbkdf2Hash,
      (err, key) => {
         if(err)
           return reject(err);

         let data = undefined;
         try {
           const decipher = crypto.createDecipheriv(
             algorithm, key, Buffer.from(iv, format)
           );
           <% if(json) { %>
             data = decipher.update(cipher, format, 'utf8');
             data = JSON.parse(data);
           <% } else { %>
             data = decipher.update(cipher, format);
           <% } %>
         } catch(err) {
            return reject(err)
         }

         resolve(data)
      }
    );
  })

  return result;
}