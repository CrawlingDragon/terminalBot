#!/usr/bin/env node

import dotenv from 'dotenv';
import readlineSync from 'readline-sync';
import colors from 'colors';
import { OpenAIApi, Configuration } from 'openai';
import ora from 'ora';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

// 让聊天机器人支持上下文，核心就是，把message内存有之前的所有内容
let messages = [];
function addUserMessage(userInput) {
    // if (messages.length >= maxQuestionNum * 2 + 1) {
    //   console.log('问题数已达上限');
    //   return;
    // }
    // if (messages.length >= maxQuestionNum * 2) {
    //   console.log('剩余问题数为0');
    //   return;
    // }
    //把用户输入的push到messages内
    messages.push({
        role: 'user',
        content: userInput,
    });
}
function addBotMessage(answer) {
    messages.push({
        role: 'assistant',
        content: answer, //xx!,在变量后面加！号，表示值可空，且会通过编译
    });
}

function askQuestion() {
    const userInput = readlineSync.question(colors.rainbow('YOU:'));
    addUserMessage(userInput);
    return userInput;
}

let openAi;
function initBot() {
    openAi = new OpenAIApi(new Configuration({
        basePath: 'https://api.chatanywhere.cn/v1',
        apiKey: process.env.OPEN_AI_KEY,
    }));
}
function botAnswer() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const chatCompletion = yield openAi.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages,
        });
        const answer = (_a = chatCompletion.data.choices[0].message) === null || _a === void 0 ? void 0 : _a.content;
        addBotMessage(answer);
        console.log(colors.bold.red('Bot: '), answer);
    });
}

let spinner;
function loadingStart() {
    spinner = ora('正在回答，请稍后\r').start();
}
function loadingStop() {
    spinner.stop();
}

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });
initBot();
// // console.log('process.env.OPEN_AI_KEY', process.env.OPEN_AI_KEY);
// (async () => {
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            // 用户输入，提问
            let userInput = askQuestion();
            loadingStart();
            // 退出功能，在用户输入exit时，退出
            checkExit(userInput);
            yield botAnswer();
            loadingStop();
        }
    });
})();
// })();
// 检查退出
function checkExit(input) {
    if (input === 'exit') {
        process.exit(); // 退出node程序
    }
}
