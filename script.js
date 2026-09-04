/* ---------------- DATA ---------------- */

const games = [
  { name: "RNG Dice Roller", path: "RNG_Dice_roller/Game.html", rank: "great", status: "Stopped", version: "Beta" },
  { name: "Website PWS 1", path: "Website_PWS_1/index.html", rank: "website", status: "Stopped", version: "Finished" },
  { name: "Website PWS 2", path: "Website_PWS_2/Home.html", rank: "website", status: "Stopped", version: "Finished" },
  { name: "PWS Stand-alone", path: "PWS_Stand-alone/test.html", rank: "website", status: "Stopped", version: "Finished" },
  { name: "Ultimate Car Generator", path: "Ultimate_Car_Generator/index.html", rank: "great", status: "Paused", version: "Alpha" },
  { name: "Countdown Game", path: "Countdown_Game/index.html", rank: "mid", status: "Stopped", version: "Prototype" },
  { name: "js Canvas Game", path: "js_Canvas_Game/Test.html", rank: "bad", status: "Stopped", version: "Prototype" },
  { name: "Car Trading Game", path: "Car_Trading_Game/index.html", rank: "mid", status: "Stopped", version: "Prototype" },
  { name: "Points Gamble", path: "Points_Gamble/index.php", rank: "mid", status: "Stopped", version: "Finished" },
  { name: "Testing Path", path: "Test/index.php", rank: "untested", status: "Paused", version: "Prototype" },
  { name: "Fatty Patty", path: "Fatty_Patty/index.html", rank: "great", status: "Stopped", version: "Prototype"},
  { name: "Repair Rampage", path: "Repair_Rampage/index.html", rank: "great", status: "Paused", version: "Alpha"},
  { name: "Car Clicker", path: "Car_Clicker/CarClicker.html", rank: "great", status: "Stopped", version: "Alpha"},
  { name: "Blackjack", path: "Blackjack/index.html", rank: "great", status: "In progress", version: "Alpha"},
  { name: "Kattennamen Systeem", path: "kattennamen_systeem/index.html", rank: "great", status: "Stopped", version: "Finished"},
  { name: "TaskManager", path: "TaskManager/index.html", rank: "bad", status: "Stopped", version: "Alpha"}
];

const rankColors = {
  great: "bg-green-600",
  mid: "bg-yellow-600",
  bad: "bg-red-600",
  website: "bg-purple-600",
  miscellaneous: "bg-blue-600",
  untested: "bg-gray-600"
};

const ranksOrder = ["great","mid","bad","website","miscellaneous","untested"];

/* ---------------- RENDER ---------------- */

const gameList = document.getElementById("gameList");

function renderGames() {
  const grouped = Object.fromEntries(ranksOrder.map(r => [r, []]));
  games.forEach(g => grouped[g.rank].push(g));

  gameList.innerHTML = ranksOrder.map(rank => {
    if (!grouped[rank].length) return "";

    return `
      <div>
        <h2 class="text-2xl font-semibold mb-2">${rank.toUpperCase()}</h2>
        <div class="flex flex-wrap">
          ${grouped[rank].map(g => `
            <div class="gameBox relative h-28 w-64 ${rankColors[rank]}
                        hover:opacity-80 rounded-xl flex items-center
                        justify-center text-center m-1 p-4 cursor-pointer"
                 data-path="${g.path}">
              <span class="text-xl font-bold">${g.name}</span>
              <span class="absolute bottom-2 left-3 text-xs">${g.status}</span>
              <span class="absolute bottom-2 right-3 text-xs opacity-70">${g.version}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }).join("");
}

renderGames();

/* ---------------- TOOLTIP ---------------- */

const tooltip = document.getElementById("tooltip");
const tooltipLinks = document.getElementById("tooltipLinks");
const tooltipOpen = document.getElementById("tooltipOpen");

document.addEventListener("click", e => {
  const box = e.target.closest(".gameBox");
  if (!box) {
    tooltip.classList.add("hidden");
    return;
  }
  openTooltip(box);
});

async function openTooltip(box) {
  const rect = box.getBoundingClientRect();
  const path = box.dataset.path;
  const baseDir = path.substring(0, path.lastIndexOf("/"));

  tooltip.style.top = `${window.scrollY + rect.bottom + 10}px`;
  tooltip.style.left = `${rect.left + rect.width / 2 - 128}px`;
  tooltipOpen.href = path;

  tooltipLinks.innerHTML =
    `<p class="text-sm text-gray-400">Checking for logs...</p>`;
  tooltip.classList.remove("hidden");

  const files = ["ChangeLogs.txt","ToDo.txt"];
  const available = [];

  for (const f of files) {
    try {
      const res = await fetch(`${baseDir}/${f}`);
      if (res.ok) available.push(f);
    } catch {}
  }

  tooltipLinks.innerHTML = available.length
    ? available.map(f =>
        `<a href="${baseDir}/${f}" target="_blank"
           class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm">
           ${f}
         </a>`).join("")
    : `<p class="text-gray-400 italic">No extra files found.</p>`;
}

/* ---------------- OVERLAY ---------------- */

const overlay = document.getElementById("overlayPopup");
const overlayTitle = document.getElementById("overlayTitle");
const overlayContent = document.getElementById("overlayContent");
const overlayFiles = document.getElementById("overlayFiles");

document.getElementById("closeOverlay")
  .onclick = () => overlay.classList.add("hidden");

overlay.onclick = e => {
  if (e.target === overlay) overlay.classList.add("hidden");
};

const helpText = `
Welcome to my (XTGR) project page!

- Click a project box to see details.
- Logs appear automatically if present.
- Use "Open Project" to launch it.
`;

const infoText = `
My Projects Page by XTGR

Projects are grouped by rank.
Status and version are displayed.

Version: 1.1
`;

document.getElementById("helpBtn").onclick = () => {
  overlayTitle.textContent = "Help";
  overlayContent.textContent = helpText.trim();
  overlayFiles.innerHTML = "";
  overlay.classList.remove("hidden");
};

document.getElementById("infoBtn").onclick = async () => {
  overlayTitle.textContent = "Info";
  overlayContent.textContent = infoText.trim();
  overlayFiles.innerHTML = "";

  const files = ["ChangeLogs.txt","ToDo.txt"];
  let found = false;

  for (const f of files) {
    try {
      const res = await fetch(f);
      if (res.ok) {
        found = true;
        const btn = document.createElement("a");
        btn.href = f;
        btn.target = "_blank";
        btn.textContent = f;
        btn.className =
          "bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm";
        overlayFiles.appendChild(btn);
      }
    } catch {}
  }

  if (!found) {
    overlayFiles.innerHTML =
      `<span class="text-gray-400 italic text-sm">
        No ChangeLogs.txt or ToDo.txt found
       </span>`;
  }

  overlay.classList.remove("hidden");
};

/* ---------------- Task manager ---------------- */
const taskBtn = document.getElementById("TaskManagerBtn");

taskBtn.addEventListener("click", () => {
  window.location.href = "TaskManager/index.html", "_blank";
});
