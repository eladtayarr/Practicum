document.addEventListener("DOMContentLoaded", function () {
    const infoIcon = document.getElementById("infoIcon");
    const popup = document.getElementById("popup");
    const closePopup = document.getElementById("closePopup");

    // פתיחת ה-popup
    infoIcon.addEventListener("click", function () {
        popup.style.display = "block";
    });

    // סגירת ה-popup
    closePopup.addEventListener("click", function () {
        popup.style.display = "none";
    });

    // סגירה בלחיצה מחוץ ל-popup
    window.addEventListener("click", function (event) {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });
});