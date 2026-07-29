// (songs.json structure)
class Song
{
    constructor(id, title, artist, genre, category, audio)
    {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.genre = genre;
        this.category = category;
        this.audio = audio;
    }
}

let currentSong = null;
let currentStation = null;

//song queue
let songQueue = [];
let queueIndex = 0;
let upcomingQueue = [];

//shuffle 
function shuffleSongs(array)
{
    return array.sort(() => Math.random() - 0.5);
}

function playRandomSong(category)
{
    currentStation = category;

    let stationSongs;


if(category === "liked")
{
    stationSongs = JSON.parse(localStorage.getItem("likedSongs")) || [];
}
else if(category === "all")
{
    stationSongs = songs;
}
else
{
    stationSongs = songs.filter(song =>
        song.category === category
    );
}


    if(stationSongs.length === 0)
    {
        alert("No songs available for this station.");
        return;
    }


    //shuffle
    songQueue = shuffleSongs([...stationSongs]);

    //Start at first song
    queueIndex = 0;

    playCurrentQueueSong();
}

function playCurrentQueueSong()
{
    currentSong = songQueue[queueIndex];

    


    const currentSongDisplay = document.getElementById("currentSong");

    if(currentSongDisplay)
    {
    currentSongDisplay.textContent =
    `${currentSong.title} - ${currentSong.artist}`;
    }


    let audioPlayer = document.getElementById("audioPlayer");


    if(currentSong.audio)
    {
        audioPlayer.src = currentSong.audio;

        audioPlayer.play().catch(error =>
        {
            console.log("Playback needs user interaction.");
        });
    }
}

//play songs in browse page
function playSong(songId)
{
    const selectedSong = songs.find(song => song.id === songId);

    console.log("Selected song:", selectedSong);


    if(!selectedSong)
    {
        console.log("Song not found.");
        return;
    }


    currentSong = selectedSong;


    const currentSongDisplay = document.getElementById("currentSong");

    if(currentSongDisplay)
    {
        currentSongDisplay.textContent =
        `${currentSong.title} - ${currentSong.artist}`;
    }


    const audioPlayer = document.getElementById("audioPlayer");


    if(audioPlayer)
    {
        audioPlayer.src = currentSong.audio;

        console.log("Audio source:", audioPlayer.src);

        audioPlayer.load();

        audioPlayer.play()
        .then(() =>
        {
            console.log("Playing!");
        })
        .catch(error =>
        {
            console.log("Audio error:", error);
        });
    }
}

// Play all songs from playlist
function playPlaylistSong(songId)
{
    let playlist = JSON.parse(localStorage.getItem("playlist")) || [];

    const selectedIndex = playlist.findIndex(song => song.id === songId);

    if(selectedIndex === -1)
    {
        console.log("Playlist song not found.");
        return;
    }

    // Make playlist the current queue
    songQueue = playlist;

    // Start from selected song
    queueIndex = selectedIndex;

    currentStation = "playlist";

    playCurrentQueueSong();
}

function nextSong()
{
    // Play q songs first
    if(upcomingQueue.length > 0)
    {
        currentSong = upcomingQueue.shift();
        displayQueue();

        const audioPlayer = document.getElementById("audioPlayer");

        const currentSongDisplay = document.getElementById("currentSong");

        if(currentSongDisplay)
        {
            currentSongDisplay.textContent =
            `${currentSong.title} - ${currentSong.artist}`;
        }

        audioPlayer.src = currentSong.audio;
        audioPlayer.play();

        return;
    }


    
    queueIndex++;

    if(queueIndex >= songQueue.length)
    {
        console.log("Queue finished.");
        return;
    }

    playCurrentQueueSong();
}

// Add a song to the queue from the playlist

function addToQueue(songId)
{
    let playlist = JSON.parse(localStorage.getItem("playlist")) || [];

    const selectedSong = playlist.find(song => song.id === songId);

    if(!selectedSong)
    {
        console.log("Song not found in playlist.");
        return;
    }


    // Add to upcoming queue
   upcomingQueue.push(selectedSong);

    displayQueue();


    console.log("Upcoming queue:", upcomingQueue);

    alert(`${selectedSong.title} added to queue!`);
}
// Display the upcoming queue on the playlist page

function displayQueue()
{
    const queueList = document.getElementById("queueList");

    if(!queueList)
    {
        return;
    }


    queueList.innerHTML = "";


    if(upcomingQueue.length === 0)
    {
        queueList.innerHTML = "<p>No songs queued.</p>";
        return;
    }


    upcomingQueue.forEach(song =>
    {
        queueList.innerHTML += `
        <div class="card song-card mb-2">
            <div class="card-body">
                <h5>${song.title}</h5>
                <p>${song.artist}</p>
            </div>
        </div>
        `;
    });
}

function playPlaylist()
{
    let playlistSongs = JSON.parse(localStorage.getItem("playlist")) || [];

    if(playlistSongs.length === 0)
    {
        alert("Your playlist is empty.");
        return;
    }

    currentStation = "playlist";

    songQueue = playlistSongs;

    queueIndex = 0;

    playCurrentQueueSong();
}

//play previous song

function playPreviousSong()
{
    if(queueIndex <= 0)
    {
        alert("No previous song available.");
        return;
    }


    queueIndex--;

    playCurrentQueueSong();
}

let songs =[];
let currentCategory = "all";

// Function to load songs from local storage using fetch()
async function loadSongs() {
    try {
        const response = await fetch('data/songs.json');
        const data = await response.json();
        songs = data.map(song => new Song(song.id, song.title, song.artist, song.genre, song.category, song.audio));
        displaySongs(songs);
    } catch (error) {
        console.error('Error loading songs:', error);
    }
}
//display songs on the browse page
function displaySongs(songArray)
{
    const songList = document.getElementById('songList');
    if(!songList)
    {
return;
    }
    songList.innerHTML = '';

    if(songArray.length === 0)
    {
        songList.innerHTML = '<p class="text-center text-light">No songs found.</p>';
        return;
    }

    songArray.forEach(song =>
    {
        songList.innerHTML += `
        <div class = "col-md-4">
        <div class = "card song-card h-100">
        <div class = "card-body text-center">
        <h3 class="card-title">${song.title}</h3>
        <p class="card-text">Artist: ${song.artist}</p>
        <p class="card-text">Genre: ${song.genre}</p>
       <button class="btn btn-primary me-2" onclick="playSong(${song.id})"> Play</button>
       <button class="btn btn-success me-2" onclick="addToPlaylist(${song.id})"> Add to Playlist</button>
       <button class="btn btn-danger" onclick="likeSong(${song.id})"> Like</button>
        </div>
        </div>
        </div>
        `;
     });
    }

    // Function to filter songs by category
    function filterByCategory(category)
    {
        currentCategory = category;

        let filteredSongs = songs;

        if(category !=="all")
        {
            filteredSongs = songs.filter(song => song.category === category);
        }

        displaySongs(filteredSongs);
    }
    //function to add active category
    function updateActiveCategoryButton(selectedButton)
    {
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(button =>
        {
            button.classList.remove('btn-success');
            button.classList.add('btn-outline-light');
        });
        selectedButton.classList.remove('btn-outline-light');
        selectedButton.classList.add('btn-success');
    }

    //search songs by title,artist, or genre
    function searchSongs()
    {
        const searchInput = document.getElementById("searchInput");

        if(!searchInput)
        {
            return;
        }

        const searchText = searchInput.value.toLowerCase();

        let filteredSongs = songs.filter(song =>
            song.title.toLowerCase().includes(searchText) ||
            song.artist.toLowerCase().includes(searchText) ||
            song.genre.toLowerCase().includes(searchText)
        );

        if(currentCategory !== "all")
        {
            filteredSongs = filteredSongs.filter(song => song.category === currentCategory);
        }
        displaySongs(filteredSongs);

    }

    // add a song to playlist using local storage
    function addToPlaylist(songId)
    {
        const selectedSong = songs.find(song => song.id === songId);

        let playlist = JSON.parse(localStorage.getItem('playlist')) || [];

        const alreadyAdded = playlist.some(song => song.id === songId);

        if(alreadyAdded)
        {
            alert('Song is already in the playlist!');
            return;
        }

        playlist.push(selectedSong);
        localStorage.setItem('playlist', JSON.stringify(playlist));
        alert(`${selectedSong.title} by ${selectedSong.artist} added to playlist!`);
    }

    //like and unlike a song in browse page using local storage
    function likeSong(songId)
{
    const selectedSong = songs.find(song => song.id === songId);

    let likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || [];

    const songIndex = likedSongs.findIndex(song => song.id === songId);


    // Remove if already liked
    if(songIndex !== -1)
    {
        likedSongs.splice(songIndex, 1);

        localStorage.setItem(
            "likedSongs",
            JSON.stringify(likedSongs)
        );

        alert(`${selectedSong.title} removed from liked songs `);
        return;
    }


    // Add if not liked
    likedSongs.push(selectedSong);

    localStorage.setItem(
        "likedSongs",
        JSON.stringify(likedSongs)
    );

    alert(`${selectedSong.title} added to liked songs `);
}

    //Event Listener for DOMContentLoaded to load songs when the page is ready
    document.addEventListener("DOMContentLoaded",() =>
    {
        const stationButtons = document.querySelectorAll(".station-btn");


stationButtons.forEach(button =>
{
    button.addEventListener("click", () =>
    {
        const category = button.getAttribute("data-category");

        playRandomSong(category);
    });
}); 

//play all songs from the playlist page
const playAllButton = document.getElementById("playAllButton");

if(playAllButton)
{
    playAllButton.addEventListener("click", () =>
    {
        playPlaylist();
    });
}
const previousButton = document.getElementById("previousButton");

//previous song
if(previousButton)
{
    previousButton.addEventListener("click", () =>
    {
        playPreviousSong();
    });
}

const nextButton = document.getElementById("nextButton");

//next song
if(nextButton)
{
    nextButton.addEventListener("click", () =>
    {
        if(currentStation)
        {
           nextSong();
        }
        else
        {
            alert("Please choose a station first.");
        }
    });
}
//like current song for the index page
const likeCurrentButton = document.getElementById("likeCurrentSong");

if(likeCurrentButton)
{
    likeCurrentButton.addEventListener("click", () =>
    {
        if(currentSong)
        {
            likeSong(currentSong.id);
        }
        else
        {
            alert("No song is currently playing.");
        }
    });
}
const addCurrentButton = document.getElementById("addCurrentToPlaylist");

//playlist current song for the index page
if(addCurrentButton)
{
    addCurrentButton.addEventListener("click", () =>
    {
        if(currentSong)
        {
            addToPlaylist(currentSong.id);
        }
        else
        {
            alert("No song is currently playing.");
        }
    });
}

const audioPlayer = document.getElementById("audioPlayer");

if(audioPlayer)
{
    audioPlayer.addEventListener("ended", () =>
    {
        if(currentStation)
        {
            nextSong();
        }
    });
}
        
        const songList = document.getElementById('songList');
        const searchInput = document.getElementById('searchInput');
        const categoryButtons = document.querySelectorAll('.category-btn');
        const playlistList = document.getElementById('playlistList');
        if(playlistList)
        {
            displayPlaylist();
        }
       
           loadSongs().then(() => {
    console.log("Songs loaded!");
});
        
const homeMessage = document.getElementById("homeMessage");

if (homeMessage) {
    const loggedInUser = localStorage.getItem('loggedInUser'); // Get logged in user's name
    const playlist = JSON.parse(localStorage.getItem('playlist')) || [];

    if (loggedInUser) {

        if (playlist.length === 0) {
            //  empty playlist message
            homeMessage.textContent = `Welcome back, ${loggedInUser}! Your playlist is empty. Start adding some songs 🎵`;
        } else {
            // normal message
            homeMessage.textContent = `Welcome back, ${loggedInUser}! You have ${playlist.length} song(s) in your playlist.`;
        }

    } else {
        homeMessage.textContent = 'Welcome to Music Station! Please log in to create your personalized playlist.';
    }
}
        
        if(searchInput)
        {
            searchInput.addEventListener('input', searchSongs);
        }
        categoryButtons.forEach(button =>
        {
            button.addEventListener('click', () =>
                {
const category = button.getAttribute('data-category');
filterByCategory(category);
updateActiveCategoryButton(button);
                });
           });   }
    );

    //display saved playlist songs on the playlist page
    function displayPlaylist()
    {
        const playlistList = document.getElementById('playlistList');
        if(!playlistList)
        {
            return;
        }

        const playlist = JSON.parse(localStorage.getItem('playlist')) || [];
        playlistList.innerHTML = '';

        if(playlist.length === 0)
        {
            playlistList.innerHTML = '<p class="text-center text-light">Your playlist is empty.</p>';
            return;
        }

        playlist.forEach(song =>
        {
            playlistList.innerHTML += `
            <div class = "col-md-4">
            <div class = "card song-card h-100">
            <div class = "card-body text-center">
            <h3 class="card-title">${song.title}</h3>
            <p class="card-text">Artist: ${song.artist}</p>
            <p class="card-text">Genre: ${song.genre}</p>
          <button class="btn btn-primary me-2" onclick="playPlaylistSong(${song.id})">Play</button>
<button class="btn btn-warning me-2" onclick="addToQueue(${song.id})">Add to Queue</button>
<button class ="btn btn-danger" onclick="removeFromPlaylist(${song.id})">Remove</button>
            </div>
            </div>
            </div>
            `;
        });
    }

    //remove a song from the playlist

    function removeFromPlaylist(songId)
    {
        let playlist = JSON.parse(localStorage.getItem('playlist')) || [];

        playlist = playlist.filter(song => song.id !== songId);
        localStorage.setItem('playlist', JSON.stringify(playlist));
        displayPlaylist();
    }

  