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


function loadTrack(track_index) {
    clearTimeout(updateTimer);
    reset();

    currentTrack.src = collection[track_index].song;
    currentTrack.load();

    cover.src = collection[track_index].img;
    backCover.src = collection[track_index].img;

    backCover.classList.remove("img-visible");
    backCover.classList.add("img-visible");

    artist.textContent = collection[track_index].artist;
    document.body.style.backgroundImage = collection[track_index].img;

    updateTimer = setInterval(setUpdate, 100);

    track.textContent = collection[track_index].track

    currentTrack.addEventListener("ended", nextTrack);

}

function reset() {
    current.textContent = "00:00";
    slide.value = 0;
    total.textContent = "00:00";
}

function randomTrack() {
    isRandom ? pauseRandom() : playRandom();
}

function playRandom() {
    isRandom = true;
    shuffle.classList.add('randomActive');
}

function pauseRandom() {
    isRandom = false;
    shuffle.classList.remove('randomActive');
}

function repeatTrack() {
    isRepeat ? pauseRepeat() : playRepeat();
}

function playRepeat() {
    isRepeat = true;
    repeat.classList.add('repeatActive');
}

function pauseRepeat() {
    isRepeat = false;
    repeat.classList.remove('repeatActive');
}

function startPlaying() {
    const running = cover.style.animationPlayState || 'paused';
    cover.style.animationPlayState = running === 'running' ? 'paused' : 'running';
    isPlaying ? pauseTrack() : playTrack();
}

function playTrack() {
    currentTrack.volume = 0;

    myInterval = setInterval(function fadeInVolume() {
        if (currentTrack.volume <= 0.995) {
            currentTrack.volume += 0.005;
        }
        else {
            clearTimeout();
        }
    }, 25);

    if (!isNaN(current.duration)) {

    }

    loadTrack(track_index);
    currentTrack.play();

    isPlaying = true;
    play.src = "pause.png";
}

function pauseTrack() {
    currentTrack.pause();
    isPlaying = false;
    play.src = "play.png";
}

function nextTrack() {
    if (track_index < collection.length - 1 && isRandom == false && isRepeat == false) {
        track_index += 1;
    }
    else if (track_index < collection.length - 1 && isRandom == true && isRepeat == false) {
        let random_index = Number.parseInt(Math.random() * collection.length);
        track_index = random_index;
    }
    else if (track_index < collection.length - 1 && isRepeat == false) {
        track_index = track_index;
    }
    else {
        track_index = 0;
    }
    loadTrack(track_index);
    playTrack();
}

function skipTrack() {
    if (track_index < collection.length - 1 && isRandom == false) {
        track_index += 1;
    }
    else if (track_index < collection.length - 1 && isRandom == true) {
        let random_index = Number.parseInt(Math.random() * collection.length);
        track_index = random_index;
    }
    else {
        track_index = 0;
    }
    loadTrack(track_index);
    playTrack();
}

function prevTrack() {
    if (track_index > 0) {
        track_index -= 1;
    }
    else {
        track_index = collection.length - 1;
    }
    loadTrack(track_index);
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
    }
}