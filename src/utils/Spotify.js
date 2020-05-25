
let accessToken;
const clientId = 'a564e09202944eb5a03d8d4b6284fc0d'; //check
// const redirectUri = 'http://simonkovplaylistcreator.surge.sh';
const redirectUri = 'http://localhost:3000/';




const Spotify = {
    getAccessToken(){
        if (accessToken){
            return accessToken;
        } 
        
        //check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenMatch && expiresInMatch){
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            // wipe the access token and URL parameters
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        }  else{
            // const accessUrl = 'https://accounts.spotify.com/authorize' +
            // '?response_type=token' +
            // '&client_id=' + clientId +
            // '&scope=playlist-modify-public' +
            // '&redirect_uri=' + redirectUri;
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }

            
        
        
    },
    async searchSpotify(searchTerm){
        //passes the search term value to a Spotify request
        const accessToken = Spotify.getAccessToken();        
        try{
            const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, 
                        { headers: { 
                            Authorization: `Bearer ${accessToken}` 
                        } 
            });
            if(response.ok){
                const jsonResponse = await response.json();
                if (!jsonResponse.tracks){
                    console.log("ou farts");
                    return [];
                }else{
                    return jsonResponse.tracks.items.map(track => {
                        return {
                            id: track.id,
                            name: track.name,
                            artist: track.artists[0].name,
                            album: track.album.name,
                            uri: track.uri
                        }
                    });
                }
            }
        }catch (error) {
            console.log(error);
        }
         // return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, 
        //             { headers: { 
        //                 Authorization: `Bearer ${accessToken}` 
        //             } 
        // }).then(response => {
        //     return response.json();
        // }).then(jsonResponse => {
        //     if(!jsonResponse.tracks){
        //         console.log("ou farts");
        //         return [];
        //     }
        //     console.log(jsonResponse);
        //     return jsonResponse.tracks.items.map(track => ({
        //         id: track.id,
        //         name: track.name,
        //         artist: track.artists[0].name,
        //         album: track.album.name,
        //         uri: track.uri
        //     })); 
        // });


    },
    savePlaylist(playlistName, trackUris){
        if(!(playlistName || trackUris)){
            return;
        }
        const accessToken = this.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;    
        
        return fetch('https://api.spotify.com/v1/me', 
            {headers: headers}
        ).then(response => {
            return response.json()}
        ).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
                { 
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ name : playlistName})
                }
            ).then(response => 
                {return response.json()
            }).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackUris})
                }
                );
            });
        });
    }
};

export default Spotify;