# BetterJams
BetterJams is a collaborative music‑queue app built on top of the Spotify Web API.
It lets a group of people control what plays next—fairly and democratically.

# How to run betterjams locally
 **You need spotify premium for this project**.

 Before we start running the server you need to make a spotify app.
 Navigate to this url and follow the create an app step:
 https://developer.spotify.com/documentation/web-api/tutorials/getting-started#create-an-app
 
Open the terminal and navigate to this project. 
From the root of this Project run the following command:
```npm ci```

Atfer installing all the depenencies make a coppy of the ```.env.example``` and rename it ```.env```  
You need to get the CLIENT_ID and CLIENT_SECRET from your spotify app.

To start the server run ```npm run start:server```

Open a new terminal window and navigate to the root of this project.

To start the client run ```npm run start:client```

In your browser navigate to http://127.0.0.1:4200
