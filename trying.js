if (!IsOldChats) {
        // Initial app start, run db query
        poolChats.query('SELECT * FROM chats')
            .on('result', function(data){
                // Push results onto the notes array
                allChats.push(data)
            })
            .on('end', function(){
                // Only emit notes after query has been completed
                theSocketIo.sockets.emit('oldChats', allChats);
            })
 
         IsOldChats = true;
        console.log(allChats[1]);
    } else {
        // Initial notes already exist, send out
        theSocketIo.sockets.emit('oldChats', allChats);
    }



poolChats.query('SELECT * FROM chats',function(err,theData){
  if(err) throw err;

  console.log('Data received from Db:\n');
  console.log(theData);
});
