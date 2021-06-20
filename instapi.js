const {
    IgApiClient
} = require('instagram-private-api');

const ig = new IgApiClient();

const username = 'nemnozko_ne_ot_suda';
const password = ')n<(7Fwh^JtK}`J';


ig.state.generateDevice(username);
(async () => {

    await ig.simulate.preLoginFlow();
    const loggedInUser = await ig.account.login(username, password);

    process.nextTick(async () => await ig.simulate.postLoginFlow());

    console.log(loggedInUser.pk);
    // try {
    //     //пошуковий сервіс
    //     return await ig.user.searchExact('pocoqie42442');
    //     console.log(search);

    //     //приклад результату
    //     // {
    //     //     pk: 16216870703,
    //     //     username: 'pocoqie',
    //     //     full_name: 'Bohdan',
    //     //     is_private: true,
    //     //     profile_pic_url: 'https://instagram.flwo3-1.fna.fbcdn.net/v/t51.2885-19/s150x150/120602265_782967299209732_1548880512624984866_n.jpg?tp=1&_nc_ht=instagram.flwo3-1.fna.fbcdn.net&_nc_ohc=VyqNFi0yM3oAX8B3GDJ&edm=AM7KJZYBAAAA&ccb=7-4&oh=98746bb95eebc5b572c601b106a2e456&oe=60D610CC&_nc_sid=d96ff1',
    //     //     profile_pic_id: '2412597900154824479_16216870703',
    //     //     is_verified: false,
    //     //     follow_friction_type: 0,
    //     //     has_anonymous_profile_picture: false,
    //     //     account_badges: [],
    //     //     friendship_status: {
    //     //       following: false,
    //     //       is_private: true,
    //     //       incoming_request: false,
    //     //       outgoing_request: false,
    //     //       is_bestie: false,
    //     //       is_restricted: false
    //     //     },
    //     //     latest_reel_media: 0,
    //     //     live_broadcast_id: null
    //     //   }

    // } catch (e) {
    //     if (e.message === 'User with exact username not found.') {
    //         console.log('user_not_fount');
    //     }
    // }


    //GET USER BY USERNAME 
    // try {
    //      return await ig.user.usernameinfo('peechels');

    //RESULT
    // {
    //     pk: 13699547819,
    //     username: 'peechels',
    //     full_name: 'pêchels',
    //     is_private: false,
    //     profile_pic_url: 'https://instagram.flwo3-1.fna.fbcdn.net/v/t51.2885-19/s150x150/91960598_170063914062649_474743531458527232_n.jpg?tp=1&_nc_ht=instagram.flwo3-1.fna.fbcdn.net&_nc_ohc=Qil57bGCAn0AX-Et3VL&edm=AKralEIBAAAA&ccb=7-4&oh=d9e6c155f000d5b48dfdfcd36ae73b24&oe=60D5B56B&_nc_sid=5e3072',
    //     profile_pic_id: '2280664012308130669_13699547819',
    //     is_verified: false,
    //     follow_friction_type: 0,
    //     has_anonymous_profile_picture: false,
    //     media_count: 2,
    //     geo_media_count: 0,
    //     follower_count: 37,
    //     following_count: 87,
    //     following_tag_count: 0,
    //     biography: 'UI/UX Designer',
    //     biography_with_entities: { raw_text: 'UI/UX Designer', entities: [] },
    //     external_url: 'https://www.behance.net/den1senko',
    //     external_lynx_url: 'https://l.instagram.com/?u=https%3A%2F%2Fwww.behance.net%2Fden1senko&e=ATM_t8NvMCyS5pXmzVBGo858EPCXroYu6I_feCusAoesnX5yBbfIUHMYeCm6D_5J4JeXbHUrlrttuJtqTD5pq40&s=1',
    //     total_igtv_videos: 0,
    //     usertags_count: 0,
    //     is_favorite: false,
    //     is_favorite_for_stories: false,
    //     is_favorite_for_igtv: false,
    //     live_subscription_status: 'default',
    //     has_chaining: true,
    //     hd_profile_pic_versions: [
    //       {
    //         width: 320,
    //         height: 320,
    //         url: 'https://instagram.flwo3-1.fna.fbcdn.net/v/t51.2885-19/s320x320/91960598_170063914062649_474743531458527232_n.jpg?tp=1&_nc_ht=instagram.flwo3-1.fna.fbcdn.net&_nc_ohc=Qil57bGCAn0AX-Et3VL&edm=AKralEIBAAAA&ccb=7-4&oh=3622a51a1626de45b7d5dafca85def41&oe=60D542A8&_nc_sid=5e3072'
    //       },
    //       {
    //         width: 640,
    //         height: 640,
    //         url: 'https://instagram.flwo3-1.fna.fbcdn.net/v/t51.2885-19/s640x640/91960598_170063914062649_474743531458527232_n.jpg?tp=1&_nc_ht=instagram.flwo3-1.fna.fbcdn.net&_nc_ohc=Qil57bGCAn0AX-Et3VL&edm=AKralEIBAAAA&ccb=7-4&oh=efdd7b2fd389c1417dc632e0c1fe7ca8&oe=60D63B4B&_nc_sid=5e3072'
    //       }
    //     ],
    //     hd_profile_pic_url_info: {
    //       url: 'https://instagram.flwo3-1.fna.fbcdn.net/v/t51.2885-19/91960598_170063914062649_474743531458527232_n.jpg?_nc_ht=instagram.flwo3-1.fna.fbcdn.net&_nc_ohc=Qil57bGCAn0AX-Et3VL&edm=AKralEIBAAAA&ccb=7-4&oh=cc5723264050b12bf9330c5648cc9647&oe=60D5385F&_nc_sid=5e3072',
    //       width: 736,
    //       height: 736
    //     },
    //     mutual_followers_count: 0,
    //     has_guides: false,
    //     is_eligible_for_smb_support_flow: false,
    //     smb_support_partner: null,
    //     direct_messaging: '',
    //     address_street: '',
    //     business_contact_method: '',
    //     category: null,
    //     city_id: 0,
    //     city_name: '',
    //     contact_phone_number: '',
    //     is_call_to_action_enabled: false,
    //     latitude: 0,
    //     longitude: 0,
    //     public_email: '',
    //     public_phone_country_code: '',
    //     public_phone_number: '',
    //     zip: '',
    //     instagram_location_id: '',
    //     is_business: false,
    //     account_type: 3,
    //     professional_conversion_suggested_account_type: 2,
    //     can_hide_category: true,
    //     can_hide_public_contacts: true,
    //     should_show_category: false,
    //     should_show_public_contacts: false,
    //     is_facebook_onboarded_charity: false,
    //     has_active_charity_business_profile_fundraiser: false,
    //     charity_profile_fundraiser_info: {
    //       pk: 13699547819,
    //       is_facebook_onboarded_charity: false,
    //       has_active_fundraiser: false,
    //       consumption_sheet_config: {
    //         can_viewer_donate: false,
    //         currency: null,
    //         donation_url: null,
    //         privacy_disclaimer: null,
    //         donation_disabled_message: "We're having trouble connecting right now. Please try your donation another time.",
    //         donation_amount_config: [Object],
    //         you_donated_message: null,
    //         profile_fundraiser_id: null,
    //         has_viewer_donated: null
    //       }
    //     },
    //     account_badges: []
    //   }
    // } catch(e) {
    //     console.log(e.message);
    // }

    //GET USER BY ID
    // try {
    // return await ig.user.info(<username>);
    //RESULT
    // {
    //     pk: 13699547819,
    //     username: 'peechels',
    //     full_name: 'pêchels',
    //     is_private: false,
    //     profile_pic_url: 'https://instagram.flwo3-1.fna.fbcdn.net/v/t51.2885-19/s150x150/91960598_170063914062649_474743531458527232_n.jpg?tp=1&_nc_ht=instagram.flwo3-1.fna.fbcdn.net&_nc_ohc=Qil57bGCAn0AX-Et3VL&edm=AEF8tYYBAAAA&ccb=7-4&oh=86a7fe231cd63a9685309f80d6d2a4f2&oe=60D5B56B&_nc_sid=a9513d',
    //     profile_pic_id: '2280664012308130669_13699547819',
    //     is_verified: false,
    //     follow_friction_type: 0,
    //     has_anonymous_profile_picture: false,
    //     media_count: 2,
    //     geo_media_count: 0,
    //     follower_count: 37,
    //     following_count: 87,
    //     following_tag_count: 0,
    //     biography: 'UI/UX Designer',
    //     biography_with_entities: { raw_text: 'UI/UX Designer', entities: [] },
    //     external_url: 'https://www.behance.net/den1senko',
    //     external_lynx_url: 'https://l.instagram.com/?u=https%3A%2F%2Fwww.behance.net%2Fden1senko&e=ATMasR4nE5OHb4kU-Z6VBfM34YsAj7XKuG_6K-8CfrJ4MVq0XRnYxrFBdNZ_gZzUcrupBT2uq7ZA-IeZz5kAyZg&s=1',
    //     total_igtv_videos: 0,
    //     has_videos: false,
    //     total_ar_effects: 0,
    //     usertags_count: 0,
    //     is_favorite: false,
    //     is_favorite_for_stories: false,
    //     is_favorite_for_igtv: false,
    //     is_favorite_for_highlights: false,
    //     live_subscription_status: 'default',
    //     is_interest_account: false,
    //     has_chaining: true,
    //     hd_profile_pic_versions: [
    //       {
    //         width: 320,
    //         height: 320,
    //         url: 'https://instagram.flwo3-1.fna.fbcdn.net/v/t51.2885-19/s320x320/91960598_170063914062649_474743531458527232_n.jpg?tp=1&_nc_ht=instagram.flwo3-1.fna.fbcdn.net&_nc_ohc=Qil57bGCAn0AX-Et3VL&edm=AEF8tYYBAAAA&ccb=7-4&oh=0f4f1dbc689497dd206ce91bff71cbfa&oe=60D542A8&_nc_sid=a9513d'
    //       },
    //       {
    //         width: 640,
    //         height: 640,
    //         url: 'https://instagram.flwo3-1.fna.fbcdn.net/v/t51.2885-19/s640x640/91960598_170063914062649_474743531458527232_n.jpg?tp=1&_nc_ht=instagram.flwo3-1.fna.fbcdn.net&_nc_ohc=Qil57bGCAn0AX-Et3VL&edm=AEF8tYYBAAAA&ccb=7-4&oh=236c4cfb228413291be728ff3483389e&oe=60D63B4B&_nc_sid=a9513d'
    //       }
    //     ],
    //     hd_profile_pic_url_info: {
    //       url: 'https://instagram.flwo3-1.fna.fbcdn.net/v/t51.2885-19/91960598_170063914062649_474743531458527232_n.jpg?_nc_ht=instagram.flwo3-1.fna.fbcdn.net&_nc_ohc=Qil57bGCAn0AX-Et3VL&edm=AEF8tYYBAAAA&ccb=7-4&oh=8c72542ddb6a1d4298dbfe0b865990e9&oe=60D5385F&_nc_sid=a9513d',
    //       width: 736,
    //       height: 736
    //     },
    //     mutual_followers_count: 0,
    //     has_highlight_reels: false,
    //     has_guides: false,
    //     show_shoppable_feed: false,
    //     shoppable_posts_count: 0,
    //     can_be_reported_as_fraud: false,
    //     merchant_checkout_style: 'none',
    //     seller_shoppable_feed_type: 'none',
    //     num_visible_storefront_products: 0,
    //     storefront_attribution_username: null,
    //     is_eligible_for_smb_support_flow: false,
    //     smb_support_partner: null,
    //     direct_messaging: '',
    //     address_street: '',
    //     business_contact_method: '',
    //     category: null,
    //     city_id: 0,
    //     city_name: '',
    //     contact_phone_number: '',
    //     is_call_to_action_enabled: false,
    //     latitude: 0,
    //     longitude: 0,
    //     public_email: '',
    //     public_phone_country_code: '',
    //     public_phone_number: '',
    //     zip: '',
    //     instagram_location_id: '',
    //     is_business: false,
    //     account_type: 3,
    //     professional_conversion_suggested_account_type: 2,
    //     can_hide_category: true,
    //     can_hide_public_contacts: true,
    //     should_show_category: false,
    //     should_show_public_contacts: false,
    //     account_badges: [],
    //     whatsapp_number: '',
    //     include_direct_blacklist_status: true,
    //     is_potential_business: false,
    //     show_post_insights_entry_point: true,
    //     request_contact_enabled: false,
    //     is_bestie: false,
    //     has_unseen_besties_media: false,
    //     show_account_transparency_details: false,
    //     auto_expand_chaining: false,
    //     highlight_reshare_disabled: false,
    //     is_memorialized: false,
    //     open_external_url_with_in_app_browser: true
    //   }
    // } catch (e) {
    //     console.log(e);
    // }


    

    // try {
    //     const followersFeed = ig.feed.accountFollowers('13699547819');

    //     // console.log(followersFeed);
    //     const items = await followersFeed.items();

    //     const size = 3;
    //     console.log(items.slice(0, size));
    // } catch (e) {
    //     console.log(e);
    // }
})();