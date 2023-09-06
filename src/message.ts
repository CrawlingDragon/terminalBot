// 让聊天机器人支持上下文，核心就是，把message内存有之前的所有内容
export let messages: { role: 'user' | 'assistant'; content: string }[] = [];

// todo ,控制message的长度，5条，超过就提示“问题数已达上限”
let maxQuestionNum = 3;
export function addUserMessage(userInput: string) {
  //把用户输入的push到messages内
  messages.push({
    role: 'user',
    content: userInput,
  });
}

export function addBotMessage(answer: string) {
  if (messages.length >= maxQuestionNum * 2 + 1) {
    console.log('问题数已达上限');
    return;
  }

  messages.push({
    role: 'assistant',
    content: answer!, //xx!,在变量后面加！号，表示值可空，且会通过编译
  });
  if (messages.length >= maxQuestionNum * 2) {
    console.log('剩余问题数为0');
  }
}
