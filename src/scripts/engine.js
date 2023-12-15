const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    actions: {
        button: document.getElementById("next-duel"),

    },
    playerSides: {
        player: "player-cards",
        playerBox: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards"),


    }

};

const playerSides = {
    player: "player-cards",
    computer: "computer-cards",

}

const pathImages = "/src/assets/icons/"
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [2]
    }
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function setCardFields(cardId) {
    await removeAllCardsImages();
    await hiddenCardDetails()
    await showHiddenCardFields(true)
    let computerCardId = await getRandomCardId()
    drawCarsInfield(cardId,computerCardId)
    let duelResults = await checkDuelResults(cardId, computerCardId);
    await updateScore();
    await drawButton(duelResults);

}
async function showHiddenCardFields(value) {
    if (value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    } else {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}
async function drawCarsInfield(cardId,computerCardId){
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}
async function hiddenCardDetails() {
    state.cardSprites.src = ""
    state.cardSprites.name.innerText = ""
    state.cardSprites.type.innerText = ""


}

async function drawButton(text) {
    ;
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "draw";
    let playerCard = cardData[playerCardId]
    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "win";
        state.score.playerScore++

    }
    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "lose";
        state.score.computerScore++
    }
    await playAudio(duelResults)
    return duelResults
}

async function removeAllCardsImages() {
    let cards = state.playerSides.computerBox;
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove())
    cards = state.playerSides.playerBox;
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove())
}




async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "/src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard)
    cardImage.classList.add("card");
    if (fieldSide === playerSides.player) {
        cardImage.addEventListener("click", () => {
            console.log(idCard)
            setCardFields(cardImage.getAttribute("data-id"))
        })

        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(idCard)
        });
    }
    return cardImage
}

async function drawSelectCard(index) {
    console.log(cardData[index])
    state.cardSprites.avatar.src = cardData[index].img
    state.cardSprites.name.innerText = cardData[index].name
    state.cardSprites.type.innerText = "Atribute : " + cardData[index].type
}

async function drawCards(cardNumber, fieldSide) {
    for (let i = 0; i < cardNumber; i++) {
        const randonIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randonIdCard, fieldSide)
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}
async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    showHiddenCardFields(false)
    init()
}

async function playAudio(status) {
    try {
        const audio = new Audio(`src/assets/audios/${status}.wav`);
        audio.play()
    } catch {
    }
}
async function bkAudio(){
    //funcção criada pois alguns navagadores não rodam ate ter  tido alguma interação com a pagina
    const bgm = document.getElementById("bgm");
    bgm.play()
}
function init() {
    showHiddenCardFields(false)
    drawCards(5, playerSides.player);
    drawCards(5, playerSides.computer);


}
init()