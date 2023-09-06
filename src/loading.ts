import ora from 'ora';
import type { Ora } from 'ora';

let spinner: Ora;
export function loadingStart() {
  spinner = ora('正在回答，请稍后\r').start();
}

export function loadingStop() {
  spinner.stop();
}
