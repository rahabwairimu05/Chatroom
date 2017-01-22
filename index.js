
/*importing the express and defining an object of application to use */
var myExpress = require("express");
var myApp = myExpress();
var port = 3700;
var mysql = require("mysql");



/*settings inorder to use express and  defining the engine and the path where the html page is */
myApp.set('views', __dirname + '/thePages');
myApp.set('view engine', 'jade');
myApp.engine('jade', require('jade').__express);


myApp.get("/", function(req, res){
	res.render("chatWeb");
});

/*creating a route to the public directory*/
myApp.use(myExpress.static(__dirname + '/public'));

/*Listening to the port assigned, where the project is executing from*/
/*using the socket.io to get the entire data, defining an object of socket.io class*/

var theSocketIo = require('socket.io').listen(myApp.listen(port));

var allChats =[];
var IsOldChats = false;


//Creating the connection to the database
var poolChats = mysql.createPool({
	connectioinLimit:100,
	host :"localhost",
	user :"root",
	password:"",
	database:"chatapp",
});


/*creating the socket connection handler*/
theSocketIo.sockets.on('connection', function(Socket){
	Socket.emit('message', { message: 'Welcome to FSE chatroom, we missed you!!'});
	
	Socket.on('send', function(data){
		var theChat= { chatName:data.sender, theChat:data.message,chatTime:data.time};
		poolChats.query('INSERT INTO chats SET ?', theChat, function(err,res){
		  if(err) throw err;

		 });
		poolChats.query('SELECT * FROM chats',function(err,theData){
	  		if(err) throw err;
	  		console.log('Data received from Db:\n');
	  		theSocketIo.sockets.emit('oldChats',theData);
		});
		//theSocketIo.sockets.emit('message', data);
	});

});

/*getting the information put on the chat*/ 

console.log("Listening on port " + port);