const ONION_BASE =
  "https://www.bbcnewsd73hkzno2ini43t4gblxvycyac5aw4gnv7t2rccijh7745uqd.onion";

const BBC_REGEX = /^https?:\/\/(www\.)?(bbc\.co\.uk|bbc\.com)(\/.*)$/i;

function convertToOnion(url) {
  const match = url.match(BBC_REGEX);
  if (!match) return null;
  return ONION_BASE + match[3];
}

browser.contextMenus.create({
  id: "bbc-onion-open",
  title: "Open BBC via Tor (.onion) in new tab",
  contexts: ["link"]
});

browser.contextMenus.create({
  id: "bbc-onion-copy",
  title: "Copy BBC onion URL",
  contexts: ["link"]
});

browser.contextMenus.onClicked.addListener(async (info) => {
  if (!info.linkUrl) return;

  const onionUrl = convertToOnion(info.linkUrl);
  if (!onionUrl) return;

if (info.menuItemId === "bbc-onion-open") 
{
  browser.tabs.create({ url: onionUrl });
}

  if (info.menuItemId === "bbc-onion-copy") {
    try {
      await navigator.clipboard.writeText(onionUrl);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  }
});
