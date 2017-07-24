const SENDING = 0;
const ACCEPTED = 1;
const DELIVERED = 2;

const T_OK = 0;
const T_WAIT = 1;

export const _contacts = [
  // humaniq contact
  {
    id: 0,
    approved: true,
    phone: '+000 00 0000000',
    name: 'Humaniq',
    avatar: 'http://i.imgur.com/LaMu4xZ.png',
  },
  {
    // self contact
    id: 1,
    approved: false,
    phone: '+111 11 1111111',
    name: 'Neo',
    avatar: 'http://lorempixel.com/200/200/cats/2/',
  },
  {
    // phone only contact
    id: 2,
    approved: false,
    phone: '+222 22 2222222',
    name: '',
    avatar: 'http://lorempixel.com/200/200/cats/3/',
  },
  {
    // Агент Малдер
    id: 3,
    approved: false,
    phone: '+333 33 3333333',
    name: 'Fox Mulder',
    avatar: 'http://lorempixel.com/200/200/cats/4/',
  },
  {
    // Агент Скалли
    id: 4,
    approved: false,
    phone: '+444 444 4444444',
    name: 'Dana Scully',
    avatar: 'http://lorempixel.com/200/200/cats/5/',
  },
  {
    // Агент Смит
    id: 5,
    approved: false,
    phone: '+555 555 5555555',
    name: 'John Smith',
    avatar: 'http://lorempixel.com/200/200/cats/5/',
  },
];

export const _chats = [
  {
    // чат я и John
    id: 1,
    contactIds: [1, 5],
  },
  {
    // чат я и номер
    id: 2,
    contactIds: [1, 2],
  },
  {
    // чат я и Малдер
    id: 3,
    contactIds: [1, 3],
  },
  {
    // чат я и Малдер
    id: 4,
    contactIds: [1, 3],
  },
  {
    // чат я и Humaniq
    id: 5,
    contactIds: [1, 0],
  },
  {
    // чат я Малдер и Скалли
    id: 6,
    contactIds: [1, 3, 4],
  },
  {
    // чат я Малдер и Скалли
    id: 7,
    groupName: 'Секретный чат',
    contactIds: [1, 3, 4],
  },
];

export const _messages = [
  // первый чат Я и John
  {
    // John пишет
    id: 1,
    senderId: 5,
    chatId: 1,
    state: DELIVERED,
    type: 'text',
    text: 'Привет',
    time: new Date(),
  },
  { // я отвечаю Как Дела.
    id: 2,
    senderId: 1,
    chatId: 1,
    state: SENDING,
    type: 'text',
    text: 'Как дела?',
    time: new Date(),
  },
  // Второй чат: я и номер телефона
  {
    // Я пишу
    id: 3,
    senderId: 1,
    chatId: 2,
    state: DELIVERED,
    type: 'text',
    text: 'Привет, Дай деньгу!',
    time: new Date(),
  },
  { // Номер отвечает
    id: 4,
    senderId: 2,
    chatId: 2,
    state: DELIVERED,
    transaction: T_OK,
    type: 'hmq',
    amount: 100,
    time: new Date(),
  },
  // Чат я и Малдер
  {
    id: 5,
    senderId: 1,
    chatId: 3,
    state: DELIVERED,
    transaction: T_WAIT,
    type: 'hmq',
    amount: 100,
    time: new Date(),
  },
  // Чат я и Малдер
  {
    id: 6,
    senderId: 1,
    chatId: 4,
    state: ACCEPTED,
    type: 'text',
    text: 'Hi',
    time: new Date(),
  },
  // Чат я и Humaniq
  {
    id: 7,
    senderId: 0,
    chatId: 5,
    state: DELIVERED,
    transaction: T_WAIT,
    type: 'hmq',
    amount: 100,
    time: new Date(),
  },
  // Чат я и Малдер и Скалли
  {
    id: 8,
    senderId: 1,
    chatId: 6,
    state: DELIVERED,
    type: 'text',
    text: 'Привет всем!',
    time: new Date(),
  },
  {
    id: 9,
    senderId: 3,
    chatId: 6,
    state: ACCEPTED,
    type: 'text',
    text: 'Здарова!',
    time: new Date(),
  },
  {
    id: 10,
    senderId: 4,
    chatId: 6,
    state: ACCEPTED,
    type: 'text',
    text: 'Хэлоу!!!',
    time: new Date(),
  },
  // Чат я и Малдер и Скалли именной
  {
    id: 11,
    senderId: 1,
    chatId: 7,
    state: DELIVERED,
    type: 'text',
    text: 'Где мой отчет?',
    time: new Date(),
  },
  {
    id: 12,
    senderId: 4,
    chatId: 7,
    state: ACCEPTED,
    type: 'text',
    text: 'Скоро будет!',
    time: new Date(),
  },
  {
    id: 13,
    senderId: 3,
    chatId: 7,
    state: ACCEPTED,
    type: 'text',
    text: ':)',
    time: new Date(),
  },
  {
    id: 14,
    senderId: 3,
    chatId: 7,
    state: ACCEPTED,
    type: 'text',
    text: 'Скоро Скоро )! Скоро Скоро )! Скоро Скоро )! Скоро Скоро )! Скоро Скоро )! Скоро Скоро )! ',
    time: new Date(),
  },

];
