$(document).ready(function() {
    var currentAudio = null; // Store the currently playing audio

    $(".meme").click(function() {
        var audio = $(this).find("audio")[0]; // Find the audio inside the clicked div

        if (currentAudio && currentAudio !== audio) {
            currentAudio.pause(); // Pause the previous audio
            currentAudio.currentTime = 0; // Reset it
        }

        audio.currentTime = 0;
        audio.play();
        currentAudio = audio;
    });
});