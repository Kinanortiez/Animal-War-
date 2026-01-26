// القائمة الكاملة (45 حيوان)
const allPossibleBeasts = [
    {e: "🦁", n: "أسد"}, {e: "🐯", n: "نمر"}, {e: "🐆", n: "فهد"}, {e: "🐺", n: "ذئب"},
    {e: "🦊", n: "ثعلب"}, {e: "🐻", n: "دب"}, {e: "🐨", n: "كوالا"}, {e: "🐼", n: "باندا"},
    {e: "🦓", n: "حمار وحشي"}, {e: "🦍", n: "غوريلا"}, {e: "🐘", n: "فيل"}, {e: "🦛", n: "فرس النهر"},
    {e: "🦏", n: "وحيد القرن"}, {e: "🐪", n: "جمل"}, {e: "🦒", n: "زرافة"}, {e: "🦘", n: "كانغر"},
    {e: "🐃", n: "جاموس"}, {e: "🐄", n: "بقرة"}, {e: "🦌", n: "غزال"}, {e: "🦅", n: "صقر"},
    {e: "🦉", n: "بومة"}, {e: "🐊", n: "تمساح"}, {e: "🐍", n: "ثعبان"}, {e: "🐢", n: "سلحفاة"},
    {e: "🦈", n: "قرش"}, {e: "🐬", n: "دلفين"}, {e: "🐙", n: "أخطبوط"}, {e: "🦀", n: "سلطعون"},
    {e: "🕷️", n: "عنكبوت"}, {e: "🦂", n: "عقرب"}, {e: "🐝", n: "نحلة"}, {e: "🦋", n: "فراشة"},
    {e: "🐜", n: "نملة"}, {e: "🦗", n: "جندب"}, {e: "🦟", n: "بعوضة"}, {e: "🐌", n: "حلزون"},
    {e: "🐞", n: "دعسوقة"}, {e: "🦎", n: "سحلية"}, {e: "🦇", n: "خفاش"}, {e: "🐒", n: "قرد"},
    {e: "🦫", n: "قندس"}, {e: "🦔", n: "قنفذ"}, {e: "🦚", n: "طاووس"}, {e: "🦩", n: "فلامينجو"}, {e: "🐧", n: "بطريق"}
];

let players = [];
let activeBeasts = [];
let gameStarted = false;

window.onload = function() { loadGameData(); };

function addPlayer() {
    const input = document.getElementById('playerName');
    const name = input.value.trim();

    if (players.length >= 45) return alert("الحد الأقصى 45 لاعب");
    if (name !== "") {
        players.push(name);
        input.value = "";
        
        let available = allPossibleBeasts.filter(b => !activeBeasts.some(ab => ab.n === b.n));
        if (available.length > 0) {
            let rand = Math.floor(Math.random() * available.length);
            activeBeasts.push(available[rand]);
        }
        
        saveGameData();
        updatePlayerCount();
        reDistributeAndRender();
    }
}

function updatePlayerCount() {
    document.getElementById('playerCount').innerText = `اللاعبون: ${players.length}`;
}

function reDistributeAndRender() {
    document.getElementById('winnerZone').style.display = "none";
    if (gameStarted && players.length === 1) {
        document.getElementById('gameGrid').innerHTML = ""; 
        document.getElementById('winnerZone').style.display = "block"; 
    } else {
        players = players.sort(() => Math.random() - 0.5);
        renderGrid();
    }
}

function renderGrid() {
    const grid = document.getElementById('gameGrid');
    grid.innerHTML = "";
    activeBeasts.forEach((beast, index) => {
        const card = document.createElement('div');
        card.className = "animal-card";
        card.innerHTML = `${beast.e} <span>${beast.n}</span>`;
        card.onclick = () => handleElimination(index, card);
        grid.appendChild(card);
    });
}

function handleElimination(index, cardElement) {
    if (players.length <= 1) return;

    gameStarted = true;
    playSound('lose');
    cardElement.classList.add('card-removing');

    setTimeout(() => {
        const eliminatedPlayer = players[index];
        const beast = activeBeasts[index];

        document.getElementById('elimAnimalIcon').innerText = beast.e;
        document.getElementById('eliminatedName').innerText = eliminatedPlayer;
        document.getElementById('beastMsg').innerText = `بواسطة: ${beast.n}`;
        document.getElementById('elimModal').style.display = "flex";

        players.splice(index, 1);
        activeBeasts.splice(index, 1);

        saveGameData();
        updatePlayerCount();
        reDistributeAndRender();
    }, 300);
}

function revealWinner() {
    if (players.length === 1) {
        playSound('win');
        document.getElementById('winnerName').innerText = players[0];
        document.getElementById('winModal').style.display = "flex";
    }
}

function removePlayer(index) {
    players.splice(index, 1);
    activeBeasts.splice(index, 1);
    saveGameData();
    updatePlayerCount();
    reDistributeAndRender();
    renderPlayerList();
}

function renderPlayerList() {
    const listUl = document.getElementById('fullPlayerList');
    listUl.innerHTML = "";
    players.forEach((p, i) => {
        let li = document.createElement('li');
        li.innerHTML = `<span>👤 ${p}</span> <button class="btn-delete" onclick="removePlayer(${i})">حذف</button>`;
        listUl.appendChild(li);
    });
}

function togglePlayerList() {
    const modal = document.getElementById('listModal');
    if (modal.style.display !== "flex") {
        renderPlayerList();
        modal.style.display = "flex";
    } else {
        modal.style.display = "none";
    }
}

function closeElimModal() {
    document.getElementById('elimModal').style.display = "none";
}

function saveGameData() {
    const gameState = { players: players, activeBeasts: activeBeasts, gameStarted: gameStarted };
    localStorage.setItem('animalWarData', JSON.stringify(gameState));
}

function loadGameData() {
    const savedData = localStorage.getItem('animalWarData');
    if (savedData) {
        const data = JSON.parse(savedData);
        players = data.players || [];
        activeBeasts = data.activeBeasts || [];
        gameStarted = data.gameStarted || false;
        updatePlayerCount();
        reDistributeAndRender();
    }
}

function fullReset() {
    if(confirm("هل أنت متأكد من الحذف والبدء من جديد؟")) {
        players = [];
        activeBeasts = [];
        gameStarted = false;
        localStorage.removeItem('animalWarData');
        document.getElementById('winModal').style.display = "none";
        document.getElementById('winnerZone').style.display = "none";
        document.getElementById('listModal').style.display = "none";
        updatePlayerCount();
        renderGrid();
    }
}

function playSound(type) {
    try {
        const sound = document.getElementById(type === 'win' ? 'soundWin' : 'soundLose');
        if (sound) { sound.currentTime = 0; sound.play().catch(e => {}); }
    } catch (e) {}
}
