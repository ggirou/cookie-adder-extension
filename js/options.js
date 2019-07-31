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

(function () {
    "use strict";

    var backgroundPage;
    var cookieInput = document.querySelector('#cookieInput');
    var urlsTextarea = document.querySelector('#urls');
    var saveStatusElement = document.getElementById('saveStatus');

    function showSavedNotification() {
        // Update status to let user know options were saved.
        saveStatusElement.style.visibility = "";
        setTimeout(function () {
            saveStatusElement.style.visibility = "hidden";
        }, 2000);
    };

    function show(options) {
        cookieInput.value = options.cookie;
        urlsTextarea.value = options.urls.join("\n");
    }

    // Saves urls to chrome.storage.local.
    async function save() {
        var value = urlsTextarea.value.trim();
        var newUrls = value ? value.replace(/[\r\n]+/g, "\n").split("\n") : [];

        var options = {
            urls: newUrls,
            cookie: cookieInput.value
        };

        await backgroundPage.setOptions(options);
        backgroundPage.registerListeners();
        show(options);
        showSavedNotification();
        console.log("Options saved", options);
    }

    // Restores the preferences stored in chrome.storage.
    async function load() {
        backgroundPage = await browser.runtime.getBackgroundPage();
        const options = await backgroundPage.getOptions();
        show(options);
        console.log("Options loaded", options);
    }

    document.addEventListener('DOMContentLoaded', load);
    document.querySelector('#saveButton').addEventListener('click', save);
})();
