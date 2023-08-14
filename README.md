# Dencord
A Discord API wrapper for Deno

# This project is still in works
That's right, this will take a *loooong* time to finish because, I'm a student, and this is my side-hustle, so bare with me! For now, you can contribute and make my code better :)

# Example code
Here's an example of how the code looks when using Dencord.
```ts
import * as Discordeno from "path/to/mod.ts";

const client: Discordeno.Client = new Discordeno.Client("YOUR-BOT-TOKEN",{
    intents: Discordeno.Enums.Intents.ALL
});

client.on("ready",() => {
    console.log("Ready");
});

client.on("messageCreate",async (message: Discordeno.Message) => {
    if (message.content === "!ping") {
        await message.reply("Pong!")
    }
})

client.connect();
```
(As you can see, I took a lot of inspiration from Discord.JS and Eris regarding syntax, I find syntax of those kind of simple so I used them as an inspiration)