const nav = document.querySelector(".nav"),
    navList = nav.querySelectorAll("li"),
    totalNavList = navList.length,
    allSection = document.querySelectorAll(".section"),
    totalSection = allSection.length;

for (let i = 0; i < totalNavList; i++) {
    const navElement = navList[i].querySelector("a");

    navElement.addEventListener("click", function () {
        removeBackSectionClass();

        for (let j = 0; j < totalNavList; j++) {
            if (navList[j].querySelector("a").classList.contains("active")) {
                addBackSectionClass(j)
            }
            navList[j].querySelector("a").classList.remove("active");
        }

        this.classList.add("active");
        showSection(this);

        if (window.innerWidth < 1200) {
            asideSectionTogglerBtn();
        }

    })
}

document.querySelector(".hire-me").addEventListener("click", function () {
    const sectionIndex = this.getAttribute("data-section-index");
    showSection(this);
    updateNav(this);
    removeBackSectionClass();
    addBackSectionClass(sectionIndex);
})

function removeBackSectionClass() {
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.remove("back-section");
    }
}

function addBackSectionClass(num) {
    allSection[num].classList.add("back-section");
}

function showSection(element) {
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.remove("active");
    }

    const target = element.getAttribute("href");
    document.querySelector(target).classList.add("active")
}

function updateNav(element) {
    for (let i = 0; i < totalNavList; i++) {
        navList[i].querySelector("a").classList.remove("active");
        const target = element.getAttribute("href").split("#")[1];
        if (target == navList[i].querySelector("a").getAttribute("href").split("#")[1]) {
            navList[i].querySelector("a").classList.add("active");
        }
    }
}

const navTogglerBtn = document.querySelector(".nav-toggler"),
    aside = document.querySelector(".aside");

navTogglerBtn.addEventListener("click", asideSectionTogglerBtn)

function asideSectionTogglerBtn() {
    aside.classList.toggle("navOpen");
    navTogglerBtn.classList.toggle("navOpen");

    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.toggle("navOpen");
    }
}