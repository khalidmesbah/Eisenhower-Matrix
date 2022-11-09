/* store */
const doQuadrant = document.querySelector(".do");
const scheduleQuadrant = document.querySelector(".schedule");
const delegateQuadrant = document.querySelector(".delegate");
const deleteQuadrant = document.querySelector(".delete");
const doQuadrantBtn = document.getElementById("add-to-quadrant-do");
const scheduleQuadrantBtn = document.getElementById("add-to-quadrant-schedule");
const delegateQuadrantBtn = document.getElementById("add-to-quadrant-delegate");
const deleteQuadrantBtn = document.getElementById("add-to-quadrant-delete");

function detectBrowser() {
  let userAgent = navigator.userAgent;
  let browserName;

  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "firefox";
  } else if (userAgent.match(/safari/i)) {
    browserName = "safari";
  } else if (userAgent.match(/opr\//i)) {
    browserName = "opera";
  } else if (userAgent.match(/edg/i)) {
    browserName = "edge";
  } else {
    browserName = "No browser detection";
  }

  return browserName;
}
const getTasks = (quadrant) => {
  if (detectBrowser === "firefox") {
    if (!localStorage[quadrant]) {
      localStorage[quadrant] = "";
      return [];
    }
    return localStorage[quadrant].split(",");
  } else {
    if (!localStorage[quadrant]) {
      localStorage[quadrant] = JSON.stringify([]);
      return [];
    }
    return JSON.parse(localStorage[quadrant]);
  }
};

const addTask = (quadrant, task) => {
  const p = document.createElement("p");
  const textSpan = document.createElement("span");
  const deleteSpan = document.createElement("span");
  deleteSpan.textContent = "❌";
  deleteSpan.style.cursor = "pointer";
  deleteSpan.style.paddingInline = "5px";
  deleteSpan.addEventListener(`click`, () => {
    p.remove();
    storeToLocalStorage();
  });
  p.draggable = true;
  textSpan.textContent = task;
  textSpan.className = `text`;
  p.appendChild(textSpan);
  p.appendChild(deleteSpan);
  quadrant.appendChild(p);
};

const addSpecialTask = (quadrant, task) => {
  const p = document.createElement("p");
  p.className = "special";
  p.style.background = `gold`;
  p.style.color = `#333`;
  p.style.fontWeight = `bolder`;
  const textSpan = document.createElement("span");
  const deleteSpan = document.createElement("span");
  deleteSpan.textContent = "❌";
  deleteSpan.style.cursor = "pointer";
  deleteSpan.style.paddingInline = "5px";
  deleteSpan.addEventListener(`click`, () => {
    p.remove();
    storeToLocalStorage();
  });
  p.draggable = true;
  textSpan.textContent = task;
  textSpan.className = `text`;
  p.appendChild(textSpan);
  p.appendChild(deleteSpan);
  quadrant.appendChild(p);
};

const noonTasks = [
  "1 Page Quran",
  "Morning's Azkar",
  "Dua",
  "2 Hours For The College",
];
const afterNoonTasks = ["Asking Of Forgiveness"];
const eveningTasks = ["Night's Azkar"];

(() => {
  const time = new Date().getHours();
  if (time > 5 && time <= 12) {
    localStorage.special = JSON.stringify(noonTasks);
  } else if (time > 12 && time <= 17) {
    localStorage.special = JSON.stringify(afterNoonTasks);
  } else {
    localStorage.special = JSON.stringify(eveningTasks);
  }
  getTasks("special").forEach((task) => {
    addSpecialTask(doQuadrant, task);
  });
})();

const shuffleTasks = (quadrant) => {
  const theQuadrant = document.querySelector(`.${quadrant}`);
  const tasks = [...theQuadrant.children].map(
    (e) => e.querySelector(".text").textContent
  );
  theQuadrant.innerHTML = ``;
  for (let i = tasks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tasks[i], tasks[j]] = [tasks[j], tasks[i]];
  }
  for (let i = 0; i < tasks.length; i++) {
    addTask(theQuadrant, tasks[i]);
  }
  storeToLocalStorage();
  refresh();
};

// store to local storage

const storeQuadrantDo = () => {
  const tasks = [
    ...document
      .querySelector(".do")
      .querySelectorAll("p:not(.special) span.text"),
  ].map((e) => e.textContent);
  localStorage.do = JSON.stringify(tasks);
};
const storeQuadrantSchedule = () => {
  const tasks = [
    ...document
      .querySelector(".schedule")
      .querySelectorAll("p:not(.special) span.text"),
  ].map((e) => e.textContent);
  localStorage.schedule = JSON.stringify(tasks);
};
const storeQuadrantDelegate = () => {
  const tasks = [
    ...document
      .querySelector(".delegate")
      .querySelectorAll("p:not(.special) span.text"),
  ].map((e) => e.textContent);
  localStorage.delegate = JSON.stringify(tasks);
};
const storeQuadrantDelete = () => {
  const tasks = [
    ...document
      .querySelector(".delete")
      .querySelectorAll("p:not(.special) span.text"),
  ].map((e) => e.textContent);
  localStorage.delete = JSON.stringify(tasks);
};

const storeToLocalStorage = () => {
  storeQuadrantDo();
  storeQuadrantSchedule();
  storeQuadrantDelegate();
  storeQuadrantDelete();
};

// retrieve from local storage
(() => {
  getTasks("do").forEach((task) => addTask(doQuadrant, task));
  getTasks("schedule").forEach((task) => addTask(scheduleQuadrant, task));
  getTasks("delegate").forEach((task) => addTask(delegateQuadrant, task));
  getTasks("delete").forEach((task) => addTask(deleteQuadrant, task));
})();

/* event listeners */

doQuadrantBtn.addEventListener(`click`, () => {
  const task = prompt("Type the task:");
  if (!task) return;
  if (getTasks("do").includes(task)) return;
  addTask(doQuadrant, task);
  storeQuadrantDo();
  refresh();
});
scheduleQuadrantBtn.addEventListener(`click`, () => {
  const task = prompt("Type the task:");
  if (!task) return;
  if (getTasks("schedule").includes(task)) return;
  addTask(scheduleQuadrant, task);
  storeQuadrantSchedule();
  refresh();
});
delegateQuadrantBtn.addEventListener(`click`, () => {
  const task = prompt("Type the task:");
  if (!task) return;
  if (getTasks("delegate").includes(task)) return;
  addTask(delegateQuadrant, task);
  storeQuadrantDelegate();
  refresh();
});
deleteQuadrantBtn.addEventListener(`click`, () => {
  const task = prompt("Type the task:");
  if (!task) return;
  if (getTasks("delete").includes(task)) return;
  addTask(deleteQuadrant, task);
  storeQuadrantDelete();
  refresh();
});

const shuffleQuadrantBtns = document.querySelectorAll("[id^=shuffle-quadrant]");
shuffleQuadrantBtns.forEach((btn) => {
  btn.addEventListener(`click`, () => {
    shuffleTasks(btn.id.split("-")[2]);
  });
});

/* logic */
const refresh = () => {
  const draggables = document.querySelectorAll("[draggable='true']");
  const containers = document.querySelectorAll(".quadrant .content");

  draggables.forEach((draggable) => {
    draggable.addEventListener(`dragstart`, () => {
      containers.forEach((c) => c.classList.add("droppable"));
      draggable.classList.add("dragging");
    });
    draggable.addEventListener(`dragend`, () => {
      containers.forEach((c) => c.classList.remove("droppable"));
      draggable.classList.remove("dragging");
      storeToLocalStorage();
    });
  });

  containers.forEach((c) => {
    c.addEventListener(`dragover`, ({ clientY: y }) => {
      c.classList.add("drop-here");
      const draggable = document.querySelector(`.dragging`);
      if (draggable === null) return;
      if (c.children.length === 0) {
        c.appendChild(draggable);
        return;
      }
      const { afterElement } = getAfterAndBeforeElements(c, y);
      draggables.forEach((d) => d.removeAttribute(`style`));
      if (afterElement === null) {
        const { height } = c.lastElementChild.getBoundingClientRect();
        c.lastElementChild.style.marginBottom = `${height + 20}px`;
        draggable.style.marginBottom = `10px`;
        c.appendChild(draggable);
      } else {
        const { height } = afterElement.getBoundingClientRect();
        afterElement.style.marginTop = `${height + 20}px`;
        draggable.style.marginBottom = `-${height + 10}px`;
        c.insertBefore(draggable, afterElement);
      }
    });
    c.addEventListener("dragleave", () => {
      c.classList.remove("drop-here");
    });
  });

  const getAfterAndBeforeElements = (container, y) => {
    const draggableElements = [
      ...container.querySelectorAll("[draggable='true']:not(.dragging)"),
    ];
    return draggableElements.reduce(
      (closest, element) => {
        const { height, top } = element.getBoundingClientRect();
        const center = y - top - height / 2;
        if (center < 0 && center > closest.center) {
          return { center, afterElement: element };
        }
        return closest;
      },
      { center: Number.NEGATIVE_INFINITY, afterElement: null }
    );
  };
};

refresh();
