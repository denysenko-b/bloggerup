const InstAccoundConfig = require('../config/minAccountRequirements.config');
const pointsRate = require('../config/pointsRate.config');

module.exports = {
    commands: [{
            command: 'start', //DONT CHANGE
            description: 'Повторная регистрация'
        },
        {
            command: 'menu', //DONT CHANGE
            description: 'Показать кнопки меню'
        },
        {
            command: 'help', //DONT CHANGE
            description: 'Справка'
        },
        {
            command: 'notifications', //DONT CHANGE
            description: 'Включить/ выключить оповещения о новых заданиях'
        }
        // ,
        // {
        //     command: 'cancel',
        //     description: 'Отменить' //TODO
        // }
    ],


    keyboards: {
        menu: {
            giveTask: 'Дать задание',
            getAvaliableTasks: 'Доступные задания',
            checkBalance: 'Проверить баланс'
            // ,
            // buyPoints: 'Купить очки'
        },
        giveTask: {
            likes: {
                text: 'Лайки',
                callback_data: 'task_likes'
            },
            followers: {
                text: 'Подписчики',
                callback_data: 'task_followers'
            }   
        },
        getTasks: {

        },
        doYouAgree: {
            followers: (callback_data) => [
                [{
                    text: 'Да',
                    callback_data: `cft=${callback_data}`
                }],
                [{
                    text: 'Нет',
                    callback_data: 'cancel'
                }]
            ],
            likes: (callback_data) => [
                [{
                    text: 'Да',
                    callback_data: `clt_m=${callback_data}`
                }],
                [{
                    text: 'Нет',
                    callback_data: 'cancel'
                }]
            ]
        },
        getPoints: [
            [
                {
                    text: 'Заработать',
                    callback_data: 'give_me_a_task'
                }
            ]
            // ,
            // [
            //     {
            //         text: 'Да',
            //         callback_data: 'create_likes_task'
            //     }
            // ]
        ]
    },


    reply: {
        commands: {
            start: `Чтобы зарегистрироваться и начать бесплатное продвижение, введите ник Вашего Instagram профиля. Он должен соответствовать следующим условиям:\n(Якийсь смайл) наличие минимум ${InstAccoundConfig.minPhotos} фотографий,\n(Якийсь смайл) наличие ${InstAccoundConfig.minFollowers} подписчиков\n\nФЕЙКИ БУДУТ БЛОКИРОВАТЬСЯ 🔒`,

            menu: `Меню`,

            help: `Команды:\n/start — зарегистрироваться заново,\n/menu — показать главное меню,\n/notifications — включить / выключить оповещения о новых заданиях.`, //,\n/cancel - отменить предидущею команду

            notifications: {
                on: `Оповещения о новых заданиях активированы!\nЧтобы отключить их, введите команду /notifications`,
                off: `Вы больше не будете получать оповещения о новых заданиях!\nЧтобы активировать их, введите команду /notifications`
            },

            // cancel: `Отменено.`,

            error: (command) => `Виникла непередбачувана помилка\nСпробуйте викликати /${command} ще раз через деякий час`
        },

        messages: {
            newInstAccount: {
                alreadyExists: `already exists`,
                successfulReg: (username) => `Successful reg, ${username}`,
                incorrect: `Incorect profile name,\nPls try again:`,
                notFound: `User not found`,
                isPrivate: `Account is private!!!`,
                fewSubscribers: `Few subscribers`,
                fewMedia: `Few media`,
                firstCompleteTheRegistration: `Прежде чем использовать сервис, введите свой инстаграм никнейм:`,
                check: `🧐` //Check...
            },
            referral: {
                about: `Расскажите друзьям о нашем сервисе и получите 500 плюшек за каждого!\nВсего 2 простых шага:\n1. Перешлите это сообщение друзьям, которые зарегистрированы на Behance или разместите Вашу реферальную ссылку https://t.me/bodya-pups на просторах сети;\n2. Когда приглашённый пользователь выполнит первое задание, Вам придёт оповещение и будет автоматически начислено 500 плюшек 💰\n❗ Друг должен воспользоваться именно Вашей реферальной ссылкой 👇`
            },
            buyPoints: {
                about: `You can buy points...`
            },

            tasks: {
                getAvaliableTasks: {
                    check: 'Check...',
                    notAvaliableNow: `Not avaliable tasks now`,
                    unhandledError: `Unhandled error`
                },
                giveTask: {
                    about: 'Please, selecte one from next categories: ',
                    followers: {
                        about: 'How will it happen? (About this action)',
                        showCurrentBalance: (points) => `You have ${points} (points)`,
                        pointsRate: `Current rate: ${pointsRate.pointsToFollowers}`,
                        waitFollowersCount: `Please, enter how many followers you want`,
                        showCost: (points) => `It costs ${points} (points)`,
                        waitUserAgree: `Do you argee?`,

                        successfulAddTask: `The task for followers at a cost as is successful added`
                    },


                    errors: {
                        notEnoughPoints: `Not enoung ponts\nPlease, type the lower number:`,
                        notANumber: `Not a number, pls, type again:`,
                        errorWhileCreatingTask: `error while creating task`
                    }
                },
                checkBalance: {
                    balance: (points) => `Points: ${points}`
                },
                buyPoints: {

                }
            },

            cancelQuery: `Отменено`,
            iDontUnderstand: `Я тебя не понимаю...`,
            error: (message = '') => `Iternal server error: 500 ${message}`
        }
    }
}