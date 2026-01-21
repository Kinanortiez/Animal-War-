// القائمة الكبيرة للحيوانات
const allPossibleBeasts = [
    {e: "🦁", n: "أسد"}, {e: "🐯", n: "نمر"}, {e: "🐆", n: "فهد"}, {e: "🐺", n: "ذئب"},
    {e: "🦊", n: "ثعلب"}, {e: "🐻", n: "دب"}, {e: "🐨", n: "كوالا"}, {e: "🐼", n: "باندا"},
    {e: "🦆", n: "بطة"}, {e: "🦍", n: "غوريلا"}, {e: "🐘", n: "فيل"}, {e: "🦛", n: "فرس النهر"},
    {e: "🦏", n: "وحيد القرن"}, {e: "🐪", n: "جمل"}, {e: "🦒", n: "زرافة"}, {e: "🦘", n: "كانغر"},
    {e: "🐃", n: "جاموس"}, {e: "🐄", n: "بقرة"}, {e:"🦌", n: "غزال"}, {e: "🦅", n: "صقر"},
    {e: "🦉", n: "بومة"}, {e: "🐊", n: "تمساح"}, {e: "🐍", n: "ثعبان"}, {e: "🐢", n: "سلحفاة"},
    {e: "🦈", n: "قرش"}, {e: "🐬", n: "دولفين"}, {e: "🐙", n: "أخطبوط"}, {e: "🦀", n: "سلطعون"},
    {e: "🕷️", n: "عنكبوت"}, {e: "🦂", n: "عقرب"}, {e: "🐝", n: "نحلة"}, {e: "🦋", n: "فراشة"},
    {e: "🐜", n: "نملة"}, {e: "🦗", n: "جندب"}, {e: "🦟", n: "بعوضة"}, {e: "🐌", n: "حلزون"},
    {e: "🐞", n: "دعسوقة"}, {e: "🦎", n: "سحلية"}, {e: "🦇", n: "خفاش"}, {e: "🐒", n: "قرد"}
];

let players = [];
let activeBeasts = []; // الحيوانات الظاهرة حالياً في اللعبة

function addPlayer() {
    const input = document.getElementById('playerName');
    const name = input.value.trim();

    if (players.length >= 40) return alert("الحد الأقصى 40 لاعب");
    if (name !== "") {
        players.push(name);
        input.value = "";
        
        // عند إضافة لاعب، نختار حيوان عشوائي لم يظهر من قبل
        addRandomBeast();
        
        updatePlayerCount();
        reDistributeAndRender();
    }
}

function addRandomBeast() {
    // جلب الحيوانات التي ليست في اللعبة حالياً
    let available = allPossibleBeasts.filter(b => !activeBeasts.some(ab => ab.n === b.n));
    if (available.length > 0) {
        let rand = Math.floor(Math.random() * available.length);
        activeBeasts.push(available[rand]);
    }
}

function removePlayer(index) {
    players.splice(index, 1);
    activeBeasts.splice(index, 1); // حذف أيقونة مقابلة
    updatePlayerCount();
    reDistributeAndRender();
    renderPlayerList();
}

function updatePlayerCount() {
    document.getElementById('playerCount').innerText = `اللاعبون النشطون: ${players.length}`;
}

function reDistributeAndRender() {
    // خلط اللاعبين عشوائياً
    players = players.sort(() => Math.random() - 0.5);
    renderGrid();
}

function renderGrid() {
    const grid = document.getElementById('gameGrid');
    grid.innerHTML = "";

    // نمر على الحيوانات النشطة فقط
    activeBeasts.forEach((beast, index) => {
        const card = document.createElement('div');
        card.className = "animal-card";
        card.innerHTML = `${beast.e} <span>${beast.n}</span>`;
        card.onclick = () => handleElimination(index);
        grid.appendChild(card);
    });
}

function handleElimination(index) {
    const eliminatedPlayer = players[index];
    const beast = activeBeasts[index];

    // إظهار الإقصاء
    document.getElementById('elimAnimalIcon').innerText = beast.e;
    document.getElementById('eliminatedName').innerText = eliminatedPlayer;
    document.getElementById('beastMsg').innerText = `تم إقصاؤك بواسطة: ${beast.n}`;
    document.getElementById('elimModal').style.display = "flex";

    // حذف اللاعب من القائمة
    players.splice(index, 1);
    // حذف الحيوان/الأيقونة التي تم اختيارها نهائياً من الجولة
    activeBeasts.splice(index, 1);

    updatePlayerCount();
    reDistributeAndRender(); // إعادة خلط الباقين
}

function renderPlayerList() {
    const listUl = document.getElementById('fullPlayerList');
    listUl.innerHTML = "";
    players.forEach((p, i) => {
        let li = document.createElement('li');
        li.innerHTML = `<span>👤 ${p}</span> <button class="btn-delete" onclick="removePlayer(${i})">❌</button>`;
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

function resetGame() {
    if(confirm("إعادة ضبط اللعبة؟")) {
        players = [];
        activeBeasts = [];
        updatePlayerCount();
        renderGrid();
    }
}
