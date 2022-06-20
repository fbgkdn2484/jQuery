
// 사용 변수
var nando = 0;
var SETTING_TIME = 10;
var nanyido = 10;
let words = [];
let time;
let isPlaying = false;
let score = 0;
var sori1 = document.getElementById("testMusic2").volume = 0.3;
var sori = document.getElementById("testMusic1").volume = 0.4;  //효과음


const url = "https://random-word-api.herokuapp.com/word?number=100";
const timeDisplay = document.querySelector('.time')
const button = document.querySelector('.button')
const wordDisplay = document.querySelector('.word-display')
const wordInput = document.querySelector('.word-input')
const scoreDisplay = document.querySelector('.score')
const nanyidoDisplay = document.querySelector('.nanyido')


init();
function init() {
    getWords();
    wordInput.addEventListener('input', checkMatch)
}


function nan1() { //난이도 상승
    if (nando + 10 > 1) {
        nando -= 1;
        nanyido -=1;
        testMusic2.play();
    }
    nanyidoDisplay.innerText = nanyido;
    wordInput.focus()
}

function nan2() { //난이도  하락
    nando += 1;
    nanyido += 1;
    nanyidoDisplay.innerText = nanyido;
    wordInput.focus()
    testMusic2.play();
}



function checkStatus() {     //시간이 0이 되면 실행되는 함수
    if (!isPlaying && time === 0) {
        isPlaying = false;
        buttonChange('start', '게임시작');
        clearInterval(checkInterval)
        testMusic.pause();
        testMusic.load();
    }
}

function checkMatch() {   //단어 일치 체크
    if (wordInput.value.toLowerCase() === wordDisplay.innerText.toLowerCase()) {
        wordInput.value = "";
        if (!isPlaying) {
            runNotification('error')
            return
        }
        testMusic1.play();      //효과음
        score++;
        scoreDisplay.innerText = score;
        time = SETTING_TIME + nando;     //난이도
        const randomIndex = Math.floor(Math.random() * words.length)
        wordDisplay.innerText = words[randomIndex];
        runNotification('success')
    }
}




function run() {    //프로그램을 실행하면 바로 실행되는 함수
    if (words.length < 1) {
        return;
    }
    if (isPlaying) {     // 추가
        return;
    }
    wordInput.value = "";
    wordInput.focus()
    score = 0;
    scoreDisplay.innerText = 0;
    time = SETTING_TIME + nando;     //난이도
    isPlaying = true;
    timeInterval = setInterval(countDown, 1000)
    checkInterval = setInterval(checkStatus, 50)    //시간이 0이 되는지 계속 체크하게 하는 함수를 실행 시키도록 하는 것
    buttonChange('loading', '게임중')
    testMusic.loop = true;
    testMusic.play();
}

function countDown() {      //남은 시간이 1초씩 감소하는 함수
    time > 0 ? time-- : isPlaying = false;
    timeDisplay.innerText = time;
    if (!isPlaying) {
        clearInterval(timeInterval)
    }
    console.log('count')
}

// 단어 가져오기
function getWords() {
    axios.get(url).then((res) => {

        res.data.forEach((word) => {
            if (word.length < 7) {
                words.push(word);
            }
            buttonChange('start', '게임시작')    // 단어를 다 받아오면
        })
    }).catch((err) => {
        console.log(err);
    })
}

function buttonChange(type, text) {
    button.innerText = text;
    type === 'loading' ? button.classList.add('loading') : button.classList.remove('loading')
}



function runNotification(type) {      
    // toastify options
    const option = {
        text: `${wordDisplay.innerText}!!`,
        duration: 3000,
        newWindow: true,
        gravity: "top", // `top` or `bottom`
        position: 'left', // `left`, `center` or `right`
        backgroundColor: "linear-gradient(to right, #ff99a2, #ffe8da)"
    }
    if (type === 'error') {
        option.text = '우선 게임시작 버튼을 눌러주세요'
        option.position = 'right'
        option.backgroundColor = '#ff4b44'
    }

    Toastify(option).showToast();
}