function calculateTax(text) {
    const cleanNumber = parseFloat(text.replace(/[^0-9.]/g, ""));
    if (isNaN(cleanNumber)) return "0.000";
    return (cleanNumber * 1.19).toFixed(3);
}

let isUpdating = false;

function updateAllTax() {
    if (isUpdating) return;
    isUpdating = true;

    const labels = document.querySelectorAll(".cart-summary-item-wrapStyle-label");
    let targetRow = null;

    for (const label of labels) {
        if (label.innerText.includes("Estimated total")) {
            targetRow = label.parentElement;
            break;
        }
    }

    if (targetRow) {
        const numberSpan = targetRow.querySelector(".cart-summary-item-wrapStyle-content span");
        if (numberSpan) {
            const newTotal = calculateTax(numberSpan.innerText);
            let taxRow = document.getElementById("AliTaxCalc");

            if (taxRow) {
                const contentSpan = taxRow.querySelector(".cart-summary-item-wrapStyle-content span");
                if (contentSpan && contentSpan.innerText !== "$" + newTotal) {
                    contentSpan.innerText = "$" + newTotal;
                }
            } else {
                const newline = document.createElement("div");
                newline.id = "AliTaxCalc";
                newline.className = "cart-summary-item-wrapStyle";
                newline.style.fontWeight = "900";
                newline.style.marginTop = "8px";
                newline.style.display = "flex";
                newline.style.justifyContent = "space-between";
                newline.style.alignItems = "center";

                const newLabel = document.createElement("div");
                newLabel.className = "cart-summary-item-wrapStyle-label";
                newLabel.style.fontWeight = "700";
                newLabel.style.color = "rgb(25, 25, 25)";
                newLabel.style.fontSize = "18px";
                newLabel.innerText = "Total + Tax (19%)";

                const newContent = document.createElement("div");
                newContent.className = "cart-summary-item-wrapStyle-content";
                newContent.style.fontWeight = "700";

                const newContentSpan = document.createElement("span");
                newContentSpan.style.padding = "0px 2px";
                newContentSpan.style.fontSize = "20px";
                newContentSpan.style.color = "rgb(25, 25, 25)";
                newContentSpan.innerText = "$" + newTotal;

                newline.appendChild(newLabel);
                newContent.appendChild(newContentSpan);
                newline.appendChild(newContent);
                targetRow.parentNode.appendChild(newline);
            }
        }
    }

    const sideSummary = document.querySelector(".cart-summary-top");
    if (sideSummary) {
        const sideTotal = calculateTax(sideSummary.innerText);
        let sideTaxRow = document.getElementById("AliSideTaxCalc");
        const displayText = "+Tax: $" + sideTotal;

        if (sideTaxRow) {
            const sideTaxSpan = sideTaxRow.querySelector("span");
            if (sideTaxSpan && sideTaxSpan.innerText !== displayText) {
                sideTaxSpan.innerText = displayText;
            }
        } else {
            const sideLine = document.createElement("div");
            sideLine.id = "AliSideTaxCalc";
            sideLine.style.display = "flex";
            sideLine.style.justifyContent = "center";
            sideLine.style.width = "100%";
            sideLine.style.marginTop = "4px";

            const sideTaxSpan = document.createElement("span");
            sideTaxSpan.style.fontSize = "14px";
            sideTaxSpan.style.fontWeight = "700";
            sideTaxSpan.style.color = "#191919";
            sideTaxSpan.innerText = displayText;

            sideLine.appendChild(sideTaxSpan);
            sideSummary.parentNode.insertBefore(sideLine, sideSummary.nextSibling);
        }
    }

    isUpdating = false;
}

const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false;
    for (const mutation of mutations) {
        if (mutation.target.id !== "AliTaxCalc" && mutation.target.id !== "AliSideTaxCalc" && !mutation.target.closest?.("#AliTaxCalc") && !mutation.target.closest?.("#AliSideTaxCalc")) {
            shouldUpdate = true;
            break;
        }
    }
    if (shouldUpdate) updateAllTax();
});

const targetNode = document.querySelector(".cart-side") || document.body;
observer.observe(targetNode, {
    childList: true,
    subtree: true,
    characterData: true
});

updateAllTax();