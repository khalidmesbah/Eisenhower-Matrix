/* store */
const doQuadrant = document.querySelector(".do");
const scheduleQuadrant = document.querySelector(".schedule");
const delegateQuadrant = document.querySelector(".delegate");
const deleteQuadrant = document.querySelector(".delete");
const doQuadrantBtn = document.getElementById("add-to-quadrant-do");
const scheduleQuadrantBtn = document.getElementById("add-to-quadrant-schedule");
const delegateQuadrantBtn = document.getElementById("add-to-quadrant-delegate");
const deleteQuadrantBtn = document.getElementById("add-to-quadrant-delete");

const addTask = (quadrant, task) => {
  const p = document.createElement("p");
  p.draggable = true;
  p.textContent = task;
  quadrant.appendChild(p);
};

// store to local storage

const storeQuadrantDo = () => {
  const tasks = [...document.querySelector(".do").querySelectorAll("p")].map(
    (e) => e.textContent
  );
  localStorage.do = JSON.stringify(tasks);
};
const storeQuadrantSchedule = () => {
  const tasks = [
    ...document.querySelector(".schedule").querySelectorAll("p"),
  ].map((e) => e.textContent);
  localStorage.schedule = JSON.stringify(tasks);
};
const storeQuadrantDelegate = () => {
  const tasks = [
    ...document.querySelector(".delegate").querySelectorAll("p"),
  ].map((e) => e.textContent);
  localStorage.delegate = JSON.stringify(tasks);
};
const storeQuadrantDelete = () => {
  const tasks = [
    ...document.querySelector(".delete").querySelectorAll("p"),
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
  localStorage.do &&
    [...JSON.parse(localStorage.do)].forEach((task) =>
      addTask(doQuadrant, task)
    );
  localStorage.schedule &&
    [...JSON.parse(localStorage.schedule)].forEach((task) =>
      addTask(scheduleQuadrant, task)
    );
  localStorage.delegate &&
    [...JSON.parse(localStorage.delegate)].forEach((task) =>
      addTask(delegateQuadrant, task)
    );
  localStorage.delete &&
    [...JSON.parse(localStorage.delete)].forEach((task) =>
      addTask(deleteQuadrant, task)
    );
})();

/* event listeners */

doQuadrantBtn.addEventListener(`click`, () => {
  const task = prompt("Type the task:");
  if (!task) return;
  addTask(doQuadrant, task);
  storeQuadrantDo();
  refresh();
});
scheduleQuadrantBtn.addEventListener(`click`, () => {
  const task = prompt("Type the task:");
  if (!task) return;
  addTask(scheduleQuadrant, task);
  storeQuadrantSchedule();
  refresh();
});
delegateQuadrantBtn.addEventListener(`click`, () => {
  const task = prompt("Type the task:");
  if (!task) return;
  addTask(delegateQuadrant, task);
  storeQuadrantDelegate();
  refresh();
});
deleteQuadrantBtn.addEventListener(`click`, () => {
  const task = prompt("Type the task:");
  if (!task) return;
  addTask(deleteQuadrant, task);
  storeQuadrantDelete();
  refresh();
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
      const draggable = document.querySelector(`.dragging`);
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
