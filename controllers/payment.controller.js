const UserController = require("./user.controller");

const paymentConfig = require("../config/payment.config");
const {
    reply: { payment: replyText },
} = require("../texts");

class PaymentController {
    createInvoice = (
        chat_id,
        title,
        description,
        currency,
        price,
        points,
        // photo_url,
        // photo_width,
        // photo_height,
        provider = "tranzzo"
    ) => {
        const invonce = {
            chat_id,
            provider_token: paymentConfig.tokens[provider],
            start_parameter: 'get_access',
            title,
            description,
            currency,
            prices: [{ label: title, amount: price * 100 }],
            // photo_url,
            // photo_width,
            // photo_height,
            payload: {
                unique_id: `${chat_id}_${Number(new Date())}`,
                points,
                provider_token: paymentConfig.tokens[provider],
            },
        };

        return invonce;

        // ctx.replyWithInvoice(getInvoice(ctx.from.id));
    };

    check = async (ctx) => {
        try {
            const message = ctx.update.pre_checkout_query;

            const invoncePayload = JSON.parse(
                message.invoice_payload
            );
            const userId = message.from.id;

            await UserController.updateUserPoints(userId, invoncePayload.points);
            return ctx.answerPreCheckoutQuery(true);
        } catch (e) {
            console.log(e);
            ctx.answerPreCheckoutQuery(false, replyText.errors.sendPoints);
        }
    };

    successful = async (ctx) => {
        const invoncePayload = JSON.parse(
            ctx.message.successful_payment.invoice_payload
        );
        return await ctx.reply(replyText.successfullyGotPoints(invoncePayload.points));
    };
}

module.exports = new PaymentController();
