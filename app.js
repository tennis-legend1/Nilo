const now = new Date()

const days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY"
]

const months = [
    "JAN", "FEB", "MAR", "APR",
    "MAY", "JUN", "JUL", "AUG",
    "SEP", "OCT", "NOV", "DEC"
]


document.querySelector("#day").textContent = days[now.getDay()]

document.querySelector("#date").textContent =
    `${now.getDate()} ${months[now.getMonth()]}`


let greeting = "GOOD MORNING"

if (now.getHours() >= 12) {
    greeting = "GOOD AFTERNOON"
}

if (now.getHours() >= 18) {
    greeting = "GOOD EVENING"
}

document.querySelector("#greeting").textContent = greeting



function updateProgress() {

    const tasks = document.querySelectorAll(".task")
    const completed = document.querySelectorAll(".task.completed")

    let percent = 0

    if (tasks.length) {
        percent = Math.round((completed.length / tasks.length) * 100)
    }

    document.querySelector("#progress-number").textContent = `${percent}%`
}


function connectTask(task) {

    const check = task.querySelector(".check")
    const remove = task.querySelector(".remove")


    check.addEventListener("click", () => {

        task.classList.toggle("completed")

        check.textContent =
            task.classList.contains("completed") ? "✓" : ""

        updateProgress()
    })


    remove.addEventListener("click", () => {

        task.remove()

        updateProgress()
    })
}


document.querySelectorAll(".task").forEach(connectTask)

updateProgress()



document.querySelector("#add-task").addEventListener("click", () => {

    const name = prompt("What needs doing?")

    if (!name || !name.trim()) {
        return
    }


    const category = prompt(
        "Choose a category:\n\nPersonal\nStudy\nWork\nWellbeing\nErrand\nProject\nOther"
    )

    if (!category || !category.trim()) {
        return
    }


    const task = document.createElement("div")
    task.className = "task"


    const check = document.createElement("button")
    check.className = "check"
    check.setAttribute("aria-label", "Complete task")


    const info = document.createElement("div")
    info.className = "task-info"


    const title = document.createElement("strong")
    title.textContent = name.trim()


    const categoryText = document.createElement("span")
    categoryText.textContent = category.trim()


    const remove = document.createElement("button")
    remove.className = "remove"
    remove.textContent = "×"
    remove.setAttribute("aria-label", "Remove task")


    info.append(title, categoryText)

    task.append(check, info, remove)


    document.querySelector("#task-list").appendChild(task)

    connectTask(task)
    updateProgress()
})


let seconds = 25 * 60
let interval = null
let running = false



function showTime() {

    const minutes = Math.floor(seconds / 60)
    const remaining = seconds % 60

    document.querySelector("#timer").textContent =
        `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`
}


function startSession() {

    running = true

    const button = document.querySelector("#session-button")

    button.textContent = "END SESSION"

    button.classList.add("running")

    document.querySelector("#session-status").textContent = "FOCUSING"
    document.querySelector("#timer-text").textContent = "Stay with it."


    interval = setInterval(() => {

        seconds--
        showTime()



        if (seconds <= 0) {

            clearInterval(interval)

            running = false
            seconds = 25 * 60

            button.textContent = "START SESSION"
            button.classList.remove("running")

            document.querySelector("#session-status").textContent = "FINISHED"
            document.querySelector("#timer-text").textContent = "Nice work."

            showTime()
        }

    }, 1000)
}


function endSession() {

    clearInterval(interval)

    running = false
    seconds = 25 * 60

    showTime()


    document.querySelector("#session-button").textContent = "START SESSION"
    document.querySelector("#session-button").classList.remove("running")

    document.querySelector("#session-status").textContent = "READY"
    document.querySelector("#timer-text").textContent = "One thing at a time."
}


document.querySelector("#session-button").addEventListener("click", () => {

    if (running) {
        endSession()
    } else {
        
        startSession()
    }

})