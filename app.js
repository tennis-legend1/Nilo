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

const categories = [
    "Personal",
    "Study",
    "Work",
    "Wellbeing",
    "Errand",
    "Project",
    "Other"
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



function saveTasks() {

    const tasks = []

    document.querySelectorAll(".task").forEach(task => {

        tasks.push({
            name: task.querySelector("strong").textContent,
            category: task.querySelector("span").textContent,
            completed: task.classList.contains("completed")
        })

    })

    localStorage.setItem("nilo-tasks", JSON.stringify(tasks))
}



function connectTask(task) {

    const check = task.querySelector(".check")
    const remove = task.querySelector(".remove")


    check.addEventListener("click", () => {

        task.classList.toggle("completed")

        check.textContent =
            task.classList.contains("completed") ? "✓" : ""

        updateProgress()
        saveTasks()
    })


    remove.addEventListener("click", () => {

        task.remove()

        updateProgress()
        saveTasks()
    })
}



function makeTask(name, category, completed = false) {

    const task = document.createElement("div")
    task.className = "task"

    task.dataset.category = category


    if (completed) {
        task.classList.add("completed")
    }


    const check = document.createElement("button")
    check.className = "check"
    check.setAttribute("aria-label", "Complete task")
    check.textContent = completed ? "✓" : ""


    const info = document.createElement("div")
    info.className = "task-info"


    const title = document.createElement("strong")
    title.textContent = name


    const categoryText = document.createElement("span")
    categoryText.textContent = category


    const remove = document.createElement("button")
    remove.className = "remove"
    remove.textContent = "×"
    remove.setAttribute("aria-label", "Remove task")


    info.append(title, categoryText)

    task.append(check, info, remove)

    document.querySelector("#task-list").appendChild(task)

    connectTask(task)
}



function loadTasks() {

    const saved = localStorage.getItem("nilo-tasks")

    if (!saved) {

        document.querySelectorAll(".task").forEach(task => {

            const category =
                task.querySelector("span").textContent

            task.dataset.category = category

            connectTask(task)

        })

        updateProgress()
        saveTasks()

        return
    }


    const tasks = JSON.parse(saved)

    document.querySelector("#task-list").innerHTML = ""


    tasks.forEach(task => {

        const category = categories.includes(task.category)
            ? task.category
            : "Other"

        makeTask(
            task.name,
            category,
            task.completed
        )

    })


    updateProgress()
}


loadTasks()



let currentCategory = "All"


function filterTasks() {

    document.querySelectorAll(".task").forEach(task => {

        if (
            currentCategory === "All" ||
            task.dataset.category === currentCategory
        ) {
            task.style.display = ""
        } else {
            task.style.display = "none"
        }

    })
}


document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", () => {

        currentCategory = button.dataset.category


        document.querySelectorAll(".filter").forEach(filter => {
            filter.classList.remove("active")
        })

        button.classList.add("active")

        filterTasks()
    })

})



document.querySelector("#add-task").addEventListener("click", () => {

    const name = prompt("What needs doing?")

    if (!name || !name.trim()) {
        return
    }


    const choice = prompt(
        "Choose a category:\n\n" +
        "1. Personal\n" +
        "2. Study\n" +
        "3. Work\n" +
        "4. Wellbeing\n" +
        "5. Errand\n" +
        "6. Project\n" +
        "7. Other"
    )

    if (!choice || !choice.trim()) {
        return
    }


    const typedCategory = choice.trim().toLowerCase()

    let category = null

    const numberMatch = typedCategory.match(/^(\d+)/)

    if (numberMatch) {

        const number = Number(numberMatch[1])

        if (number >= 1 && number <= categories.length) {
            category = categories[number - 1]
        }

    } else {

        category = categories.find(
            item => item.toLowerCase() === typedCategory
        )

    }


    if (!category) {

        alert(
            "Category not recognised.\n\n" +
            "Choose Personal, Study, Work, Wellbeing, " +
            "Errand, Project or Other."
        )

        return
    }


    makeTask(name.trim(), category)

    updateProgress()
    saveTasks()

    filterTasks()
})



let seconds = 25 * 60
let interval = null
let running = false

const finishSound = new Audio("sounds/finish.mp3")


function showTime() {

    const minutes = Math.floor(seconds / 60)
    const remaining = seconds % 60

    document.querySelector("#timer").textContent =
        `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`
}


function startSession() {

    if (seconds <= 0) {
        seconds = 25 * 60
        showTime()
    }

    running = true

    const button = document.querySelector("#session-button")

    button.textContent = "END SESSION"
    button.classList.add("running")

    document.querySelector("#session-status").textContent = "FOCUSING"


    interval = setInterval(() => {

        seconds--
        showTime()


        if (seconds <= 0) {

            clearInterval(interval)

            running = false
            seconds = 0

            button.textContent = "START SESSION"
            button.classList.remove("running")

            document.querySelector("#session-status").textContent = "FINISHED"

            showTime()

            finishSound.currentTime = 0
            finishSound.play().catch(() => {})
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
}


document.querySelector("#session-button").addEventListener("click", () => {

    if (running) {
        endSession()
    } else {
        startSession()
    }

})



let goal = localStorage.getItem("nilo-goal") || ""

const goalText = document.querySelector("#goal-text")


function showGoal() {

    goalText.textContent =
        goal || "Set a goal"
}


showGoal()


goalText.addEventListener("click", () => {

    const newGoal = prompt(
        "What are you aiming for?",
        goal
    )

    if (newGoal === null) {
        return
    }

    goal = newGoal.trim()

    localStorage.setItem("nilo-goal", goal)

    showGoal()
})



const sounds = {
    rain: new Audio("sounds/rain.mp3"),
    cafe: new Audio("sounds/cafe.mp3"),
    forest: new Audio("sounds/forest.mp3")
}


Object.values(sounds).forEach(sound => {
    sound.loop = true
})


let currentSound = null


function playSound(name) {

    Object.values(sounds).forEach(sound => {
        sound.pause()
        sound.currentTime = 0
    })


    if (name === "off") {

        currentSound = null

        document.querySelector("#sound-status").textContent = "OFF"

        return
    }


    currentSound = sounds[name]

    currentSound.play()

    document.querySelector("#sound-status").textContent =
        name.toUpperCase()
}


document.querySelectorAll(".sound").forEach(button => {

    button.addEventListener("click", () => {

        const sound = button.dataset.sound

        document.querySelectorAll(".sound").forEach(option => {
            option.classList.remove("active")
        })

        button.classList.add("active")

        playSound(sound)
    })

})