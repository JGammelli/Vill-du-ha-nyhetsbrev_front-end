let regTab = document.getElementById("regtab");
let logTab = document.getElementById("logtab");
let regBox = document.getElementById("register");
let loginBox = document.getElementById("login");
let logoutBox = document.getElementById("logout");
let container = document.getElementById("container");
let h1 = document.getElementById("greet");

logoutBox.style.visibility="hidden"; 

// Logg in
document.getElementById("logsub").addEventListener("click", function(){
    LogIn("usr", "psw");
});

function LogIn(usrBox, pswBox){
    event.preventDefault();
    let userName = document.getElementById(usrBox).value;
    let userPsw = document.getElementById(pswBox).value;
    let user = {email: userName, password: userPsw};
    //console.log(user);
    var request = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
    }

    fetch(`http://localhost:3000/api/login/`, request)
    .then(res => res.json())
    .then(user => {
  
        if(user === "wrong"){
            console.log("Wrong email or password!");
        }else{
            window.localStorage.setItem("signedinUser", user);
            document.cookie = "signedIn=true";
            window.localStorage.setItem("signedIn", "true");
            checkStatus();
        }
    })
    .catch(err => {
        console.log('Error is', err)
        h1.innerHTML = ""
        h1.insertAdjacentHTML("beforeend", "Wrong password or email!")
    });
    signedIn();
    checkStatus();


}

// Register new user
document.getElementById("regsub").addEventListener("click", function(){
    let newUser = {email: document.getElementById("inpusr").value, password: document.getElementById("inppsw").value, 
        subscription: document.getElementById("subscribeCheck").checked};
    fetch("http://localhost:3000/newUser",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }, 
        body: JSON.stringify(newUser)
    })
    .then(res => res.json())
    .then(data => {
        //console.log(data)
    });
    h1.innerHTML = "";
    h1.insertAdjacentHTML("beforeend", "you have succesfully created an account");

    LogIn("inpusr", "inppsw");
});


//What shows when signed out
function signedOut(){

    h1.innerHTML = "";
    container.style.visibility="visible";
    logoutBox.style.visibility="hidden";
    loginBox.style.visibility="visible";
    document.getElementById("subBtn").innerHTML = "";
    h1.insertAdjacentHTML("afterbegin", "Hello! You can choose to sign in or to register.");
}

// Press the register tab
regTab.addEventListener("click", function ()
    {
    event.preventDefault();
    regBox.style.visibility="visible";
    loginBox.style.visibility="hidden";

    regTab.style.backgroundColor="rgb(255, 255, 255)";
    logTab.style.backgroundColor="rgb(177, 177, 177)";
});

//  Press the sign in tab
logTab.addEventListener("click", function (){
    event.preventDefault();
    regBox.style.visibility = "hidden";
    loginBox.style.visibility = "visible";

    logTab.style.backgroundColor="rgb(255, 255, 255)";
    regTab.style.backgroundColor="rgb(177, 177, 177)";
});

//Checks if the user's signed in or not
let checkStatus = function(){
    if(window.localStorage.getItem("signedIn") == "true"){
        let id = {id: localStorage.getItem("signedinUser")};
        var request = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(id),
        }
    
        fetch(`http://localhost:3000/getUser/`, request)
        .then(res => res.json())
        .then(data => {
            signedIn();
            h1.insertAdjacentHTML("afterbegin", "Welcome " + data.email + "!");
            
            if(data.subscription == true){
                h1.insertAdjacentHTML("beforeend", "<p>You are subscribed</p>");
                document.getElementById("subBtn").insertAdjacentHTML("beforeend", "<button id='subBtn' class = 'btn click'>Unsubscribe here</button>");
            }else{
                h1.insertAdjacentHTML("beforeend", "<p>You are not subscribed</p>");
                document.getElementById("subBtn").insertAdjacentHTML("beforeend", "<button id='subBtn' class = 'btn click'>Subscribe here</button>");
            }
        })
        .catch(err => {
            console.log('Error is', err);
        });
    }
    else if(window.localStorage.getItem("signedIn") == "false"){
        signedOut();
    }
}

// Subscribe or unsubscribe
document.getElementById("subBtn").addEventListener("click", function(){
    let update = {id: localStorage.getItem("signedinUser")};
    console.log("IM CLICKING THE BTN");
    var request = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(update),
    }
    fetch(`http://localhost:3000/update/`, request)
    .then(res => res.json())
    .then(data => {
        console.log("i'vh come this far");
        console.log(data);
        if(data.subscription === true){
            h1.innerHTML = "";
            document.getElementById("subBtn").innerHTML = "";
            h1.insertAdjacentHTML("afterbegin", "Welcome " + data.email + "!");
            h1.insertAdjacentHTML("beforeend", "<p>You are subscribed</p>");
            document.getElementById("subBtn").insertAdjacentHTML("beforeend", "<button id='subBtn' class = 'btn click'>Unsubscribe here</button>");
        }else{
            h1.innerHTML = "";
            document.getElementById("subBtn").innerHTML = "";
            h1.insertAdjacentHTML("afterbegin", "Welcome " + data.email + "!");
            h1.insertAdjacentHTML("beforeend", "<p>You are not subscribed</p>");
            document.getElementById("subBtn").insertAdjacentHTML("beforeend", "<button id='subBtn' class = 'btn click'>Subscribe here</button>");
        }
        location.reload(); 
    });
});

//What shows when signed in
function signedIn(){
    h1.innerHTML = "";
    container.style.visibility="hidden";
    logoutBox.style.visibility="visible";
    loginBox.style.visibility="hidden";
    regBox.style.visibility ="hidden";
}

//Signing out
document.getElementById("outBtn").addEventListener("click", function (){
    window.localStorage.setItem("signedIn", "false");
    window.localStorage.removeItem("signedinUser");
    checkStatus();
});

checkStatus();