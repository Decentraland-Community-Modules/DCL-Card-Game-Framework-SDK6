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
const personal_request_payloads_1 = require("./personal-request-payloads");
class Personal {
    constructor(provider) {
        this.provider = provider;
        this.request = new personal_request_payloads_1.PersonalRequestPayloads();
    }
    async send({ method, params, format }) {
        return format(await this.provider.send(method, params));
    }
    async getAccounts() {
        const payload = this.request.getAccounts();
        return await this.send(payload);
    }
    async newAccount(password) {
        const payload = this.request.newAccount(password);
        return await this.send(payload);
    }
    async unlockAccount(address, password, duration) {
        const payload = this.request.unlockAccount(address, password, duration);
        return await this.send(payload);
    }
    async lockAccount(address) {
        const payload = this.request.lockAccount(address);
        return await this.send(payload);
    }
    async importRawKey(privateKey, password) {
        const payload = this.request.importRawKey(privateKey, password);
        return await this.send(payload);
    }
    async sendTransaction(tx, password) {
        const payload = this.request.sendTransaction(tx, password);
        return await this.send(payload);
    }
    async signTransaction(tx, password) {
        const payload = this.request.signTransaction(tx, password);
        return await this.send(payload);
    }
    async sign(message, address, password) {
        const payload = this.request.sign(message, address, password);
        return await this.send(payload);
    }
    async ecRecover(message, signedData) {
        const payload = this.request.ecRecover(message, signedData);
        return await this.send(payload);
    }
}
exports.Personal = Personal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyc29uYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGVyc29uYWwvcGVyc29uYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7RUFlRTs7QUFJRiwyRUFBbUY7QUFFbkYsTUFBYSxRQUFRO0lBR25CLFlBQW9CLFFBQTBCO1FBQTFCLGFBQVEsR0FBUixRQUFRLENBQWtCO1FBRjlCLFlBQU8sR0FBRyxJQUFJLG1EQUF1QixFQUFFLENBQUM7SUFFUCxDQUFDO0lBRTFDLEtBQUssQ0FBQyxJQUFJLENBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBNkQ7UUFDekcsT0FBTyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRU0sS0FBSyxDQUFDLFdBQVc7UUFDdEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMzQyxPQUFPLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRU0sS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFnQjtRQUN0QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsRCxPQUFPLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFnQixFQUFFLFFBQWdCLEVBQUUsUUFBZ0I7UUFDN0UsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN4RSxPQUFPLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRU0sS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFnQjtRQUN2QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsRCxPQUFPLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRU0sS0FBSyxDQUFDLFlBQVksQ0FBQyxVQUFrQixFQUFFLFFBQWdCO1FBQzVELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNoRSxPQUFPLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRU0sS0FBSyxDQUFDLGVBQWUsQ0FBQyxFQUFlLEVBQUUsUUFBZ0I7UUFDNUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzNELE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFTSxLQUFLLENBQUMsZUFBZSxDQUFDLEVBQWUsRUFBRSxRQUFnQjtRQUM1RCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDM0QsT0FBTyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBZSxFQUFFLE9BQWdCLEVBQUUsUUFBZ0I7UUFDbkUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM5RCxPQUFPLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRU0sS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFlLEVBQUUsVUFBa0I7UUFDeEQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzVELE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7Q0FDRjtBQXJERCw0QkFxREMifQ==