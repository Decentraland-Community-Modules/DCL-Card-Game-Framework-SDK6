"use strict";
/*
  This file is part of web3x.

  web3x is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  web3x is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with web3x.  If not, see <http://www.gnu.org/licenses/>.
*/
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_1 = tslib_1.__importDefault(require("http"));
const https_1 = tslib_1.__importDefault(require("https"));
const isomorphic_fetch_1 = tslib_1.__importDefault(require("isomorphic-fetch"));
const legacy_provider_adapter_1 = require("./legacy-provider-adapter");
class HttpProvider extends legacy_provider_adapter_1.LegacyProviderAdapter {
    constructor(host, options = {}) {
        super(new LegacyHttpProvider(host, options));
    }
}
exports.HttpProvider = HttpProvider;
class LegacyHttpProvider {
    constructor(host, options = {}) {
        this.host = host;
        this.options = options;
        this.host = host || 'http://localhost:8545';
        if (options.keepAlive) {
            this.options.agent = /^https/.test(this.host)
                ? new https_1.default.Agent({ keepAlive: true })
                : new http_1.default.Agent({ keepAlive: true });
        }
    }
    send(payload, callback) {
        isomorphic_fetch_1.default(this.host, {
            ...this.options,
            method: 'POST',
            credentials: 'include',
            headers: {
                ...this.options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(json => callback(undefined, json))
            .catch(callback);
    }
    disconnect() { }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm92aWRlcnMvaHR0cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7OztFQWVFOzs7QUFFRix3REFBd0I7QUFDeEIsMERBQTBCO0FBQzFCLGdGQUFxQztBQUVyQyx1RUFBa0U7QUFFbEUsTUFBYSxZQUFhLFNBQVEsK0NBQXFCO0lBQ3JELFlBQVksSUFBWSxFQUFFLFVBQWUsRUFBRTtRQUN6QyxLQUFLLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDO0NBQ0Y7QUFKRCxvQ0FJQztBQUVELE1BQU0sa0JBQWtCO0lBQ3RCLFlBQW9CLElBQVksRUFBVSxVQUFlLEVBQUU7UUFBdkMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQVU7UUFDekQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksdUJBQXVCLENBQUM7UUFFNUMsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDM0MsQ0FBQyxDQUFDLElBQUksZUFBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztnQkFDdEMsQ0FBQyxDQUFDLElBQUksY0FBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQztJQUVNLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUTtRQUMzQiwwQkFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDZixHQUFHLElBQUksQ0FBQyxPQUFPO1lBQ2YsTUFBTSxFQUFFLE1BQU07WUFDZCxXQUFXLEVBQUUsU0FBUztZQUN0QixPQUFPLEVBQUU7Z0JBQ1AsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU87Z0JBQ3ZCLGNBQWMsRUFBRSxrQkFBa0I7YUFDbkM7WUFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7U0FDOUIsQ0FBQzthQUNDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ3ZDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRU0sVUFBVSxLQUFJLENBQUM7Q0FDdkIifQ==