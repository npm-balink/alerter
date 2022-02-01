"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertLevel = exports.Greeter = void 0;
var alert_1 = require("./alert");
Object.defineProperty(exports, "AlertLevel", { enumerable: true, get: function () { return alert_1.AlertLevel; } });
var TrelloNodeAPI = require("trello-node-api");
var nodemailer = require("nodemailer");
var JiraClient = require("jira-client");
var Greeter = function (name) { return "Hello ".concat(name); };
exports.Greeter = Greeter;
var Alerter = /** @class */ (function () {
    function Alerter(config) {
        this.config = config;
    }
    Alerter.prototype.alert = function (alert, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.allSettled([
                            options.sendEmail ? this.sendAlertEmail(alert, this.config.emailConfig) : null,
                            options.createJiraTicket ? this.createJiraIssue(alert, this.config.jiraConfig) : null,
                            options.createTrelloTicket ? this.createTrelloTicket(alert, this.config.trelloConfig) : null,
                        ])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 1.Produces a call to TRELLO.
     * 2.Creates a ticket according to the related alert.
     * @param alert - The alert object (contain the relevant info of the alert).
     * @param trelloConfig - The required configuration to trello.
     * @returns The response of the creation of the ticket.
     *          in case the trelloConfig is undefuned -> null .
     */
    Alerter.prototype.createTrelloTicket = function (alert, trelloConfig) {
        if (trelloConfig === undefined || alert.tags === undefined) {
            return null;
        }
        var trello = new TrelloNodeAPI();
        trello.setApiKey(trelloConfig.apiKey);
        trello.setOauthToken(trelloConfig.access_token);
        var data = {
            name: createSubject(alert),
            desc: createMessage(alert),
            pos: 'top',
            idList: trelloConfig === null || trelloConfig === void 0 ? void 0 : trelloConfig.idList,
            idLabels: alert.tags.map(function (label) { return trelloConfig.tagsMapping[label] || null; }).filter(Boolean),
            due: null,
            dueComplete: false,
            urlSource: 'https://api.trello.com/1/',
            fileSource: 'file',
            keepFromSource: 'attachments,checklists,comments,due,labels,members,stickers',
        };
        return trello.card
            .create(data)
            .then(function (response) {
            return response;
        })
            .catch(function (error) {
            throw new Error('Trello ticket not created: ' + JSON.stringify(error));
        });
    };
    /**
     * 1.Produces a call to JIRA.
     * 2.Creates a ticket according to the related alert.
     * @param alert - The alert object (contain the relevant info of the alert).
     * @param jiraConfig -The required configuration to jira.
     */
    Alerter.prototype.createJiraIssue = function (alert, jiraConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var jira;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (jiraConfig === undefined) {
                            return [2 /*return*/];
                        }
                        jira = new JiraClient({
                            protocol: 'https',
                            host: jiraConfig.host,
                            username: jiraConfig.username,
                            password: jiraConfig.password,
                            apiVersion: '3',
                            strictSSL: true,
                        });
                        return [4 /*yield*/, jira
                                .addNewIssue({
                                fields: {
                                    project: {
                                        key: jiraConfig.projectKey,
                                    },
                                    summary: createSubject(alert),
                                    description: {
                                        version: 1,
                                        type: 'doc',
                                        content: [
                                            {
                                                type: 'paragraph',
                                                content: [
                                                    {
                                                        type: 'text',
                                                        text: createMessage(alert),
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    labels: [alert.env, alert.region],
                                    issuetype: {
                                        name: 'Task',
                                    },
                                },
                            })
                                .then(function (response) {
                                return response;
                            })
                                .catch(function (error) {
                                throw new Error('Jira ticket not created: ' + JSON.stringify(error));
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 1.Produces a connection to the MAIL SERVICE.
     * 2.Sends an Email according to the related alert.
     * @param alert - The alert object (contain the relevant info of the alert).
     * @param mailConfig - The required configuration to the current mail service.
     */
    Alerter.prototype.sendAlertEmail = function (alert, mailConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var transporter, emailList, mailOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transporter = nodemailer.createTransport({
                            service: mailConfig === null || mailConfig === void 0 ? void 0 : mailConfig.credentials.service,
                            auth: {
                                user: mailConfig === null || mailConfig === void 0 ? void 0 : mailConfig.credentials.username,
                                pass: mailConfig === null || mailConfig === void 0 ? void 0 : mailConfig.credentials.password,
                            },
                        });
                        emailList = this.createEmailList(alert.level, (mailConfig === null || mailConfig === void 0 ? void 0 : mailConfig.subscribers) || []);
                        mailOptions = {
                            from: mailConfig === null || mailConfig === void 0 ? void 0 : mailConfig.credentials.username,
                            to: emailList,
                            subject: createSubject(alert),
                            text: createMessage(alert),
                        };
                        return [4 /*yield*/, transporter
                                .sendMail(mailOptions)
                                .then(function (response) {
                                return response;
                            })
                                .catch(function (error) {
                                throw new Error('Email not sent' + JSON.stringify(error));
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * This utility function gives an array of the relevant mailing lists.
     * Whoever has an alert rank >= than the 'level' of the alert- will be
     * included in the array, so will receive an email.
     * @param level - The alert level.
     * @param emailCongig - The list of people, we will return from it only the
     *                      people who need to receive the email.
     * @returns
     */
    Alerter.prototype.createEmailList = function (level, subscribers) {
        return subscribers
            .filter(function (sub) { return sub.hasSubscribedTo <= level; })
            .map(function (sub) { return sub.email; });
    };
    return Alerter;
}());
function createSubject(alert) {
    return "[".concat(alert_1.AlertLevel[alert.level], " alert][").concat(alert.date.toISOString(), "] in ").concat(alert.projectName, " (Region: ").concat(alert.region, ") (Environment: ").concat(alert.env, ") - ").concat(alert.subject);
}
function createMessage(alert) {
    return ('\n alert level: ' +
        alert_1.AlertLevel[alert.level] +
        '\n description: ' +
        alert.description +
        '\n in env: ' +
        alert.env +
        '\n and in region:' +
        alert.region);
}
exports.default = Alerter;
