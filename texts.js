const InstAccoundConfig = require("./config/minAccountRequirements.config");
const pointsRate = require("./config/pointsRate.config");
const tasksConfig = require("./config/tasks.config");
const referralRewards = require("./config/referralRewards.confg");
const instagraServiceConfig = require("./config/instagramService.config");
const helperConfig = require("./config/helper.config");
const paymentConfig = require("./config/payment.config");
const pointsConfig = require("./config/points.config");

const getReferralLink = (userId) =>
    `https://t.me/@${helperConfig.username}?start=${userId}`;

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
        {
            command: "policies",
            description: "Политика BloggerUP"
        },
        {
            command: "contacts",
            description: "Контакты службы поддержки"
        }
        // ,
        // {
        //     command: 'cancel',
        //     description: 'Отменить' //TODO
        // }
    ],

    keyboards: {
        menu: {
            getAvaliableTasks: "▶ Выполнить задание",
            manageTasks: "💼 Управлять заданиями",
            checkBalance: `${pointsConfig.icon} Мои созвездия`,
            // ,
            // buyPoints: 'Купить очки'
        },
        manageTasks: [
            [
                {
                    text: "📋 Мои задания",
                    callback_data: "my_tasks",
                },
                {
                    text: "➕ Создать задание",
                    callback_data: "give_task",
                },
            ],
        ],
        myTasks: {
            item: {
                createCallbackData: (taskId, next, id) =>
                    `mto=["${taskId}", ${next}, ${id}]`,
                createText: ({ taskType, taskState, completed, count }, id) =>
                    `${id}. ${tasksConfig.stickers[taskState][0]} ${tasksConfig.types[taskType]} (${completed} из ${count}) »`,
            },
            nextButton: (next) => ({
                text: `Далее ➡️`,
                callback_data: `my_tasks_next_page=${~~next + 1}`,
            }),
            prevButton: (next) => ({
                text: `⬅️ Назад`,
                callback_data: `my_tasks_next_page=${~~next - 1}`,
            }),
            backButton: (next) => ({
                text: `« Назад`,
                callback_data: `my_tasks_back_from_editor=${~~next}`,
            }),
            freezeButton: (taskId, next, id) => ({
                text: "🛑 Приостановить",
                callback_data: `mtf=["${taskId}", ${next}, ${id}]`,
            }),
            unfreezeButton: (taskId, next, id) => ({
                text: "▶ Востановить",
                callback_data: `mtuf=["${taskId}", ${next}, ${id}]`,
            }),
        },
        giveTask: {
            likes: {
                text: "Лайки ❤",
                callback_data: "task_likes",
            },
            followers: {
                text: "Подписчики 🧍",
                callback_data: "task_followers",
            },
        },
        doYouAgree: {
            followers: (callback_data) => [
                [
                    {
                        text: "✅ Да",
                        callback_data: `cft=${callback_data}`,
                    },
                ],
                [
                    {
                        text: "❌ Нет",
                        callback_data: "cancel",
                    },
                ],
            ],
            likes: (callback_data) => [
                [
                    {
                        text: "✅ Да",
                        callback_data: `clt_m=${callback_data}`,
                    },
                ],
                [
                    {
                        text: "❌Нет",
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
                    text: "🤝 Пригласить друга",
                    callback_data: "become_a_referral",
                },
            ],
            [
                {
                    text: "💳 Купить созвездия",
                    callback_data: "buy_points",
                },
            ],
        ],
        referralLink: (userId) => [
            [
                {
                    text: "🔗 Перейти к боту",
                    url: getReferralLink(userId),
                },
            ],
        ],
        checkTheTaskIsOver: (callback_data, shortLink) => [
            [
                {
                    text: "✅ Готово",
                    callback_data: `cttio=${callback_data}`,
                },
                {
                    text: "❌ Пропусить",
                    callback_data: `cttio=skip`,
                },
            ],
            [
                {
                    text: "🔗 Открыть",
                    url: `https://www.instagram.com/${shortLink}`,
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
                    text: "Tranzzo USD",
                    callback_data: `bp=${callback_data}&tranzzo`,
                },
            ],
        ],
        policies: [
            [{
                text: "Privacy Policy",
                url: helperConfig.privacyPolicyUrl
            }],
            [{
                text: "Публичная оферта",
                url: helperConfig.publicOfferUrl
            }]
        ]
    },

    reply: {
        commands: {
            start: `Чтобы зарегистрироваться и начать бесплатное продвижение, введите ник Вашего Instagram аккаунта.\nТребования к вашей учетной записи::\n-👤 аватар,\n-🖼️ минимум ${InstAccoundConfig.minPhotos} медиа,\n-🧍 минимум ${InstAccoundConfig.minFollowers} подписчиков\n-🙈 открытий профиль\n\nФЕЙКИ БУДУТ БЛОКИРОВАТЬСЯ 🔒`,

            menu: `Меню`,

            help: [
                `Команды:`,
                `/start — зарегистрироваться заново,`,
                `/menu — показать главное меню,`,
                `/notifications — включить / выключить оповещения о новых заданиях,`,
                `/support - система поддержки (тикет-система),`,
                `/policies - политика BloggerUP`,
                `/contacts - контакты службы поддержки\n`,
                `Жалобы и предложения:`,
                `Telegram: @${helperConfig.username}`,
                `E-mail: ${helperConfig.email}`
            ].join('\n'),

            // help: `Команды:\n/start — зарегистрироваться заново,\n/menu — показать главное меню,\n/notifications — включить / выключить оповещения о новых заданиях.\n/support - система поддержки (тикет-система)\n/privacy - Политика конфиденциальности\n\n\nЖалобы и предложения:\n@${helperConfig.username}`, //,\n/cancel - отменить предидущею команду

            notifications: {
                on: `Оповещения о новых заданиях активированы!\nЧтобы отключить их, введите команду /notifications`,
                off: `Вы больше не будете получать оповещения о новых заданиях!\nЧтобы активировать их, введите команду /notifications`,
            },

            support: `Опишите, пожалуйста, суть проблемы с которой Вы столкнулись:`,

            contacts: [
                `Тех-поддержка:`,
                `Telegram: @${helperConfig.username}`,
                `E-mail: ${helperConfig.email}`
            ].join('\n'),
            policies: `Политика BloggerUP`
            // cancel: `Отменено.`,
        },

        messages: {
            // shortTutorial: `Краткий туториал по коммандах`, //TODO надо доделать
            newInstAccount: {
                alreadyExists: `Такой аккаунт уже зарегистрирован!\nЕсли это действительно Ваш аккаунт, обратитесь в нашу службу поддержки @${helperConfig.username}`, // или нажмите на кнопку ниже и следуйте инструкции для проверки аккаунта.
                successfulReg: `👍️ Отлично! Ваша регистрация прошла успешно!\nТеперь, нажмите кнопку «▶ Выполнить задание », чтобы получить ЗАДАЧИ на комментирование, лайки или подписку.\nЗа каждое выполненное задание Вам будут начислены созвездия ${pointsConfig.icon}.\nПосле того как Вы соберете более ${tasksConfig.minPointsCount}${pointsConfig.icon}, их можно будет обменять на лайки, комментарии или подписчиков для Вашего Instagram профиля.\nКурс обмена созвездий:\n${[
                    `${pointsConfig.icon}1000 созвездий = ${1000 / pointsRate.likes[0]} лайков;`,
                    `${pointsConfig.icon}1000 созвездий = ${1000 / pointsRate.comments[0]} комментариев;`,
                    `${pointsConfig.icon}1000 созвездий = ${1000 / pointsRate.followers[0]} подписчиков;`,
                ].join("\n")}`,
                incorrect: `Некорректный никнейм. Попробуйте ещё раз:`,
                notFound: `Пользователя с таким ником не существует.\nПровертье правильность написания и попробуйте ещё раз:`,
                isPrivate: `Аккаунт не должен быть приватным!\nИзмените тип аккаунта либо введите никнейм от другого аккаунта и попробуйте снова:`,
                fewSubscribers: `Недостаточно подпискиков!\nМинимальное количество: ${InstAccoundConfig.minFollowers}. Введите ник аккаунта, который соответсвует минимальным требованиям:`,
                fewMedia: `Недостаточно медиа!\nМинимальное количество: ${InstAccoundConfig.minPhotos}. Введите ник аккаунта, который соответсвует минимальным требованиям:`,
                firstCompleteTheRegistration: `Прежде чем использовать возможности сервиса, Вы должны зарегестрироватся. Введите комманду /start и следуйте инструкции.`,
                mustHaveAnAvatar: `Аккаунт должен иметь аватар!\nВведите ник аккаунта, который соответсвует минимальным требованиям:`,
                manyRequests: `В связи с ограничениями Инстаграма, я не могу выполнять проверку слишком часто.\nПодождите ${instagraServiceConfig.minTimeDelay} и попробуйте ещё раз:`,
                check: `Проверка...`, //Check...
            },

            tasks: {
                getAvaliableTasks: {
                    search: `Поиск 🔎`,
                    notAvaliableNow: `Пока нет доступных заданий. Попробуйте позже`,
                    manyRequests: `В связи с ограничениями Инстаграма, я не могу выполнять проверку слишком часто.\nПодождите ${instagraServiceConfig.minTimeDelay} и попробуйте ещё раз.`,

                    followers: {
                        createTask: (username) =>
                            `Тип задания: ПОДПИСКА 🧍\n🔗 Перейдите по этой ссылке: https://www.instagram.com/${username}\nВОЙДИТЕ В СВОЙ АККАУНТ и поставьте лайк. Чтобы подтвердить выполнение, нажмите на кнопку ✅\nПосле проверки Вы получите на счёт ${pointsRate.followers[0]} созвездий ${pointsConfig.icon}.`,
                        notCompleted: `Для завершения задания нужно подписаться`,
                    },
                    likes: {
                        createTask: (shortUrl) =>
                            `Тип задания: ЛАЙК ❤\n🔗 Перейдите по этой ссылке:\nhttps://www.instagram.com/p/${shortUrl}\nВОЙДИТЕ В СВОЙ АККАУНТ и подпишитесь. Чтобы подтвердить выполнение, нажмите на кнопку ✅\nПосле проверки Вы получите на счёт ${pointsRate.likes[0]} созвездий ${pointsConfig.icon}.`,
                        notCompleted: `Для завершения задания нужно поставить лайк ♥`
                    },

                    check: "Проверка 🧐",
                    successfullyExecuted: `Успешно виполнено, держи еще`,
                    successfullyExecutedWithReward: `Успешно виполнено`,
                },
                manageTasks: {
                    about: "Тут можно управлять Вашими заданиями или заказать продвижение для Вашего профиля!",
                    noTasks: `Похоже, что Вы еще не создали ни одного задания :(`,
                    myTasks: (aCount) =>
                        `Активных заданий прямо сейчас: ${aCount} 💼\nСписок всех Ваших заданий находиться ниже 👇`,
                    taskEditor: (taskState, count, completed, id, text) =>
                        `${id}. ${tasksConfig.stickers[taskState][0]} (${tasksConfig.stickers[taskState][1]}) ${completed} из ${count}\n\n${text}`,
                },
                giveTask: {
                    about: "Что будем продвигать?\nВыберете тип задания ниже 👇",
                    followers: `Сколько подписчиков Вы бы хотели получить? Минимальное количество: ${tasksConfig.minCount.followers}`,
                    likes: {
                        about: `Пожалуйста, предоставьте ссылку на пост в следующем формате:\nhttps://www.instagram.com/p/media_id`,

                        notFound: "Пост не найден. Введите ссылку на существующий пост:",
                        notYourAccount: "Не ваш аккаунт. Введите ссылку на Ваш пост",
                        notVerifiedUrl: `Некорректная ссылка.\nПожалуйста, предоставьте ссылку на пост в следующем формате:\nhttps://www.instagram.com/p/media_id`,
                        badRequest: `Пост не был найден. Проверьте mediaId (часть ссылки, которая идет после .com/p/...), и попробуйте ещё раз:`,

                        waitLikesCount: `Сколько лайков Вы хотели бы собрать? Минимальное количество: ${tasksConfig.minCount.likes}`,
                    },

                    addNewTask: {
                        showCost: (points) => `Это будет стоить ${points}${pointsConfig.icon} созвездий.\nВы согласны? (После того, как нажмете да, создание задания будет завершено)`,

                        successfulAddTask: `Задание было успешно добавлено. В скором времени Вас настигнет популярнось :)`,
                    },

                    errors: {
                        notEnoughPoints: `Недостаточно созвездий. Пожалуйста, введите немного меньшее число:`,
                        notANumber: `Введите число:`,
                        errorWhileCreatingTask: `Произошла какая-то ошибка вовремя создания задания`,
                        lessThenMinCount: {
                            followers: `Пожалуйста, введи число, большее чем минимальное количество:`,
                            likes: `Пожалуйста, введи число, большее чем минимальное количество:`,
                        },
                        fewPoints: `Недостаточно созвездий. Чтобы создать задание нужно минимум: ${tasksConfig.minPointsCount}`,
                    },
                },
                checkBalance: {
                    balance: (points) => `В Вашей Вселенной: <b>${points}</b>${pointsConfig.icon} созвездий`,
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
                    `Здравствуйте ${name}!\n\n${message}\n\nС уважением @${helperConfig.username}.`,
            },

            buyPoints: {
                get about() {
                    const cashback = paymentConfig.points.cachback.reduce(
                        (a, [min, max, percent]) =>
                            a +
                            `от ${min} ${max < Infinity ? "до " + max : ""
                            } ${pointsConfig.icon} - бонус ${~~(percent * 100)}% 🎁\n`,
                        ""
                    );

                    const [points, dollars] = paymentConfig.points.rate;

                    return `Стоимость созвездий: ${points} = ${dollars}$\n\nКешбек при пополнении ✨:\n${cashback}\nВведите цифрами количество созвездий, которое Вы желаете приобрести (минимум ${paymentConfig.points.min}):`;
                },
                notANumber: `Введите число`,
                littleNumber: `Мин ${paymentConfig.points.min}\nType again:`,
                bigNumber: `Простите, однако пока что невозможно купить сколько созвездий за один раз :( Пожалуйста, введите немного меньшее число:`,
                selectThePaymentProvider: `Пожалуйста, выберите удобный способ оплаты:`,
                title: count => `${count} ${pointsConfig.icon}`,
                description: `Покупка созвездий.`
            },

            //TODO
            referralRewards: {
                // about: `Выполните свое первое задание и получите дополнительние 500 очков!`,
                message: (name) =>
                    `В Вашей Вселенной пополнение! Благодаря ${name} мы смогли обнаружить 🔭 ${referralRewards.points} новых созвездий ${pointsConfig.icon}.`,

                becomeAReferral: (userId) =>
                    `Расскажите другу о нашем сервисе и ОБА получите по ${referralRewards.points} созвездий ${pointsConfig.icon}\nВсего 2 простых шага:\n1. Перешлите это сообщение друзьям или разместите Вашу реферальную ссылку ${getReferralLink(
                        userId
                    )} на просторах сети;\n2. Когда приглашённый пользователь выполнит первое задание, Вам придёт оповещение и будет автоматически начислено ${referralRewards.points} созвездий ${pointsConfig.icon}\n\n❗ Друг должен воспользоваться именно Вашей реферальной ссылкой 👇`,
            },

            ban: {
                //TODO колись добавлю
                // warnings: [
                //     `Не торопитесь`, //коли бот це каже, він не виконує команди пользователя, тоість тут треба буде розписати так, шо юзер повинен ввести ще раз то шо він вводив
                //     `Второе предупреждение`,
                //     `как только ви получите 5 предупреждений ваш аккаунт будет забанен`,
                // ],
                spam: `Не торопитесь`,
                finnaly: `Вы нарушили правила сервиса, за что и были наказаны.\n\nЕсли Вы считаете, что Вас обвинили по ошибке, свяжитесь с:\n@${helperConfig.username}`,
            },
            instagramService: {
                unavaliable: `Сервис Инстаграма временно недоступен :(\nПовторите запрос немного позже.`,
            },
            unhandledError: `Необработанная ошибка, пожалуйста, повторите действие ещё раз.`,
            cancelQuery: `Отменено.`,
            iDontUnderstand: `Извините, но я пока не умею распознавать рукописный ввод :(`,
            error: `Похоже произошло что-то ужасное\n\nПожалуйста, обратитесь в нашу службу поддержки @${helperConfig.username}`,
        },

        payment: {
            successfullyGotPoints: (points) =>
                `Спасибо за покупку!\nНовых созвездний - ${points} ${pointsConfig.icon}.`,

            errors: {
                sendPoints: `Ой! Похоже произошла ошибка вовремя подсчёта созвездий.`,
                exceedingTheLimit: `Превышение лимита пополнения созвездий. `
            },
        },
    },

    botSettings: {
        about: [
            `Бесплатное продвижение Instagram\n`,
            `Тех-поддержка:`,
            `Telegram: @${helperConfig.username}`,
            `E-mail: ${helperConfig.email}`

        ].join('\n')
    }
};
