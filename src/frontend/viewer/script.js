/**
 * The queue for video urls
 */
const videoqueue = [];

/**
 * The video player
 */
const player = document.getElementById('player');
player.onpause = () => {
    if (!player.ended) player.play();
}

/**
 * Shows the player
 */
const showPlayer = () => {
    player.style.display = '';
}

/**
 * Hides the player
 */
const hidePlayer = () => {
    player.style.display = 'none';
}

/**
 * Checks if a video can be played and plays the next video in the queue
 */
const nextVideo = () => {
    if (player.src && !player.ended) return;
    const video = videoqueue.shift();
    if (!video)
        hidePlayer();
    else {
        player.src = video;
        showPlayer();
    }
}
player.onended = nextVideo;

/**
 * Adds the video to the queue
 * @param {String} url url of video
 */
const addVideo = (url) => {
    videoqueue.push(url);
    nextVideo();
};