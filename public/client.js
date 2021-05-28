const socket = io();
let name = '';
let typing = false;


let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");

do {
    name = prompt("Please enter your name: ");


    // SEnd to server THE username
    socket.emit("bago join", name);



} while (!name);

// IF THE TEXT AREA IS ON KEYUP THEN:
textarea.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        sendMessage(e.target.value);
    }
});

//receiving bago join from server to display
socket.on("bago join", (data) => {


    if (data == name) {
        $(".message__area").append(
            `<p class="text-center">You have join the room</p>`
        );


        //DISPLAYING username of OTHER USER JOINING THE CHATROOM.
    } else {
        $(".message__area").append(
            `<p class="text-center">${data} have join the room</p>`
        );
        scrollToBottom();

    }

});



//DISPLAYING THE numberofusers with its data serves as the COUNT OF THE USER GIKAN sA SERVER
socket.on("numberofusers", (data) => {
    $("#contacts").html("")
    socket.emit("numberofusers", data)
    $(".message__area").append(`<p class="text-center">${data} Participant</p>`);

    //DISPLAY EACH USERS
    for (var i = 0; i < data.length; i++) {

        $("#contacts").append(`<ul class ='hehe'><li class='contact active'><div class='wrap'><span class='contact-status busy'></span><img src='http://emilcarlsson.se/assets/harveyspecter.png' alt='' /><div class='meta'> <i class='fa fa-rocket'><p class='name h5'>${data[i]}</p></i></div></div></li></ul>`);

        if (data == name) {

        }
        // IF THE OTHER USER WAS STOP ON TYPING
        else {


        }
    }
})


//ON TYPING
textarea.addEventListener("keydown", (stop) => {
    socket.emit("usertyping", name); //GOING TO SERVER
});

// DISPLAYING THE FUNCTION USER IS TYPING GIKAN SA SERVER
socket.on("usertyping", (data) => {

    // other users " is typing".
    if (data != name) {
        document.getElementById("typing").innerHTML = `<p class="text-center ontype">${data} is typing</p>`;
    }


});




//STOP TYPING
textarea.addEventListener("keyup", (stop) => {
    socket.emit("userstoptyping", name); //GOING TO SERVER
});



// DISPLAYING THE FUNCTION USER IS STOP TYPING GIKAN SA SERVER
socket.on("userstoptyping", (data) => {
    if (data == name) {

    }
    // IF THE OTHER USER WAS STOP ON TYPING
    else {
        setTimeout(function() {
            document.getElementById("typing").innerHTML = ``;
        }, 1000);
    }
});

socket.on("userisleaving", (data) => {
    scrollToBottom();

})



//HERE IS THE FUNCTION WHICH IDENTIFY IF THE USER IS LEAVING THE CHATROOM
window.addEventListener('beforeunload', function(e) {
    socket.emit("leaving", name); // SEND TO SERVER SAYING THAT THE USER IS LEAVING

    e.preventDefault();
    e.returnValue = '';
});



//LEAVING 
//HERE THE SOCKET IS ON GIKAN SA SERVER WITH THE TOPIC leaving AND WILL EXECUTE THE CONDITION BELOW
socket.on("leaving", (data) => {

    if (data == name) {



    } else {

        //DISPLAY THE USER IS LEAVING THE CHATROOM
        scrollToBottom();
        $(".message__area").append(`<p class="text-center ontype">${data} Leave the Chat Room</p>`);

    }

});




function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim(),
    };
    // Append
    appendMessage(msg, "outgoing");
    textarea.value = "";
    scrollToBottom();

    // Send to server
    socket.emit("message", msg);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement("div");
    let className = type;
    mainDiv.classList.add(className, "message");

    let markup = `
    
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}

// Recieve messages
socket.on("message", (msg) => {
    appendMessage(msg, "incoming");
    scrollToBottom();
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}