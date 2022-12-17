const TelegramApi = require('node-telegram-bot-api');
const {game1options, again1options} = require('./options')
const token = '5933398539:AAF49T_cBLld0g9ENm5rBgEqmwf-5Wt6xn4';

const bot = new TelegramApi(token, {polling: true});
const chats = {}

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
            console.log('/start', msg.from.first_name);
            return bot.sendMessage(chatId, `привет ${msg.from.first_name} ${msg.from.last_name} Мы рады что ты присоеденился к нам! Вводи /info, чтобы узнать больше!`); 
        }
        if(text === '/info') {
            console.log('/info', msg.from.first_name);
            return bot.sendMessage(chatId, `Тут собрались крутые люди, а теперь тут и ты - ${msg.from.first_name} ${msg.from.last_name}! бухаем!!!`); 
        }
        if(text === '/game1') {
            console.log('/game1', msg.from.first_name);
            return startGame(chatId);   
        }
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/db6/f99/db6f99b9-68b9-379c-8787-7caa5bbfc110/5.webp');
        return bot.sendMessage(chatId, 'Инвиняй, не понял тебя =('); 
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        const messId = msg.message.message_id;

        if(data === '/again') {
            console.log('/again', msg.from.first_name);
            return startGame(chatId);
        }

        if(data === '/clear') {
            console.log('/clear', msg.from.first_name);
            deleteMessage(chatId, messId);
            
            return bot.sendMessage(chatId, 'попытка удаления сообщений..не удалось! пытался, но подзаебался!');
        }

        if(chats[chatId] !== undefined) {
            const randomNumber = Math.floor(Math.random()*10);
            chats[chatId] = randomNumber;
        }

        if (data == chats[chatId]) {
            const win = bot.sendMessage(chatId, `Поздравляю, ты угадал цифру ${chats[chatId]}`, again1options);
            return win
        } else {
            const lose = bot.sendMessage(chatId, `К сожалению ты выбрал цифру ${data}, я загадал цифру ${chats[chatId]}`, again1options);
            return lose
        }
    })
}

start()