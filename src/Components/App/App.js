import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../utils/Spotify';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

  }

  savePlaylist(){
     const trackUris = this.state.playlistTracks.map(track => track.uri);
     Spotify.savePlaylist(this.state.playlistName, trackUris).then(
      this.setState({playlistName: "New Playlist"})
     );

  }

  search(searchTerm){
    Spotify.searchSpotify(searchTerm).then(searchResults => {
      this.setState({searchResults: searchResults})
    })
  }

  addTrack(track){
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id))
      return;
    tracks.push(track);
    this.setState({playlistTracks: tracks});
    const filteredResultsTracks = this.state.searchResults.filter(savedTrack => 
      (savedTrack.id !== track.id));
    this.setState({searchResults: filteredResultsTracks});
  }

  removeTrack(track){
    const filteredPlaylistTracks = this.state.playlistTracks.filter(savedTrack => 
      (savedTrack.id !== track.id));
    this.setState({playlistTracks: filteredPlaylistTracks});  
  }

  updatePlaylistName(name){
    this.setState({playlistName: name});  
  }

  

  render(){
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar 
            onSearch={this.search} 
          />

          <div className="App-playlist">
            <SearchResults 
              searchResults={this.state.searchResults}
              onAdd={this.addTrack} 
            />

            <Playlist 
              playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} 
            />
          </div>
        </div>
      </div>
    );
  } 
}

export default App;