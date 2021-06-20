const InstAccoundConfig = require('../config/minAccountRequirements.config');
const pointsRate = require('../config/pointsRate.config');
const tasksConfig = require('../config/tasks.config');
const referralRewards = require('../config/referralRewards.confg');

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
            [{
                text: 'Заработать',
                callback_data: 'give_me_a_task'
            }],
            [{
                text: 'Стать рефералом',
                callback_data: 'become_a_referral'
            }]
            // ,
            // [
            //     {
            //         text: 'Да',
            //         callback_data: 'create_likes_task'
            //     }
            // ]
        ],
        checkTheTaskIsOver: {
            followers: callback_data => [
                [{
                    text: 'Проверить',
                    callback_data: `cftc=${callback_data}`
                }]
            ]
        }
    },


    reply: {
        commands: {
            start: `Чтобы зарегистрироваться и начать бесплатное продвижение, введите ник Вашего Instagram профиля. Он должен соответствовать следующим условиям:\n(Якийсь смайл) наличие минимум ${InstAccoundConfig.minPhotos} фотографий,\n(Якийсь смайл) наличие ${InstAccoundConfig.minFollowers} подписчиков\nНаличие аватарки\n\nФЕЙКИ БУДУТ БЛОКИРОВАТЬСЯ 🔒`,

            menu: `Меню`,

            help: `Команды:\n/start — зарегистрироваться заново,\n/menu — показать главное меню,\n/notifications — включить / выключить оповещения о новых заданиях.\n\nЖалобы и предложения:\n@ipromot_helper`, //,\n/cancel - отменить предидущею команду

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
                mustHaveAnAvatar: `Your account must have an avatar`,
                check: `🧐` //Check...
            },
            buyPoints: {
                about: `You can buy points...`
            },

            tasks: {
                getAvaliableTasks: {
                    check: 'Check...',
                    notAvaliableNow: `Not avaliable tasks now`,
                    unhandledError: `Unhandled error`,

                    followers: {
                        createTask: (full_name, username) => `${full_name}\nYou should subscribe for this user go to the link:\nhttps://www.instagram.com/${username}\nClick on this button after:`,
                        check: {
                            notSigned: `Почему не подписался?`,
                            wait: time => `Не грузи систему, подожди еще ${time}`,
                            successfullyExecuted: `Успешно виполнено, держи еще`,
                            unhandledError: `Немножко подожди и попробуй еще раз`
                        }
                    }
                },
                giveTask: {
                    about: 'Please, selecte one from next categories: ',
                    followers: {
                        about: 'How will it happen? (About this action)',
                        showCurrentBalance: (points) => `You have ${points} (points)`,
                        pointsRate: `Current rate: ${pointsRate.pointsToFollowers}`,
                        waitFollowersCount: `Please, enter how many followers you want (min count = ${tasksConfig.minCount.followers})`,
                        showCost: (points) => `It costs ${points} (points)`,
                        waitUserAgree: `Do you argee?`,

                        successfulAddTask: `The task for followers at a cost as is successful added`
                    },


                    errors: {
                        notEnoughPoints: `Not enoung ponts\nPlease, type the lower number:`,
                        notANumber: `Not a number, pls, type again:`,
                        errorWhileCreatingTask: `error while creating task`,
                        lessThenMinCount: {
                            followers: `Please, type a number greater than min count: `
                        },
                        fewPoints: `Too few points. Чтобы дать задание нужно минимум: ${tasksConfig.minPointsCount}`
                    }
                },
                checkBalance: {
                    balance: (points) => `Points: ${points}`
                },
                buyPoints: {

                },
                notifications: `Проверьте наличие новых заданий`
            },

            referralRewards: {
                about: `Выполните свое первое задание и получите дополнительние 500 очков!`,
                parent: (name) => `Держите вознаграждение в размере ${referralRewards.points} за ${name}`,
                child: (name) => `Вам начислено ${referralRewards.points} за реферала ${name}`,

                becomeAReferral: (userId) => {
                    const link = `t.me/test_instagram_promotion_bot?start=${userId}`;

                    return `(Текст треба переписати так, ніби вони обоє отримають по ${referralRewards.points} голди. Чєли яких пригласили все одно должні виконати одне завдання, шо би получити це)Расскажите друзьям о нашем сервисе и получите 500 плюшек за каждого!\nВсего 2 простых шага:\n1. Перешлите это сообщение друзьям, которые зарегистрированы на Behance или разместите Вашу реферальную ссылку ${link} на просторах сети;\n2. Когда приглашённый пользователь выполнит первое задание, Вам придёт оповещение и будет автоматически начислено 500 плюшек 💰\n\n❗ Друг должен воспользоваться именно Вашей реферальной ссылкой 👇\n${link}`;
                } //TODO Поміняй силку на бота
            },

            banned: `Вы нарушили правила сервиса, за что и были наказаны.\n\nЕсли Вы считаете, что Вас обвинили по ошибке, свяжитесь с:\n@ipromot_helper`,
            cancelQuery: `Отменено`,
            iDontUnderstand: `Я тебя не понимаю...`,
            error: (message = '') => `Iternal server error: 500 ${message}`
        }
    }
}