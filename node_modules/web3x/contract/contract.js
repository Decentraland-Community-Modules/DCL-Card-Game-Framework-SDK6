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
const formatters_1 = require("../formatters");
const subscriptions_1 = require("../subscriptions");
const utils_1 = require("../utils");
const tx_1 = require("./tx");
const tx_deploy_1 = require("./tx-deploy");
/**
 * Should be called to create new contract instance
 *
 * @method Contract
 * @constructor
 * @param {Array} jsonInterface
 * @param {String} address
 * @param {Object} options
 */
class Contract {
    constructor(eth, contractAbi, address, defaultOptions = {}) {
        this.eth = eth;
        this.contractAbi = contractAbi;
        this.address = address;
        this.defaultOptions = defaultOptions;
        this.linkTable = {};
        this.methods = this.buildMethods();
        this.events = this.buildEvents();
    }
    link(name, address) {
        this.linkTable[name] = address;
    }
    deployBytecode(data, ...args) {
        const linkedData = Object.entries(this.linkTable).reduce((data, [name, address]) => data.replace(new RegExp(`_+${name}_+`, 'gi'), address
            .toString()
            .slice(2)
            .toLowerCase()), data);
        if (linkedData.includes('_')) {
            throw new Error('Bytecode has not been fully linked.');
        }
        return new tx_deploy_1.TxDeploy(this.eth, this.contractAbi.ctor, this.contractAbi, utils_1.hexToBuffer(linkedData), args, this.defaultOptions, addr => (this.address = addr));
    }
    once(event, options, callback) {
        this.on(event, options, (err, res, sub) => {
            sub.unsubscribe();
            callback(err, res, sub);
        });
    }
    async getPastEvents(event, options = {}) {
        const logOptions = this.getLogOptions(event, options);
        const result = await this.eth.getPastLogs(logOptions);
        return result.map(log => this.contractAbi.decodeEvent(log));
    }
    on(event, options = {}, callback) {
        const logOptions = this.getLogOptions(event, options);
        const { fromBlock, ...subLogOptions } = logOptions;
        const params = [formatters_1.toRawLogRequest(subLogOptions)];
        const subscription = new subscriptions_1.Subscription('eth', 'logs', params, this.eth.provider, (result, sub) => {
            const output = formatters_1.fromRawLogResponse(result);
            const eventLog = this.contractAbi.decodeEvent(output);
            sub.emit(output.removed ? 'changed' : 'data', eventLog);
            if (callback) {
                callback(undefined, eventLog, sub);
            }
        }, false);
        subscription.on('error', err => {
            if (callback) {
                callback(err, undefined, subscription);
            }
        });
        if (fromBlock !== undefined) {
            this.eth
                .getPastLogs(logOptions)
                .then(logs => {
                logs.forEach(result => {
                    const output = this.contractAbi.decodeEvent(result);
                    subscription.emit('data', output);
                });
                subscription.subscribe();
            })
                .catch(err => {
                subscription.emit('error', err);
            });
        }
        else {
            subscription.subscribe();
        }
        return subscription;
    }
    executorFactory(functions) {
        return (...args) => {
            if (!this.address) {
                throw new Error('No contract address.');
            }
            const firstMatchingOverload = functions.find(f => args.length === f.numArgs());
            if (!firstMatchingOverload) {
                throw new Error(`No matching method with ${args.length} arguments for ${functions[0].name}.`);
            }
            return new tx_1.Tx(this.eth, firstMatchingOverload, this.contractAbi, this.address, args, this.defaultOptions);
        };
    }
    buildMethods() {
        const methods = {};
        this.contractAbi.functions.forEach(f => {
            const executor = this.executorFactory([f]);
            methods[f.asString()] = executor;
            methods[f.signature] = executor;
        });
        const grouped = this.contractAbi.functions.reduce((acc, method) => {
            const funcs = [...(acc[method.name] || []), method];
            return { ...acc, [method.name]: funcs };
        }, {});
        Object.entries(grouped).map(([name, funcs]) => {
            methods[name] = this.executorFactory(funcs);
        });
        return methods;
    }
    buildEvents() {
        const events = {};
        this.contractAbi.events.forEach(e => {
            const event = this.on.bind(this, e.signature);
            if (!events[e.name]) {
                events[e.name] = event;
            }
            events[e.asString()] = event;
            events[e.signature] = event;
        });
        events.allEvents = this.on.bind(this, 'allevents');
        return events;
    }
    getLogOptions(eventName = 'allevents', options) {
        if (!this.address) {
            throw new Error('No contract address.');
        }
        if (eventName.toLowerCase() === 'allevents') {
            return {
                ...options,
                address: this.address,
            };
        }
        const event = this.contractAbi.events.find(e => e.name === eventName || e.signature === '0x' + eventName.replace('0x', ''));
        if (!event) {
            throw new Error(`Event ${eventName} not found.`);
        }
        return {
            ...options,
            address: this.address,
            topics: event.getEventTopics(options.filter),
        };
    }
}
exports.Contract = Contract;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29udHJhY3QvY29udHJhY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7RUFlRTs7QUFJRiw4Q0FBdUg7QUFDdkgsb0RBQWdEO0FBRWhELG9DQUF1QztBQUV2Qyw2QkFBcUM7QUFDckMsMkNBQXVDO0FBaUN2Qzs7Ozs7Ozs7R0FRRztBQUNILE1BQWEsUUFBUTtJQUtuQixZQUNVLEdBQVEsRUFDUixXQUF3QixFQUN6QixPQUFpQixFQUNoQixpQkFBa0MsRUFBRTtRQUhwQyxRQUFHLEdBQUgsR0FBRyxDQUFLO1FBQ1IsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDekIsWUFBTyxHQUFQLE9BQU8sQ0FBVTtRQUNoQixtQkFBYyxHQUFkLGNBQWMsQ0FBc0I7UUFOdEMsY0FBUyxHQUFnQyxFQUFFLENBQUM7UUFRbEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVNLElBQUksQ0FBQyxJQUFZLEVBQUUsT0FBZ0I7UUFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUM7SUFDakMsQ0FBQztJQUVNLGNBQWMsQ0FBQyxJQUFVLEVBQUUsR0FBRyxJQUFXO1FBQzlDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FDdEQsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUN4QixJQUFJLENBQUMsT0FBTyxDQUNWLElBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQy9CLE9BQU87YUFDSixRQUFRLEVBQUU7YUFD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