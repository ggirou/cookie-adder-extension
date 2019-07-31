/**
 * Cookie Adder
 * Copyright (C) 2019 Guillaume Girou
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const defaultOptions = {
  urls: [],
  cookie: "",
};
var options;

function rewriteCookie(e) {
  var done = false;
  e.requestHeaders.forEach(function (header) {
    if (header.name.toLowerCase() == "cookie") {
      header.value = header.value + "; " + options.cookie;
      done = true;
    }
  });
  if (!done) {
    e.requestHeaders.push({ name: "Cookie", value: options.cookie });
  }
  return { requestHeaders: e.requestHeaders };
}

async function registerListeners() {
  options = (await browser.storage.local.get({ options: defaultOptions })).options;

  browser.webRequest.onBeforeSendHeaders.removeListener(rewriteCookie);
  browser.webRequest.onBeforeSendHeaders.addListener(
    rewriteCookie,
    { urls: options.urls },
    ["blocking", "requestHeaders"]
  );
  console.log("Listeners registered", options);
}

registerListeners();
