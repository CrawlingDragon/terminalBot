import dotenv from 'dotenv';
import { askQuestion } from './user.js';
import { botAnswer, initBot } from './bot.js';
import { loadingStart, loadingStop } from './loading.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import ora from 'ora';
dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

initBot();
// // console.log('process.env.OPEN_AI_KEY', process.env.OPEN_AI_KEY);

// (async () => {
(async function () {
  while (true) {
    // 用户输入，提问
    let userInput = askQuestion();
    loadingStart();
    // 退出功能，在用户输入exit时，退出
    checkExit(userInput);
    await botAnswer();
    loadingStop();
  }
})();
// })();

// 检查退出
function checkExit(input: string) {
  if (input === 'exit') {
    process.exit(); // 退出node程序
  }
}
