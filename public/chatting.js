window.onload = function() {

    var messages = [];
    var socket = io.connect('http://localhost:3700');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");
    var JoinChat = document.getElementById("JoinChat");
    var leaveChat = document.getElementById("leaveChat");



    socket.on('oldChats',function(data){
       // if(data.oldChats.theData) {
            //messages.push(data);
            var theHtml = '';
            for(var i=0; i<data.length; i++){
                theHtml += '<b style="margin-left: 0px !important; color: red;">' + data[i].chatName +' ' + ': </b>';
                theHtml += '<b style="margin-left: 0px !important; color: blue;">' +data[i].theChat + ' ';
                theHtml += data[i].chatTime + '<b> <br>';
            }
            content.innerHTML = theHtml;
            content.scrollTop = content.scrollHeight;

    });

    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<b style="margin-left: 0px !important; color: red;">' + (messages[i].sender ? messages[i].sender : 'FSE server') + ': </b>';
                html += '<b style="margin-left: 0px !important; color: blue;">'+messages[i].message + '<b>';
                html += messages[i].time ? messages[i].time :getTimeStamp() + '<br />';
            }
            //alert("second Length "+messages.length)
            content.innerHTML = html;
            content.scrollTop = content.scrollHeight;

        } else {
            console.log("There is a problem:", data);
        }
    });

    

    /*function for getting the current timeStamp*/
    function getTimeStamp() {
    var currentDate = new Date(); 
    var currentYear   = currentDate.getFullYear();
    var currentMonth   = currentDate.getMonth()+1; 
    var currentDay     = currentDate.getDate();
    var currentHour    = currentDate.getHours();
    var currentMinute  = currentDate.getMinutes();
    var currentSecond  = currentDate.getSeconds(); 

    /*Making the variables to be of two numbers*/
    if(currentMonth.toString().length == 1) {
        var currentMonth = '0'+currentMonth;
    }
    if(currentDay.toString().length == 1) {
        var currentDay = '0'+currentDay;
    }   
    if(currentHour.toString().length == 1) {
        var currentHour = '0'+currentHour;
    }
    if(currentMinute.toString().length == 1) {
        var currentMinute = '0'+currentMinute;
    }
    if(currentSecond.toString().length == 1) {
        var currentSecond = '0'+currentSecond;
    }   
    var dateTime = currentYear+'/'+currentMonth+'/'+currentDay+' '+currentHour+':'+currentMinute+':'+currentSecond;   
     return dateTime;
}

    sendButton.onclick = function() {
        if(name.value == "") {
            alert("Please type your name!");
        } 
        else if(content.value==""){
            alert("Please type the message you want to send!")
        }

        else {
            var text = field.value;
            var theTime = getTimeStamp();

            socket.emit('send', { message: text, sender: name.value, time: theTime });
            field.value = "";


        }
    };


    JoinChat.onclick=function(){
        //alert("Stop this");
        document.getElementById("name").disabled = true;

    };

    leaveChat.onclick = function(){
        //alert("i like it");
        document.getElementById("field").disabled = true;

    }

}