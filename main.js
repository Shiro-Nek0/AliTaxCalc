function calculateTax(text) {
    const cleanNumber = parseFloat(text.replace(/[^0-9.]/g, ""));
    if (isNaN(cleanNumber)) return "0.000";
    return (cleanNumber * 1.19).toFixed(3);
}

let isUpdating = false;

function updateAllTax() {
    setupSkuHoverListeners()
    if (isUpdating) return;
    isUpdating = true;

    try {
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
                    const val = "$" + newTotal;
                    if (contentSpan && contentSpan.innerText !== val) {
                        contentSpan.innerText = val;
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
    } finally {
        isUpdating = false;
    }
}

const observer = new MutationObserver((mutations) => {
    if (isUpdating) return;

    let needsUpdate = false;

    if (document.querySelector(".sku-item--property--HuasaIz")) {
        insertMiddleDiv();
    }

    if (document.querySelector(".ep_eq")) {
        insertCustomFilters();
    }

    const bundleCheckbox = document.getElementById("filterCode:Alihidebundles");
    if (bundleCheckbox && bundleCheckbox.checked) {
        toggleBundleVisibility(true);
    }

    for (const mutation of mutations) {
        const isCustomElement = (node) =>
            node.id === "AliTaxCalc" ||
            node.id === "AliSideTaxCalc" ||
            node.id === "AliMiddleDiv" ||
            node.id === "AliCustomOptsDiv" ||
            (node.closest && (node.closest("#AliTaxCalc") || node.closest("#AliSideTaxCalc") || node.closest("#AliMiddleDiv")));

        if (!isCustomElement(mutation.target)) {
            needsUpdate = true;
            break;
        }
    }

    if (needsUpdate) {
        updateAllTax();
    }
});

function toggleBundleVisibility(shouldHide) {
    const items = document.querySelectorAll(".hm_b3.search-item-card-wrapper-gallery");

    items.forEach(item => {
        const bundleSpan = item.querySelector("span.lw_an");
        if (bundleSpan && bundleSpan.innerText.includes("Bundle deals")) {
            item.style.display = shouldHide ? "none" : "";
        }
    });
}

function insertCustomFilters(params) {
    const parent = document.getElementsByClassName("ep_eq")[0];

    if (!parent || document.getElementById("AliCustomOptsDiv")) return;
    const container = document.createElement("div");
    container.id = "AliCustomOptsDiv";
    container.className = "il_im";

    const header = document.createElement("div");
    header.className = "il_in";

    const titleSpan = document.createElement("span");
    titleSpan.className = "il_an";
    titleSpan.textContent = "Custom filters";

    const iconSpan = document.createElement("span");
    iconSpan.className = "comet-icon comet-icon-arrowup";

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 1024 1024");
    svg.setAttribute("width", "1em");
    svg.setAttribute("height", "1em");
    svg.setAttribute("fill", "currentColor");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M97.6 715.968a35.925333 35.925333 0 0 1-4.128-49.813333l1.408-1.632 355.232-371.914667a85.333333 85.333333 0 0 1 123.381333-0.032l355.626667 371.946667a35.936 35.936 0 0 1-2.730667 51.445333 37.674667 37.674667 0 0 1-50.944-1.130667l-1.504-1.546666L527.253333 349.013333a21.333333 21.333333 0 0 0-30.922666 0L150.058667 713.301333a37.653333 37.653333 0 0 1-52.448 2.666667z");

    svg.appendChild(path);
    iconSpan.appendChild(svg);
    header.appendChild(titleSpan);
    header.appendChild(iconSpan);

    const filterContainer = document.createElement("div");
    filterContainer.className = "il_v";
    const innerWrapper = document.createElement("span");
    innerWrapper.className = "ie_if";

    function createCheckboxItem(id, labelText) {
        const span = document.createElement("span");
        span.className = "jz_j0 ie_ig";
        span.tabIndex = 1;

        const input = document.createElement("input");
        input.className = "jz_ar";
        input.type = "checkbox";
        input.id = "filterCode:" + id;

        input.addEventListener("change", (e) => {
            if (id === "Alihidebundles") {
                toggleBundleVisibility(e.target.checked);
            }
        });

        const label = document.createElement("label");
        label.setAttribute("for", "filterCode:" + id);
        label.className = "jz_it";

        const labelTextSpan = document.createElement("span");
        labelTextSpan.className = "ie_a6";
        labelTextSpan.innerText = labelText;

        label.appendChild(labelTextSpan);
        span.appendChild(input);
        span.appendChild(label);
        return span;
    }

    innerWrapper.appendChild(createCheckboxItem("Alihidebundles", "Hide Bundles"));
    filterContainer.appendChild(innerWrapper);

    container.appendChild(header);
    container.appendChild(filterContainer);

    const secondChild = parent.children[0];
    parent.insertBefore(container, secondChild);
    console.log("Element found!");
}

function insertMiddleDiv() {
    const parent = document.getElementsByClassName("sku-item--property--HuasaIz")[0];

    if (!parent || document.getElementById("AliMiddleDiv")) return;

    const newNode = document.createElement("div");
    newNode.id = "AliMiddleDiv";
    newNode.innerText = "Hovering on:";
    newNode.style.color = "#ff4747";
    newNode.style.fontWeight = "bold";

    const secondChild = parent.children[1];
    parent.insertBefore(newNode, secondChild);
    console.log("Element found!");
}

function handleSkuHover(event) {
    const target = event.target.closest(".sku-item--skus--StEhULs > *");
    if (!target) return;

    const label = document.getElementById("AliMiddleDiv")
    label.innerText = "Hovering on: " + target.children[0].alt;
    console.log("Hovered element content:", target.children[0].alt);
}

function setupSkuHoverListeners() {
    const container = document.querySelector(".sku-item--skus--StEhULs");
    if (!container || container.dataset.hoverBound) return;

    container.addEventListener("mouseover", handleSkuHover);

    container.dataset.hoverBound = "true";
}

const targetNode = document.body;
observer.observe(targetNode, {
    childList: true,
    subtree: true,
    characterData: true
});

updateAllTax();
