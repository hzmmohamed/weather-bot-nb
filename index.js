"use strict";
const NandBox = require("nandbox-bot-api/src/NandBox");
const Nand = require("nandbox-bot-api/src/NandBoxClient");
const { default: Axios } = require("axios");
const NandBoxClient = Nand.NandBoxClient;
const WEATHERAPI_KEY = 'e2ae71463a5c7c80aeb149ec9d8a26fd'
 
const TOKEN = "90091783773539711:0:QY6Q8KLe3hwSMrRGMDbLW3qB1Fdlbr";
const config = {
    URI: "wss://d1.nandbox.net:5020/nandbox/api/",
    DownloadServer: "https://d1.nandbox.net:5020/nandbox/download/",
    UploadServer: "https://d1.nandbox.net:5020/nandbox/upload/"
}
 
 
var client = NandBoxClient.get(config);
var nandbox = new NandBox();
var nCallBack = nandbox.Callback;
var api = null;
 
nCallBack.onConnect = (_api) => {
    // it will go here if the bot connected to the server successfuly 
    api = _api;
    console.log("Authenticated");
}

nCallBack.onReceive = incomingMsg => {
    console.log("Message Received");
    if (incomingMsg.isLocationMsg()) {
        const chatId = incomingMsg.chat.id
        const loc = incomingMsg.location
        Axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${loc.latitude}&lon=${loc.longitude}&appid=${WEATHERAPI_KEY}`)
        .then(res => {
            const message = `Weather at this location:
            ${res.data.weather[0].main}
            Temp: ${(res.data.main.temp - 273).toPrecision(4)} °C
            Humidity: ${res.data.main.humidity}%`
            console.log(message)
            api.sendText(chatId, message)
        })
        .catch(err => {console.log(err.message)
        api.sendText(chatId, "Something went wrong. I couldn't fetch the weather data.")})
    }
 
}
 
// implement other nandbox.Callback() as per your bot need
nCallBack.onReceiveObj = obj => console.log("received object: ", obj);
nCallBack.onClose = () => console.log("ONCLOSE");
nCallBack.onError = () => console.log("ONERROR");
nCallBack.onChatMenuCallBack = chatMenuCallback => { }
nCallBack.onInlineMessageCallback = inlineMsgCallback => { }
nCallBack.onMessagAckCallback = msgAck => { }
nCallBack.onUserJoinedBot = user => { }
nCallBack.onChatMember = chatMember => { }
nCallBack.onChatAdministrators = chatAdministrators => { }
nCallBack.userStartedBot = user => {console.log("started the bot") }
nCallBack.onMyProfile = user => { }
nCallBack.onUserDetails = user => { }
nCallBack.userStoppedBot = user => { }
nCallBack.userLeftBot = user => { }
nCallBack.permanentUrl = permanentUrl => { }
nCallBack.onChatDetails = chat => { }
nCallBack.onInlineSearh = inlineSearch => { }
 
client.connect(TOKEN, nCallBack);
