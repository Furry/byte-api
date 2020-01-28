<h1 align="center">
  <br>
  Byte-API
  <br>
</h1>

<h4 align="center">A simple API Wrapper around the Byte.co app, utilizing node-fetch as the http client w\ proxy support.</h4>

<p align="center">
  <a href="https://discord.gg/n4yqTrt">
      <img src="https://i.imgur.com/ECEsP5l.png">
  </a>

## Setup

if you use npm,

```npm install byte-api```

if you use yarn,

```yarn add byte-api```


## Code

All methods that interact with your user account (Most that query the api) require you to be authorized or logged in first, as shown below.
```js
const Byte = require("byte-api");

const Client = new Byte.Client("YourAuthorizationToken");

Client.setProfileColor(1) // Sets the user's profile color
.then((res) => {
    console.log(res);
})

Client.setBio("Just a random Bio") // Changes your BIO.
.then((res) => {
    console.log(res);
})
```

Example of a follow + like + subscribe bot:
```js
const Byte = require("byte-api");

const Client = new Byte.Client("YourAuthorizationToken");

let items = ["Nice!", "cool", "welcome", "awesome", "^~^"]


let i = 0;
;(async function container() {
    let posts = await Client.getGlobalFeed()
    for (let post of posts) {
        i++;
        await post.author.subscribe(post.authorID)
        console.log(await post.loop());
        console.log(await post.like());
        await post.comment(items[Math.floor(Math.random()*items.length)])
        await new Promise((resolve, reject) => setTimeout(resolve, 1500))
        console.log(i)
    }
    container();
})();
```

There are some exceptions though, they're accessed in a different way.
```js
const Byte = require("byte-api");

Byte.Isolated.checkName("potato") // Checks a usernames avability without the need for authorization.
.then((res) => console.log(res))
```

## Getting a Token

You can get a token by sniffing the http traffic of the app. in every request, there will be a header saying "Authorization: Token", copy that token and use it to logon. To do this, I used HttpCanary (From the Android App Store) and Nox App Player. 


## To-Do

* Abide by x-ratelimit.
* Add more endpoints.
* Add paging through feed.
* add a d.ts file

## Contributions
I'd love for people to help out!

I have no standards for accepting PRs or issues. Have a neat idea? impliment it and send it over, and if it works well I'll approve. Though I might reformat it to fit the style of the rest of the repository.

If you're better at Javascript then me, feel free to make corrections or tell me how I can do something better!
