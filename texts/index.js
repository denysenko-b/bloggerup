const InstAccoundConfig = require('../config/minAccountRequirements.config');

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
        },
        {
            command: 'cancel',
            description: 'Отменить' //TODO
        }
    ],


    keyboards: {
        menu: {
            giveTask: 'Дать задание',
            getAvaliableTasks: 'Доступные задания',
            checkBalance: 'Проверить баланс',
            buyPoints: 'Купить очки'
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

        }
    },


    reply: {
        commands: {
            start: `Чтобы зарегистрироваться и начать бесплатное продвижение, введите ник Вашего Instagram профиля. Он должен соответствовать следующим условиям:\n(Якийсь смайл) наличие минимум ${InstAccoundConfig.minPhotos} фотографий,\n(Якийсь смайл) наличие ${InstAccoundConfig.minFollowers} подписчиков\n\nФЕЙКИ БУДУТ БЛОКИРОВАТЬСЯ 🔒`,

            menu: `Меню`,

            help: `Команды:\n/start — зарегистрироваться заново,\n/menu — показать главное меню,\n/notifications — включить / выключить оповещения о новых заданиях,\n/cancel - отменить предидущею команду.`,

            notifications: {
                on: `Оповещения о новых заданиях активированы!\nЧтобы отключить их, введите команду /notifications`,
                off: `Вы больше не будете получать оповещения о новых заданиях!\nЧтобы активировать их, введите команду /notifications`
            },

            cancel: `Отменено.`,

            error: (command) => `Виникла непередбачувана помилка\nСпробуйте викликати /${command} ще раз через деякий час`
        },

        messages: {
            newInstAccount: {
                alreadyExists: `already exists`,
                successfulReg: (username) => `Successful reg, ${username}`,
                incorrect: `Не корректне ім'я профілю\nPls try again `,
                notFound: `User not found`,
                isPrivate: `Account is private!!!`,
                fewSubscribers: `Few subscribers`,
                fewMedia: `Few media`,
                check: `Check...`
            },
            referral: {
                about: `Расскажите друзьям о нашем сервисе и получите 500 плюшек за каждого!\nВсего 2 простых шага:\n1. Перешлите это сообщение друзьям, которые зарегистрированы на Behance или разместите Вашу реферальную ссылку https://t.me/bodya-pups на просторах сети;\n2. Когда приглашённый пользователь выполнит первое задание, Вам придёт оповещение и будет автоматически начислено 500 плюшек 💰\n❗ Друг должен воспользоваться именно Вашей реферальной ссылкой 👇`
            },
            buyPoints: {
                about: `You can buy points...`
            },

            tasks: {
                getAvaliableTasks: {
                    check: 'Check...'
                },
                giveTask: {
                    about: 'Please, selecte one from next categories: '
                },
                checkBalance: {
                    balance: (points) => `Points: ${points}`
                },
                buyPoints: {

                }
            },

            iDontUnderstand: `Я тебя не понимаю...`,
            error: (message) => `Помилка на сервері`
        }
    }
}