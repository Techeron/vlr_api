require('dotenv').config()
const express = require('express');
const axios = require('axios');
const url = require('url');

const port = process.env.PORT || 9999;
const app = express();

app.get("/api/auth/discord/redirect", async(req,res) => {
    const { code } = req.query;

    if(code){
        const formData = new url.URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: "authorization_code",
            code,
            redirect_uri: process.env.REDIRECT_URI,
        });
        const output = await axios.post("https://discord.com/api/oauth2/token", 
        
        if(output.data) {
            const access = output.data.access_token;
    
            const user = await axios.get("https://discord.com/api/users/@me", {
                headers: {
                    authorization: `Bearer ${access}`,
                },
            });
    
            if(user.data) {
                const { id, username, discriminator, avatar } = user.data;
                const userData = {
                    id,
                    username,
                    discriminator,
                    avatar,
                };
                res.json(userData);
                // res.redirect(`${process.env.CLIENT_URL}/?user=${JSON.stringify(userData)}`);
            }
        }
    }
    else {
        res.redirect(`${process.env.OAUTH2_URL}`)
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});