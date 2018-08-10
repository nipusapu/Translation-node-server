
var request = require('request');
const Translate = require('@google-cloud/translate');
const projectId = 'translation-project-190614';



const translate = new Translate({
  projectId: projectId,
  key:'AIzaSyDAal5Y10lkPLZbvcpH2v9lGU_ZK_kLH28',
  keyFilename:'C:\Users\Kniip\AppData\Roaming\gcloud\application_default_credentials.json',
});

module.exports = (io, http) => {

  var clients = [];
  usrs={};

  io.on('connection', (socket) => {

    socket.on('add-message', (message, username) => {
     var trans='';
     const target='si';
     translate.translate(message, target).then(results => {
     var translations = results[0];
     translations = Array.isArray(translations)? translations: [translations];
     translations.forEach(function (translation){
     trans=translation;
     // console.log(`${text[i]} => (${target}) ${translation}`);
    });
    
    io.emit('message', { type: 'new-message', text:trans, username: username });
  })
  .catch(err => {
    console.error('ERROR:', err);
  });

      
    });

    socket.on('saveUser', (username) => {
      if (username in usrs){
      }
      else{
        socket.username=username;
        io.emit('saveUser', { username: socket.username });
        usrs[socket.username]=socket;
        io.emit('users', { type: 'users', users: Object.keys(usrs) });
      }
       
    });

    socket.on('users', () => {
      io.emit('users', { type: 'users', users: Object.keys(usrs) });
    });
    function updateusers(){
      io.emit('users', { type: 'users', users: Object.keys(usrs) });
    }
    

    socket.on('exitSession', (username) => {
      const index = clients.indexOf(username);
      delete usrs[socket.username];
      updateusers();
     // clients.splice(index, 1);
    });

    socket.on('sinhala-translation-message',(message)=>{
      var trans='';
      const target='si';
      translate.translate(message, target).then(results => {
      var translations = results[0];
      translations = Array.isArray(translations)? translations: [translations];
      translations.forEach(function (translation){
      trans=translation;
      // console.log(`${text[i]} => (${target}) ${translation}`);
     });
     
     io.emit('sinhala-message', trans);})
     .catch(err => {
     console.error('ERROR:', err);
      });

  });


  socket.on('english-translation-message',(message)=>{
    var trans='';
    const target='en';
    translate.translate(message, target).then(results => {
    var translations = results[0];
    translations = Array.isArray(translations)? translations: [translations];
    translations.forEach(function (translation){
    trans=translation;
    // console.log(`${text[i]} => (${target}) ${translation}`);
   });

   io.emit('english-message',trans);})
   .catch(err => {
   console.error('ERROR:', err);
    });

});


  });

  return io;
}
