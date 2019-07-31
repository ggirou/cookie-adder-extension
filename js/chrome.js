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

function chromePromisify(obj, fn) {
  return function() {
    const args = arguments;
    return new Promise((resolve, reject) => {
      try {
        obj[fn](...args, (value) => {
          if(chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(value);
          }
        });      
      } catch (e) {
        reject(e);
      }
    });
  }
}

const browser = {
  storage: {
    local:{
      get: chromePromisify(chrome.storage.local, 'get'),
      set: chromePromisify(chrome.storage.local, 'set')  
    }
  },
  webRequest: chrome.webRequest,
  runtime: {
    getBackgroundPage: chromePromisify(chrome.runtime, 'getBackgroundPage')
  }
};
