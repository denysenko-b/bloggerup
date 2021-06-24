const InstAccoundConfig = require("../config/minAccountRequirements.config");
const pointsRate = require("../config/pointsRate.config");
const tasksConfig = require("../config/tasks.config");
const referralRewards = require("../config/referralRewards.confg");
const instagraServiceConfig = require("../config/instagramService.config");
const helperConfig = require("../config/helper.config");
const paymentConfig = require("../config/payment.config");



const getReferralLink = (userId) => `https://t.me/test_instagram_promotion_bot?start=${userId}`

module.exports = {
    commands: [
        {
            command: "start", //DONT CHANGE
            description: "Повторная регистрация",
        },
        {
            command: "menu", //DONT CHANGE
            description: "Показать кнопки меню",
        },
        {
            command: "help", //DONT CHANGE
            description: "Справка",
        },
        {
            command: "notifications", //DONT CHANGE
            description: "Включить/ выключить оповещения о новых заданиях",
        },
        {
            command: "support",
            description: "Запрос в техподдержку",
        },
        // ,
        // {
        //     command: 'cancel',
        //     description: 'Отменить' //TODO
        // }
    ],

    keyboards: {
        menu: {
            getAvaliableTasks: "▶ Выполнить задание",
            giveTask: "💼 Управлять заданиями",
            checkBalance: "💰 Баланс",
            // ,
            // buyPoints: 'Купить очки'
        },
        giveTask: {
            likes: {
                text: "Лайки",
                callback_data: "task_likes",
            },
            followers: {
                text: "Подписчики",
                callback_data: "task_followers",
            },
        },
        doYouAgree: {
            followers: (callback_data) => [
                [
                    {
                        text: "Да",
                        callback_data: `cft=${callback_data}`,
                    },
                ],
                [
                    {
                        text: "Нет",
                        callback_data: "cancel",
                    },
                ],
            ],
            likes: (callback_data) => [
                [
                    {
                        text: "Да",
                        callback_data: `clt_m=${callback_data}`,
                    },
                ],
                [
                    {
                        text: "Нет",
                        callback_data: "cancel",
                    },
                ],
            ],
        },
        getPoints: [
            // [
            //     {
            //         text: "Заработать",
            //         callback_data: "give_me_a_task",
            //     },
            // ],
            [
                {
                    text: "🤝 Партнёрская программа",
                    callback_data: "become_a_referral",
                },
            ],
            [
                {
                    text: "💳 Пополнить баланс",
                    callback_data: "buy_points",
                },
            ],
        ],
        referralLink: (userId) => [
            [
                {
                    text: "🔗 Перейти к боту",
                    url: getReferralLink(userId)
                },
            ],
        ],
        checkTheTaskIsOver: (callback_data) => [
            [
                {
                    text: "Проверить",
                    callback_data: `cttio=${callback_data}`,
                },
            ],
        ],
        supportSendAddMaterial: (id) => [
            [
                {
                    text: "Пропустить",
                    callback_data: `support_ss=["${id}"]`,
                },
            ],
        ],
        supportTheProblemIsSuccessfulyCompleted: (callback_data) => [
            [
                {
                    text: "Решена",
                    callback_data: `stpisc=${callback_data}`,
                },
            ],
        ],
        selectThePaymentProvider: (callback_data) => [
            [
                {
                    text: 'Tranzzo USD',
                    callback_data: `bp=${callback_data}&tranzzo`
                }
            ]
        ]
    },

    reply: {
        commands: {
            start: `Чтобы зарегистрироваться и начать бесплатное продвижение, введите ник Вашего Instagram профиля. Он должен соответствовать следующим условиям:\n(Якийсь смайл) наличие минимум ${InstAccoundConfig.minPhotos} фотографий,\n(Якийсь смайл) наличие ${InstAccoundConfig.minFollowers} подписчиков\n\nФЕЙКИ БУДУТ БЛОКИРОВАТЬСЯ 🔒`,

            menu: `Меню`,

            help: `Команды:\n/start — зарегистрироваться заново,\n/menu — показать главное меню,\n/notifications — включить / выключить оповещения о новых заданиях.\n/support - система поддержки (тикет-система)\n\nЖалобы и предложения:\n@${helperConfig.username}`, //,\n/cancel - отменить предидущею команду

            notifications: {
                on: `Оповещения о новых заданиях активированы!\nЧтобы отключить их, введите команду /notifications`,
                off: `Вы больше не будете получать оповещения о новых заданиях!\nЧтобы активировать их, введите команду /notifications`,
            },

            support: `Опишите, пожалуйста, суть проблемы с которой Вы столкнулись:`,
            // cancel: `Отменено.`,

            error: (command) =>
                `Виникла непередбачувана помилка\nСпробуйте викликати /${command} ще раз через деякий час`,
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
                manyRequests: `Много запросов, падажжи ${instagraServiceConfig.minTimeDelay} сек`,
                check: `🧐`, //Check...
            },

            tasks: {
                getAvaliableTasks: {
                    check: "Check...",
                    notAvaliableNow: `Not avaliable tasks now`,
                    unhandledError: `Unhandled error`,
                    manyRequests: `Много запросов, подождите ${instagraServiceConfig.minTimeDelay} сек и попробуйте снова`,
                    instagramServiceIsUnavaliable: `Сервис инстаграма сейчас временно недоступен, пожалуйста, подождите несколько минут и попробуйте снова`,

                    followers: {
                        check: `Проверка...`,
                        createTask: (full_name, username) =>
                            `${full_name}\nYou should subscribe for this user go to the link:\nhttps://www.instagram.com/${username}\nClick on this button after:`,
                        wait: (time) => `Не грузи систему, подожди еще ${time}`,
                        successfullyExecuted: `Успешно виполнено, держи еще`,
                        successfullyExecutedWithReward: `Успешно виполнено`,
                        notCompleted: `Подписка?`,
                        instagramServiceIsUnavaliable: `Сервис сейчас временно не доступен. Давай пізніше`,
                    },
                    likes: {
                        check: `Проверка...`,
                        createTask: (shortUrl) =>
                            `You should like this media going to the link:\nhttps://www.instagram.com/p/${shortUrl}`,
                        wait: (time) => `Не грузи систему, подожди еще ${time}`,
                        successfullyExecuted: `Успешно виполнено, держи еще`,
                        successfullyExecutedWithReward: `Успешно виполнено`,
                        notCompleted: `Лайк где?`,
                        instagramServiceIsUnavaliable: `Сервис сейчас временно не доступен. Давай пізніше`,
                    },
                },
                giveTask: {
                    about: "Please, selecte one from next categories: ",
                    followers: {
                        about: "How will it happen? (About this action)",
                        showCurrentBalance: (points) =>
                            `You have ${points} (points)`,
                        pointsRate: `Current rate: ${pointsRate.followers}`,
                        waitFollowersCount: `Please, enter how many followers you want (min count = ${tasksConfig.minCount.followers})`,
                        showCost: (points) => `It costs ${points} (points)`,
                        waitUserAgree: `Do you argee?`,

                        successfulAddTask: `The task for followers at a cost as is successful added`,
                    },
                    likes: {
                        about: `Коротко про завданя, щоб ставити лайки\nВведіть посилання на пост.\nПожалуйста, предоставьте ссылку на пост в следующем формате:\nhttps://www.instagram.com/p/your_hash`,

                        waitUserAgree: (points) =>
                            `Cost: ${points} points.\nВи згодні?`,

                        notFound: "Пост не найден",
                        notYourAccount: "Не ваш аккаунт",
                        notVerifiedUrl: `Не коректно`,
                        badRequest: `Не коректні данні`,

                        waitLikesCount: `Please, enter how many likes you want (min count = ${tasksConfig.minCount.likes})`,
                        showCost: (points) => `It costs ${points} (points)`,
                        waitUserAgree: `Do you argee?`,

                        successfulAddTask: `The task for likes at a cost as is successful added`,
                    },

                    errors: {
                        notEnoughPoints: `Not enoung ponts\nPlease, type the lower number:`,
                        notANumber: `Not a number, pls, type again:`,
                        errorWhileCreatingTask: `error while creating task`,
                        lessThenMinCount: {
                            followers: `Please, type a number greater than min count: `,
                            likes: `Please, type a number greater than min count: `,
                        },
                        fewPoints: `Too few points. Чтобы дать задание нужно минимум: ${tasksConfig.minPointsCount}`,
                        unhandledError: `Unhandled error`,
                    },
                },
                checkBalance: {
                    balance: (points) => `На Вашем счету: ${points}💰 points.`,
                },
                notifications: `Проверьте наличие новых заданий`,
            },

            support: {
                sendAddMaterials: `Отправьте, пожалуйста, один скриншот или видео с демонстрацией, это поможет нам быстрее разобраться!`,
                theProblemIsSuccessfullyCompleted: (id) =>
                    `Ваш вопрос #${id} был решён!\nПожалуйста, проверьте, а если проблема осталась, пишите: @${helperConfig.username}`,
                created: (id) =>
                    `Спасибо, Вашей заявке присвоен номер - #${id}\nВ ближайшее время наш специалист решит данный вопрос и Вы получите соответствующее уведомление!\nПри неоходимости - наши специалисты свяжутся с Вами для уточнения деталей обращения.`,
                problem: (
                    problemId,
                    firstName,
                    username,
                    userId,
                    chatId,
                    message
                ) =>
                    `#BUG\n\n<b>Id</b>:${problemId}\n\n<b>From:</b>\nName - ${firstName}\nUsername - ${username}\nId - ${userId}\nChatId - ${chatId}\n\n<b>Problem:</b>\n${message}`,
                fixed: (prev) => `#BUG_FIXED${prev.slice(4)}`,
                sendMessage: (name, message) =>
                    `Здравствуйте ${name}!\n\n${message}\n\nС уважением @${helperConfig.username}.\nНе отвечайте на это письмо.`,
            },

            buyPoints: {
                get about() {
                    const cashback = paymentConfig.points.cachback.reduce(
                        (a, [min, max, percent]) =>
                            a +
                            `от ${min} ${
                                max < Infinity ? "до " + max : ""
                            } монет - бонус ${~~(percent * 100)}% 🎁\n`,
                        ""
                    );

                    const [points, dollars] = paymentConfig.points.rate;

                    return `Стоимость монет: ${points} = ${dollars}$\n\nКешбек при пополнении 💸:\n${cashback}\nВведите цифрами сумму монет, на которую Вы желаете пополнить счёт (минимум 1000):`;
                },
                notANumber: `Введите число`,
                littleNumber: `Мин ${paymentConfig.points.min}\nType again:`,
                selectThePaymentProvider: `Пожалуйста, выберите удобный способ оплаты:`
            },

            referralRewards: {
                about: `Выполните свое первое задание и получите дополнительние 500 очков!`,
                parent: (name) =>
                    `Держите вознаграждение в размере ${referralRewards.points} за ${name}`,
                child: (name) =>
                    `Вам начислено ${referralRewards.points} за реферала ${name}`,

                becomeAReferral: (userId) => `Расскажите друзьям о нашем сервисе и получите 500 плюшек за каждого!\nВсего 2 простых шага:\n1. Перешлите это сообщение друзьям, которые зарегистрированы на Behance или разместите Вашу реферальную ссылку ${getReferralLink(userId)} на просторах сети;\n2. Когда приглашённый пользователь выполнит первое задание, Вам придёт оповещение и будет автоматически начислено 500 плюшек 💰\n\n❗ Друг должен воспользоваться именно Вашей реферальной ссылкой 👇`,
            },

            ban: {
                warnings: [
                    `Не торопитесь`, //коли бот це каже, він не виконує команди пользователя, тоість тут треба буде розписати так, шо юзер повинен ввести ще раз то шо він вводив
                    `Второе предупреждение`,
                    `как только ви получите 5 предупреждений ваш аккаунт будет забанен`,
                ],

                finnaly: `Вы нарушили правила сервиса, за что и были наказаны.\n\nЕсли Вы считаете, что Вас обвинили по ошибке, свяжитесь с:\n@${helperConfig.username}`,
            },
            instagramService: {
                unavaliable: `Сервис инстаграма временно не доступен, попробуйте пожалуйста позже...`,
            },
            cancelQuery: `Отменено`,
            iDontUnderstand: `Извините, но я пока не умею распознавать рукописный ввод но я работаю над этим.`,
            error: (message = "") => `Сама серйозна помилка`,
        },

        payment: {
            successfullyGotPoints: (points) =>
                `На вас счет начислено ${points} очок\nБлагодарим за покупку)`,

            errors: {
                sendPoints: `Помилка начислення очок`,
            },
        },
    },
};
