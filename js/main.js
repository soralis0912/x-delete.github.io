let code = createManagedBookmarklet("delete");

document.addEventListener("DOMContentLoaded", () => {
    setUpAccordion();

    const targets = document.getElementsByClassName("let");
    if (targets[0]) targets[0].setAttribute("href", code);
    if (targets[2]) targets[2].setAttribute("href", code);

    const button = targets[1];
    if (button) {
        button.addEventListener("click", () => {
            if (!navigator.clipboard) {
                alert("このブラウザは対応していません");
                return;
            }
            navigator.clipboard.writeText(code).then(
                () => {
                    alert("コードをコピーしました。");
                },
                () => {
                    alert("コピーに失敗しました。");
                });
        });
    }
});

const setUpAccordion = () => {
    const details = document.querySelectorAll(".js-details");
    const IS_OPENED_CLASS = "is-opened";

    details.forEach((element) => {
        const summary = element.querySelector(".js-summary");
        const content = element.querySelector(".js-content");
        if (!summary || !content) return;

        summary.addEventListener("click", (event) => {
            event.preventDefault();
            if (element.classList.contains(IS_OPENED_CLASS)) {
                element.classList.toggle(IS_OPENED_CLASS);
                closingAnim(content, element).restart();
            } else {
                element.classList.toggle(IS_OPENED_CLASS);
                element.setAttribute("open", "true");
                openingAnim(content).restart();
            }
        });
    });
}

const closingAnim = (content, element) => gsap.to(content, {
    height: 0,
    opacity: 0,
    duration: 0.4,
    ease: "power3.out",
    overwrite: true,
    onComplete: () => {
        element.removeAttribute("open");
    },
});

const openingAnim = (content) => gsap.fromTo(
    content, {
        height: 0,
        opacity: 0,
    }, {
        height: "auto",
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
        overwrite: true,
    });
