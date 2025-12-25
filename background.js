// Set Onion URL (static)
const ONION_BASE =
  "https://www.bbcnewsd73hkzno2ini43t4gblxvycyac5aw4gnv7t2rccijh7745uqd.onion";

// Validates that a URL belongs to the BBC domain and captures the path
// component for reuse with the BBC Tor onion base URL
const BBC_REGEX = /^https?:\/\/(www\.)?(bbc\.co\.uk|bbc\.com)(\/.*)$/i;


function convertToOnion(url) {
  const match = url.match(BBC_REGEX);
  if (!match) return null;
  return ONION_BASE + match[3];
}

// Opens a BBC article as its onion equivalent in a new tab
browser.contextMenus.create({
  id: "bbc-onion-open",
  title: "Open BBC article via Onion",
  contexts: ["link"]
});

// Copies the onion equivalent of a BBC article URL to the clipboard
browser.contextMenus.create({
  id: "bbc-onion-copy",
  title: "Copy BBC onion URL",
  contexts: ["link"]
});

// Opens the BBC onion homepage, works anywhere including page whitespace
browser.contextMenus.create({
  id: "bbc-onion-home",
  title: "Open BBC Onion Homepage",
  contexts: ["all"]
});

// Handles user interaction with the OnionBeeb context menu options
browser.contextMenus.onClicked.addListener(async (info) => {

  // Open the BBC onion homepage regardless of context
  if (info.menuItemId === "bbc-onion-home") {
    browser.tabs.create({ url: ONION_BASE });
    return;
  }

  // Copy onion URL for valid BBC links only
  if (info.menuItemId === "bbc-onion-copy") {
    if (!info.linkUrl) return;

    const onionUrl = convertToOnion(info.linkUrl);
    if (!onionUrl) return;

    try {
      await navigator.clipboard.writeText(onionUrl);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
    return;
  }

  // Open onion version of a BBC article, or fallback to homepage
  if (info.menuItemId === "bbc-onion-open") {
    if (!info.linkUrl) {
      browser.tabs.create({ url: ONION_BASE });
      return;
    }

    const onionUrl = convertToOnion(info.linkUrl);
    if (!onionUrl) return;

    browser.tabs.create({ url: onionUrl });
  }
});
