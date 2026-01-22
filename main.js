const parentElement = document.getElementsByClassName("cart-summary-list")[0];
const totalLine = parentElement.querySelector(":nth-child(8)");

function updateTaxDisplay() {
    const numberSpan = totalLine.querySelector("span");
    if (!numberSpan) {
        return
    };

    const rawText = numberSpan.innerText;
    const cleanNumber = parseFloat(rawText.replace(/[^0-9.]/g, ""));
    const newTotal = (cleanNumber * 1.19).toFixed(3);

    let taxRow = document.getElementById("AliTaxCalc");

    if (taxRow) {
        const contentSpan = taxRow.querySelector(".cart-summary-item-wrapStyle-content span");
        if (contentSpan) {
            contentSpan.innerText = "$" + newTotal
        };
    } else {
        const newline = document.createElement("div");
        newline.id = "AliTaxCalc";
        newline.className = "cart-summary-item-wrapStyle";
        newline.style.fontWeight = "600";
        newline.style.cursor = "default";
        newline.style.marginTop = "8px";
        newline.style.display = "flex";
        newline.style.justifyContent = "space-between";
        newline.style.alignItems = "center";

        const newLabel = document.createElement("div");
        newLabel.className = "cart-summary-item-wrapStyle-label";
        newLabel.style.fontWeight = "700";
        newLabel.style.color = "rgb(25, 25, 25)";
        newLabel.style.fontSize = "15px";
        newLabel.style.textDecoration = "none";
        newLabel.innerText = "Estimated total + Tax";

        const newContent = document.createElement("div");
        newContent.className = "cart-summary-item-wrapStyle-content";
        newContent.style.fontWeight = "700";
        newContent.style.color = "rgb(25, 25, 25)";
        newContent.style.fontSize = "15px";
        newContent.style.textDecoration = "none";

        const newContentSpan = document.createElement("span");
        newContentSpan.style.padding = "0px 2px";
        newContentSpan.style.fontSize = "14px";
        newContentSpan.style.color = "rgb(25, 25, 25)";
        newContentSpan.innerText = "$" + newTotal;

        newline.appendChild(newLabel);
        newContent.appendChild(newContentSpan);
        newline.appendChild(newContent);
        parentElement.appendChild(newline);
    }
}

const observer = new MutationObserver(updateTaxDisplay);
observer.observe(totalLine, {
    subtree: true,
    childList: true,
    characterData: true
});

updateTaxDisplay();