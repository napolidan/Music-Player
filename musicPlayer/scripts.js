let backCover = document.getElementById('back-cover-img');
let artist = document.getElementById('artist');
let track = document.getElementById('track');
let cover = document.getElementById('cover');

let current = document.getElementById('current');
let slide = document.querySelector('.seek-bar');
let total = document.getElementById('total');

let shuffle = document.getElementById('shuffle');
let prev = document.getElementById('back');
let play = document.getElementById('play');
let next = document.getElementById('next');
let repeat = document.getElementById('repeat');


let currentTrack = document.createElement('audio');

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let isRepeat = false;
let updateTimer;
var busy = false;


function loadTrackList(){
    
    currentTrack.src = collection[track_index].song;
    currentTrack.load();

    cover.src = collection[track_index].img;
    cover.style.animationPlayState = 'paused';
    backCover.src = collection[track_index].img;
    backCover.classList.add("img-visible");

    artist.textContent = collection[track_index].artist;
    document.body.style.backgroundImage = collection[track_index].img;

    updateTimer = setInterval(setUpdate, 100);

    track.textContent = collection[track_index].track;

    currentTrack.addEventListener("ended", nextTrack);
}

function loadTrack(track_index) {

    currentTrack.src = collection[track_index].song;
    currentTrack.load();

    fadeOutImage();
    
    setTimeout(() => {
        cover.src = collection[track_index].img;
        backCover.src = collection[track_index].img;

        artist.textContent = collection[track_index].artist;

        fadeInImage();
        document.body.style.backgroundImage = collection[track_index].img;

        updateTimer = setInterval(setUpdate, 100);

        track.textContent = collection[track_index].track

        currentTrack.addEventListener("ended", nextTrack);
    }, 300);    
}

function reset() {
    clearTimeout(updateTimer);
    current.textContent = "00:00";
    slide.value = 0;
    total.textContent = "00:00";
}

function fadeOutImage(){
    backCover.classList.remove("img-visible");
}

function fadeInImage(){
    backCover.classList.add("img-visible");
}

function randomTrack() {
    isRandom ? pauseRandom() : playRandom();
}

function playRandom() {
    isRandom = true;
    shuffle.classList.add("turnedOn");
}

function pauseRandom() {
    isRandom = false;
    shuffle.classList.remove("turnedOn");
}

function repeatTrack() {
    isRepeat ? pauseRepeat() : playRepeat();
}

function playRepeat() {
    isRepeat = true;
    repeat.classList.add("turnedOn");
}

function pauseRepeat() {
    isRepeat = false;
    repeat.classList.remove("turnedOn");
}

// STOP AND PLAY

function startPlaying() {
    isPlaying ? pauseTrack() : playTrack();
}

function playTrack() {

    currentTrack.volume = 0;

    // FADE IN VOLUMEN

    myInterval = setInterval(function fadeInVolume() {

        if (currentTrack.volume <= 0.5) {
            currentTrack.volume += 0.015;
        }
        else if(currentTrack.volume > 0.5 && currentTrack.volume <= 0.995){
            currentTrack.volume += 0.005;
        }
        else {
            clearTimeout();
        }
    }, 25);

    if (!isNaN(current.duration)) {

    }

    currentTrack.play();
    isPlaying = true;
}

function pauseTrack() {

    myInterval = setInterval(function fadeOutVolume() {

        if (currentTrack.volume > 0) {
            currentTrack.volume -= 0.005;
        }
        else {
            clearTimeout();
        }
    }, 25);

    currentTrack.pause();
    isPlaying = false;
}


// SE ACABA UNA CANCIÓN

function nextTrack() {

    // NO RANDOM, NO REPEAT - NEXT SONG
    if (track_index < collection.length - 1 && isRandom == false && isRepeat == false) {
        track_index += 1;
    }

    // SI REPEAT - SAME SONG
    else if(isRepeat == true){
        track_index = track_index;
    }

    // SI RANDOM, NO REPEAT - RANDOM SONG
    else if (isRandom == true && isRepeat == false) {
        do{
            let random_index = Number.parseInt(Math.random() * collection.length);
        }while(track_index != random_index);
        track_index = random_index;
    }
    
    // NO RANDOM, NO REPEAT, LAST SONG - FIRST SONG
    else{
        track_index = 0;
    }

    loadTrack(track_index);
    reset();
    playTrack();
}

// SE SKIPEA UNA CANCIÓN

function skipTrack() {
    
    // NO RANDOM, NO REPEAT - NEXT SONG
    if (track_index < collection.length - 1 && isRandom == false) {
        track_index += 1;
    }

    // SI RANDOM - RANDOM SONG
    else if (isRandom == true) {
        let random_index = Number.parseInt(Math.random() * collection.length);
        track_index = random_index;
    }

    // NO RANDOM, LAST SONG - FIRST SONG
    else {
        track_index = 0;
    }

    loadTrack(track_index);
    reset();
    playTrack();
}

function prevTrack() {
    if (track_index > 0) {
        track_index -= 1;
    }
    else{
        track_index = collection.length - 1;
    }
    loadTrack(track_index);
    reset();
    playTrack();
}

function seekTo() {
    let seekto = currentTrack.duration * (slide.value / 100);
    currentTrack.currentTime = seekto;
}

slide.addEventListener("input", function () {
    busy = true;
});

currentTrack.addEventListener("timeupdate", function (e) {
    if (!busy) {
        slide.value = currentTrack.currentTime;
    }
});


slide.addEventListener("change", function () {
    busy = false;
    currentTrack.currentTime = slide.value;
})

currentTrack.addEventListener("loadedmetadata", function () {
    slide.max = currentTrack.duration;
});

function setUpdate() {
    let seekPosition = 0;
    if (!isNaN(currentTrack.duration)) {

        // seekPosition = currentTrack.currentTime * (100 / currentTrack.duration);
        // slide.value = seekPosition;

        let currentMinutes = Math.floor(currentTrack.currentTime / 60);
        let currentSeconds = Math.floor(currentTrack.currentTime - (currentMinutes * 60));

        let totalMinutes = Math.floor(currentTrack.duration / 60);
        let totalSeconds = Math.floor(currentTrack.duration - (totalMinutes * 60));

        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (totalMinutes < 10) { totalMinutes = "0" + totalMinutes; }
        if (totalSeconds < 10) { totalSeconds = "0" + totalSeconds; }

        current.innerHTML = currentMinutes + ":" + currentSeconds;
        total.innerHTML = totalMinutes + ":" + totalSeconds;

        if(!currentTrack.paused){
            play.src = "pause.png";
            cover.style.animationPlayState = 'running';
        }
        else{
            play.src = "play.png";
            cover.style.animationPlayState = 'paused';
        }

    }
}