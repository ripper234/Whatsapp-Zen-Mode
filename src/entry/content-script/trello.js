import {
    get_extn_storage_item_value,
    remove_extn_storage_item,
    set_extn_storage_item
} from "../../../utility-belt/helpers/extn/storage";

let trelloStatus = null;
let trelloIcon = null;

function updateIcon(status) {
    trelloIcon.src = chrome.runtime.getURL(
        `assets/logo/${status === 'ON' ? "logo.png" : "logo-off.png"}`,
    );
}

function updateBackground() {
    if (trelloStatus === 'ON' && document.querySelector('.card-detail-window')) {
        document.querySelector('.window-overlay').style.backgroundColor = '#f4f5f7';
    }
    else {
        document.querySelector('.window-overlay').style.backgroundColor = 'rgba(0,0,0,.64)';
    }
}

function handleIconClick() {
    trelloStatus = trelloStatus === 'ON' ? 'OFF' : 'ON';
    updateIcon(trelloStatus);
    set_extn_storage_item({ TRELLO_STATUS: trelloStatus });
    updateBackground();
}

function addIcon(status) {
    const siblingButton =
        document.querySelector('[data-test-id="header-create-menu-button"]') ||
        document.querySelector('[aria-label="Create board or Workspace"]') ||
        document.querySelector('[data-test-id="header-info-button"]') ||
        document.querySelector('[aria-label="Open information menu"]') ||
        document.querySelector('[data-test-id="header-notifications-button"]') ||
        document.querySelector('[aria-label="Notifications"]') ||
        document.querySelector('[data-test-id="header-member-menu-button"]') ||
        document.querySelector('[aria-label="Open member menu"]');
    const parent = siblingButton && siblingButton.parentElement;
    if (parent) {
        trelloIcon = new window.Image();
        trelloIcon.classList.add('zen-mode-trello-icon');
        trelloIcon.style.cursor = 'pointer';
        trelloIcon.style.marginRight = '3px';
        trelloIcon.src = chrome.runtime.getURL(`assets/logo/${status === 'ON' ? "logo.png" : "logo-off.png"}`);
        trelloIcon.addEventListener('click', handleIconClick);
        parent.prepend(trelloIcon);
    }
    else {
        console.log('no parent found');
    }
}


async function init() {
    trelloStatus = await get_extn_storage_item_value('TRELLO_STATUS') || 'ON';
    addIcon(trelloStatus);
}

window.setInterval(updateBackground, 500);
window.setTimeout(init, 2000);