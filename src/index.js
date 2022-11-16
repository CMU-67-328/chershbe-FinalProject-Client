$(document).ready(function () {

    let catMemes = [];
    let currentMeme = undefined;
    getCatMemes();
    getCurrentMeme();

    $('#updateCurrentMeme').click(() => {
        const fileType = (currentMeme.mimetype === 'image/png') ? '.png' : '.jpg';
        const body = { 
            filename: 'http://localhost:3005/images/' + currentMeme.filename + fileType,
            mimetype: currentMeme.mimetype,
            toptext: $('#memeTopText').val(),
            bottomtext: $('#memeBottomText').val()
        };
        $.ajax({
            url:'http://localhost:3005/api/creatememe/',
            type: 'POST',
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify(body),
            success: (res) => {
                console.log('Success!');
                const url = 'data:' + currentMeme.mimetype + ';base64,' + res;
                $('#currentMeme').attr('src', url);
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                console.log(err);
                alert('Error: In sending the request!');
            }
        });
    });

    $('#saveCurrentMeme').click(() => {
        $.ajax({
            url:'http://localhost:3005/api/savecurrent/',
            type: 'POST',
            contentType: false,
            processData: false,
            cache: false,
            data: '',
            success: (res) => {
                getCatMemes();
                getCurrentMeme();
                console.log('Success!', res);
            },
            error: () => {
                alert('Error: In sending the request!');
            }
        });
    });

    $("#formUpload").submit((event) => {
        event.preventDefault();
        const data = new FormData($('#formUpload')[0]);
        
        $.ajax({
            url:'http://localhost:3005/api/upload/',
            type: 'POST',
            contentType: false,
            processData: false,
            cache: false,
            data: data,
            success: (res) => {
                getCurrentMeme();
                console.log('Success!', res);
            },
            error: () => {
                alert('Error: In sending the request!');
            }
        });
    });


    function getCatMemes() {
        $.getJSON('http://localhost:3005/api/memes/', (memes) => {
            catMemes = memes;
            let catCarousel = '';
            let isFirst = true;
            catMemes.forEach((m) => {
                const fileType = (m.mimetype === 'image/png') ? '.png' : '.jpg';
                const img = m.filename + fileType;
                if (isFirst) {
                    catCarousel = '<div class="carousel-item active">';
                    isFirst = false;
                } else {
                    catCarousel += '<div class="carousel-item">';    
                }
                catCarousel += '<img class="memeImage" src="http://localhost:3005/images/' + img;
                catCarousel += '" class="d-block w-150" alt="' + img + '"></div>';                       
            });
            $('#catMemeCarousel').html(catCarousel);
        });
    }

    function getCurrentMeme() {
        $.getJSON('http://localhost:3005/api/currentmeme/', (meme) => {
            if (!meme || meme === '{}') {
                currentMeme = undefined;
                $('#currentMeme').html('<h1>No Current Meme</h1>');
            } else {
                currentMeme = meme;
                const fileType = (meme.mimetype === 'image/png') ? '.png' : '.jpg';
                $('#currentMeme').attr('src', 'http://localhost:3005/images/' + meme.filename + fileType);
            }
        });
    }

});


