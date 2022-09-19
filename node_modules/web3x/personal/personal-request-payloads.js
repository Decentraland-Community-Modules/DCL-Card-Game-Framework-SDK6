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
const address_1 = require("../address");
const formatters_1 = require("../formatters");
const utils_1 = require("../utils");
const identity = () => (result) => result;
class PersonalRequestPayloads {
    getAccounts() {
        return {
            method: 'personal_listAccounts',
            format: (result) => result.map(address_1.Address.fromString),
        };
    }
    newAccount(password) {
        return {
            method: 'personal_newAccount',
            params: [password],
            format: address_1.Address.fromString,
        };
    }
    unlockAccount(address, password, duration) {
        return {
            method: 'personal_unlockAccount',
            params: [address.toString().toLowerCase(), password, duration],
            format: identity(),
        };
    }
    lockAccount(address) {
        return {
            method: 'personal_lockAccount',
            params: [address.toString().toLowerCase()],
            format: identity(),
        };
    }
    importRawKey(privateKey, password) {
        return {
            method: 'personal_importRawKey',
            params: [utils_1.bufferToHex(privateKey), password],
            format: address_1.Address.fromString,
        };
    }
    sendTransaction(tx, password) {
        return {
            method: 'personal_sendTransaction',
            params: [{ ...formatters_1.toRawTransactionRequest(tx), condition: tx.condition }, password],
            format: identity(),
        };
    }
    signTransaction(tx, password) {
        return {
            method: 'personal_signTransaction',
            params: [{ ...formatters_1.toRawTransactionRequest(tx), condition: tx.condition }, password],
            format: identity(),
        };
    }
    sign(message, address, password) {
        return {
            method: 'personal_sign',
            params: [formatters_1.inputSignFormatter(message), address.toString().toLowerCase(), password],
            format: identity(),
        };
    }
    ecRecover(message, signedData) {
        return {
            method: 'personal_ecRecover',
            params: [formatters_1.inputSignFormatter(message), signedData],
            format: address_1.Address.fromString,
        };
    }
}
exports.PersonalRequestPayloads = PersonalRequestPayloads;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyc29uYWwtcmVxdWVzdC1wYXlsb2Fkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wZXJzb25hbC9wZXJzb25hbC1yZXF1ZXN0LXBheWxvYWRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0VBZUU7O0FBRUYsd0NBQXFDO0FBQ3JDLDhDQUFnRztBQUNoRyxvQ0FBdUM7QUFXdkMsTUFBTSxRQUFRLEdBQUcsR0FBTSxFQUFFLENBQUMsQ0FBQyxNQUFTLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQztBQUVoRCxNQUFhLHVCQUF1QjtJQUMzQixXQUFXO1FBQ2hCLE9BQU87WUFDTCxNQUFNLEVBQUUsdUJBQXVCO1lBQy9CLE1BQU0sRUFBRSxDQUFDLE1BQWdCLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxVQUFVLENBQUM7U0FDN0QsQ0FBQztJQUNKLENBQUM7SUFFTSxVQUFVLENBQUMsUUFBZ0I7UUFDaEMsT0FBTztZQUNMLE1BQU0sRUFBRSxxQkFBcUI7WUFDN0IsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDO1lBQ2xCLE1BQU0sRUFBRSxpQkFBTyxDQUFDLFVBQVU7U0FDM0IsQ0FBQztJQUNKLENBQUM7SUFFTSxhQUFhLENBQUMsT0FBZ0IsRUFBRSxRQUFnQixFQUFFLFFBQWdCO1FBQ3ZFLE9BQU87WUFDTCxNQUFNLEVBQUUsd0JBQXdCO1lBQ2hDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDO1lBQzlELE1BQU0sRUFBRSxRQUFRLEVBQVc7U0FDNUIsQ0FBQztJQUNKLENBQUM7SUFFTSxXQUFXLENBQUMsT0FBZ0I7UUFDakMsT0FBTztZQUNMLE1BQU0sRUFBRSxzQkFBc0I7WUFDOUIsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzFDLE1BQU0sRUFBRSxRQUFRLEVBQVE7U0FDekIsQ0FBQztJQUNKLENBQUM7SUFFTSxZQUFZLENBQUMsVUFBa0IsRUFBRSxRQUFnQjtRQUN0RCxPQUFPO1lBQ0wsTUFBTSxFQUFFLHVCQUF1QjtZQUMvQixNQUFNLEVBQUUsQ0FBQyxtQkFBVyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFFBQVEsQ0FBQztZQUMzQyxNQUFNLEVBQUUsaUJBQU8sQ0FBQyxVQUFVO1NBQzNCLENBQUM7SUFDSixDQUFDO0lBRU0sZUFBZSxDQUFDLEVBQWUsRUFBRSxRQUFnQjtRQUN0RCxPQUFPO1lBQ0wsTUFBTSxFQUFFLDBCQUEwQjtZQUNsQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsb0NBQXVCLENBQUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxTQUFTLEVBQUUsRUFBRSxRQUFRLENBQUM7WUFDL0UsTUFBTSxFQUFFLFFBQVEsRUFBVTtTQUMzQixDQUFDO0lBQ0osQ0FBQztJQUVNLGVBQWUsQ0FBQyxFQUFlLEVBQUUsUUFBZ0I7UUFDdEQsT0FBTztZQUNMLE1BQU0sRUFBRSwwQkFBMEI7WUFDbEMsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLG9DQUF1QixDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsU0FBUyxFQUFFLEVBQUUsUUFBUSxDQUFDO1lBQy9FLE1BQU0sRUFBRSxRQUFRLEVBQXFCO1NBQ3RDLENBQUM7SUFDSixDQUFDO0lBRU0sSUFBSSxDQUFDLE9BQWUsRUFBRSxPQUFnQixFQUFFLFFBQWdCO1FBQzdELE9BQU87WUFDTCxNQUFNLEVBQUUsZUFBZTtZQUN2QixNQUFNLEVBQUUsQ0FBQywrQkFBa0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxFQUFFLEVBQUUsUUFBUSxDQUFDO1lBQ2pGLE1BQU0sRUFBRSxRQUFRLEVBQVU7U0FDM0IsQ0FBQztJQUNKLENBQUM7SUFFTSxTQUFTLENBQUMsT0FBZSxFQUFFLFVBQWtCO1FBQ2xELE9BQU87WUFDTCxNQUFNLEVBQUUsb0JBQW9CO1lBQzVCLE1BQU0sRUFBRSxDQUFDLCtCQUFrQixDQUFDLE9BQU8sQ0FBQyxFQUFFLFVBQVUsQ0FBQztZQUNqRCxNQUFNLEVBQUUsaUJBQU8sQ0FBQyxVQUFVO1NBQzNCLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUF2RUQsMERBdUVDIn0=