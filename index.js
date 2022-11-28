const TelegramApi = require('node-telegram-bot-api');

const token = '5933398539:AAF49T_cBLld0g9ENm5rBgEqmwf-5Wt6xn4';

const bot = new TelegramApi(token, {polling: true});
const chats = {}
const game1options = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text:'1', callback_data: 1}, {text:'2', callback_data: 2}, {text:'3', callback_data: 3}],
            [{text:'4', callback_data: 4}, {text:'5', callback_data: 5}, {text:'6', callback_data: 6}],
            [{text:'7', callback_data: 7}, {text:'8', callback_data: 8}, {text:'9', callback_data: 9}],
            [{text:'0', callback_data: 0}]
        ]
    })
}
const again1options = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text:'играть еще раз', callback_data: '/again'}],
        ]
    })
}
const startGame = async (chatId) => {
    await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/db6/f99/db6f99b9-68b9-379c-8787-7caa5bbfc110/11.webp');
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, а ты попробуй отгадать!');
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Ну, давай! Отгадывай!', game1options);
}

const start = () => {
    bot.setMyCommands([
        {command:'/start', description: 'начальное приветствие'},
        {command:'/info', description: 'доп. информация'},
        {command:'/game1', description: '1 игра угадай цифру'},
        
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/db6/f99/db6f99b9-68b9-379c-8787-7caa5bbfc110/2.webp');
            return bot.sendMessage(chatId, `привет ${msg.from.first_name} ${msg.from.last_name} Мы рады что ты присоеденился к нам! Вводи /info, чтобы узнать больше!`); 
        }
        if(text === '/info') {
            return bot.sendMessage(chatId, `Тут собрались крутые люди а теперь тут и ты - ${msg.from.first_name} ${msg.from.last_name}! бухаем!!!`); 
        }
        if(text === '/game1') {
            return startGame(chatId);   
        }
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/db6/f99/db6f99b9-68b9-379c-8787-7caa5bbfc110/5.webp');
        return bot.sendMessage(chatId, 'Инвиняй, не понял тебя =('); 
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты угадал цифру ${chats[chatId]}`, again1options);
        } else {
            return bot.sendMessage(chatId, `К сожалению ты выбрал цифру ${data}, я загадал цифру ${chats[chatId]}`, again1options)
        }
    })
}

start()