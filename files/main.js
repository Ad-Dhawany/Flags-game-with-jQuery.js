$(function(){
    'use strict'
    let startBtn = $('.control-form span');
    let tries = $('.tries span');
    let duration = 1000,
        setT = 120,
        remain = setT;
    var remainingTime = $('.timeOut span');
    var audioTrue = document.createElement('audio'),
        audioWrong = document.createElement('audio'),
        audioWin = document.createElement('audio'),
        audioLose = document.createElement('audio'),
        playerName = "" ,
        finalImg = $('.congrats img'),
        congrats = $('.congrats'),
        resetBtn = $('.congrats .reset');

    audioTrue.setAttribute('src', 'files/sounds/true.wav');
    audioWrong.setAttribute('src', 'files/sounds/wrong.wav');
    audioWin.setAttribute('src', 'files/sounds/win.wav');
    audioLose.setAttribute('src', 'files/sounds/lose.wav');
    startBtn.click(function () { 
        var yourname = prompt("من فضلك أدخل اسمك:");
        if(yourname == null || yourname == ""){
            yourname = "لاعب";
        }
        playerName = yourname;
            $('.name span').text(yourname);
        $('.control-form').hide();
        Timer();
    });
    let blocks = Array.from($('.game-blocks').children());
    let order = Array.from(Array(blocks.length).keys());
    shuffle(order);
    blocks.forEach((block, index)=> {
        block.style.order = order[index];
    });
//click function is a main function in this game
    $('.img-block').click(function () { 
        $(this).addClass('is-flipped'); // this refer to the block has clicked only
        let flippedBlocks = $('.img-block.is-flipped'); // to collect all flipped blocks
        if(flippedBlocks.length >= 2){ /* meaning there are two clicked (flipped) blocks */
            noClicking(); //call noClicking function to prevent clicking temperorily
            checkMatching(flippedBlocks); // call checkMatching function
        }
        let matchingBlocks = $('.img-block.matched');
        if (matchingBlocks.length == blocks.length){
            win();
            endGame();
        }
    });

    resetBtn.click(function () { restart() });

     //functions area
     //shuffle function to make blocks in random order
    function shuffle(array){
        let current = array.length,
            temp,
            random;
        while(current>0){
            random = Math.floor(Math.random() * current);
            current--;
            temp = array[current];
            array[current] = array[random];
            array[random] = temp 
        }
        return array;
    }
    //Timer to calc and show time out of the game
    function Timer(){
    const TimerInterval = setInterval(() => {
        remain-- ;
        let min = Math.floor(remain/60),            /* minutes */
            secV = remain % 60,                     /* second value */
            sec = (secV < 10)? "0" + secV : secV ;  /* sec = if secV < 10 , add 0 as string before secV , else sec = secV */
            remainingTime.text(min + ':' + sec);    /* remainingTime = $('.timeOut span') */
        if (remain <= 0){
            clearInterval(TimerInterval);
            lose();
            endGame();
        }
        if( $('.img-block.matched').length >= blocks.length ){
            clearInterval(TimerInterval);
        }
    }, 1000);
    }

    function noClicking(){
        $('.game-blocks').addClass('no-clicking');
        setTimeout(() => {
            $('.game-blocks').removeClass('no-clicking');
        }, duration);
    }

    function checkMatching(checkingBlocks){
        if(checkingBlocks[0].id == checkingBlocks[1].id){
            checkingBlocks.addClass('matched');
            checkingBlocks.removeClass('is-flipped');
            audioTrue.play();
        }else{
            let count = tries.text();
            tries.text(+count + 1);
            audioWrong.play();
            setTimeout(() => {
                checkingBlocks.removeClass('is-flipped');
            }, duration);
        }
    }

    function win(){
        audioWin.play();
        let storage = {
            newTries: tries.text(),
            newTiming: setT - remain
        };
         if(localStorage != null){
            let oldTries = JSON.parse(localStorage.getItem(playerName)).newTries;
            let oldTiming = JSON.parse(localStorage.getItem(playerName)).newTiming;
            if(+oldTiming < storage.newTiming ){
                storage.newTiming = +oldTiming;
            }
            if(+oldTries < +storage.newTries){
                storage.newTries = oldTries;
            }
        }
        localStorage.setItem(playerName, JSON.stringify(storage));
        finalImg.attr('src', 'files/gif/congrats.gif');
        congrats.css('background-color', 'rgba(11, 255, 15, 0.86)');
       
    }

    function lose(){
        audioLose.play();
        finalImg.attr('src', 'files/gif/lose.gif');
        congrats.css('background-color', 'rgba(255, 11, 11, 0.86)');
    }

    function endGame(){
        
        congrats.fadeIn();
        finalImg.fadeIn(1000);
        setTimeout(() => {
            finalImg.fadeOut();
            resetBtn.fadeIn()
        }, 4500);
    }

    function restart(){
        congrats.hide();
        finalImg.hide();
        resetBtn.hide();
        remain = setT;
        tries.text('0');
        playerName = "";
        $('.img-block').removeClass('matched').removeClass('is-flipped');
        $('.control-form').fadeIn();
        
    }
 /*    function flipBlock(block){
        block.addClass('is-flipped');
    } */

});