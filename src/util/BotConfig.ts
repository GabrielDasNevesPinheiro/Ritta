import UserController from "../database/controllers/UserController";
import { ISettings } from "../database/models/Settings";
import { titles } from "../database/static/TitleList";

export default class BotConfig {

    private _name: string = "";
    private _cashname: string = "";

    // Emojis
    // LZ server
    NO_STONKS = "<:Desapontado:1180561094327148686>"
    STONKS = "<:Brilhante:1180561782801191042>"
    CASH = "<:fichas:1182514243103358976>"
    FLOWER = "<:Te_amo:1180561245829615616>"
    FEAR = "<:Medo:1180368513165168730>"
    THINKING = "<:Duvida:1180559151122878464>"
    OWO = "<:Cute:1180366869111255050>"
    CONFUSED = "<:Duvida:1180559151122878464>"
    NO = "<:Raiva:1180560934029234296>"
    ANNOUNCE = "<:Anuncio:1180347873230069860>"
    EYES = "<:Omg:1180561170059493426>"
    MONEY = "<:Brilhoso:1180363819147595838>"
    NERVOUS = "<:Raiva:1180560934029234296>"
    CHARMING = "<:Coraao:1180347814174273627>"
    GG = "<:Pensando:1180559035481735240>"
    LOVE = "<:Coraao:1180347814174273627>"
    OK = "<:Eii:1180559204021440543>"
    CANDLES = "<:LZ_candles:1173761714802659338>"
    SICK = "<:LZ_seasick:1173761698394554489>"
    CHARMED = "<:LZ_charmed:1173761625459802322>"
    HEART = "<:LZ_heart:1173761593947996211>"
    HURT = "<:LZ_hurt:1173761572347330600>"
    CLOWN = "<:LZ_hurt:1173761572347330600>"
    PARTY = "<:LZ_clown:1173761550385942568>"
    SURPRISED = "<:Pensando:1180559035481735240>"
    PEPE = "<:LZ_pepe:1173761467774935150>"
    PAT = "<:LZ_pat:1173761448036532348>"
    NOOOO = "<:Espantado:1180559286036856843>"
    KEKW = "<:LZ_kekw:1173761402754846720>"
    AWN = "<:LZ_kekw:1173761402754846720>"
    PEPEHEART = "<:Coraao:1180347814174273627>"
    BRIGHT = "<:Brilhante:1180561782801191042>"
    HALLOWEEN = "<:LZ_halloween:1173761288233549874>"
    DRINKING = "<:Bebendo:1180347718074380320>"
    SCARED = "<:Espantado:1180559286036856843>"
    ANOTED = "<:Brilhante:1180561782801191042>"
    SAD = "<:Triste:1180560857223139438>"
    FRIGHT = "<:Espantado:1180559286036856843>  "
    FACEPALM = "<:Talvez:1180585669807054888>"
    WAITING = "<:Bebendo:1180347718074380320>"
    CRYING = "<:Triste:1180560857223139438>"
    VIP_NO = "<:Desapontado:1180561094327148686>"
    VIP_YES = "<:Brilhante:1180561782801191042>"
    IDK = "<:Pensando:1180559035481735240>"
    HI = "<:Eii:1180559204021440543>"
    OMG = "<:Espantado:1180559286036856843>"
    HORSE = "🏇"


    //assets images consts
    IMG_BRIGHT = "https://i.imgur.com/PjEWmdh.png"
    IMG_FLOWER = "https://i.imgur.com/PjEWmdh.png"
    IMG_HEART = "https://i.imgur.com/JkgrVmI.png"
    IMG_HEARTS = "https://i.imgur.com/JkgrVmI.png"
    IMG_HEY = "https://i.imgur.com/Ny6dJmW.png"
    IMG_HYPE = "https://i.imgur.com/Ny6dJmW.png"
    IMG_INDIGNATED = "https://i.imgur.com/ACV8e9x.png"
    IMG_LAUGH = "https://i.imgur.com/PjEWmdh.png"
    IMG_LOVE = "https://i.imgur.com/PjEWmdh.png"
    IMG_NOSTONKS = "https://i.imgur.com/GG7Ryaq.png"
    IMG_NOTED = "https://i.imgur.com/kGFOrh7.png"
    IMG_PEACE = "https://i.imgur.com/kGFOrh7.png"
    IMG_PLEASE = "https://i.imgur.com/kGFOrh7.png"
    IMG_QI = "https://i.imgur.com/kGFOrh7.png"
    IMG_SONG = "https://i.imgur.com/kGFOrh7.png"
    IMG_STONKS = "https://i.imgur.com/Ny6dJmW.png"
    IMG_THEROCK = "https://i.imgur.com/PjEWmdh.png"
    IMG_TIME = "https://i.imgur.com/Q7ra7U8.png"
    IMG_TONGLE = "https://i.imgur.com/JkgrVmI.png"
    IMG_TASK = "https://i.imgur.com/PjEWmdh.png"
    IMG_FBI = "https://i.imgur.com/PjEWmdh.png"
    IMG_GUN = "https://i.imgur.com/Q7ra7U8.png"
    IMG_RAINMONEY = "https://i.imgur.com/Ny6dJmW.png"
    IMG_DICE = "https://i.imgur.com/WXJxDPY.png"
    IMG_CRASH = "https://i.imgur.com/gBJZfxk.png"
    LOCAL_IMG_DOUBLE_RED = "./src/assets/red_double.jpg"
    LOCAL_IMG_DOUBLE_BLACK = "./src/assets/black_double.jpg"
    LOCAL_IMG_DOUBLE_WHITE = "./src/assets/white_double.jpg"
    LOCAL_IMG_DOUBLE_COIN = "./src/assets/coin_double.png"
    LOCAL_IMG_DOUBLE_LINE = "./src/assets/double_line.png"
    LOCAL_IMG_DOUBLE_BACKGROUND = "./src/assets/double_background.png"
    LOCAL_IMG_DOUBLE_BLACK_RESULT = "./src/assets/double_black_result.png"
    LOCAL_IMG_DOUBLE_RED_RESULT = "./src/assets/double_red_result.png"
    LOCAL_IMG_DOUBLE_WHITE_RESULT = "./src/assets/double_white_result.png"
    LOCAL_IMG_TIGER = "./src/assets/tiger.png"
    LOCAL_IMG_TIGER_WIN = "./src/assets/tiger_win.png"
    LOCAL_IMG_TIGER_LOSE = "./src/assets/tiger_lose.png"
    LOCAL_IMG_TIGER_LOSESTAR = "./src/assets/tiger_losestar.png"
    LOCAL_IMG_JACKPOT_BACKGROUND = "./src/assets/jackpot_template.png"
    LOCAL_IMG_BOMB = "./src/assets/bomb.png"
    LOCAL_IMG_EXPLOSION = "./src/assets/explosion.png"
    LOCAL_IMG_DICE_BACKGROUND = "./src/assets/dice_template.png"
    LOCAL_IMG_DICE = "./src/assets/dado.png"
    LOCAL_IMG_ROULETTELOSE = "./src/assets/roleta_lose.png"
    LOCAL_IMG_ROULETTE1K = "./src/assets/roleta_1k.png"
    LOCAL_IMG_ROULETTE5K = "./src/assets/roleta_5k.png"
    LOCAL_IMG_ROULETTE9K = "./src/assets/roleta_9k.png"
    LOCAL_IMG_ROULETTE15K = "./src/assets/roleta_15k.png"
    LOCAL_IMG_RANK = "./src/assets/rank_template.png"
    LOCAL_IMG_ROULETTEVIP = "./src/assets/roleta_vip.png"
    LOCAL_IMG_PROFILE_TEMPLATE = "./src/assets/profile_template.png"
    LOCAL_IMG_PROFILE_TEMPLATE_NOBG = "./src/assets/profile_template_nobg.png"
    LOCAL_IMG_STORE_BACKGROUND = "./src/assets/store_background.jpg"
    LOCAL_IMG_DEFAULT_PROFILE_BG = "./src/assets/default_profile_bg.png"
    GIF_DOUBLE = "https://i.imgur.com/onMSkcv.gif"
    GIF_TIGER = "https://i.imgur.com/XfWN4e6.gif"
    GIF_2DICE = "https://i.imgur.com/KnnOITl.gif"
    GIF_5DICE = "https://i.imgur.com/pvhPqLR.gif"
    GIF_7DICE = "https://i.imgur.com/290D4qc.gif"
    GIF_ROULETTE = "https://i.imgur.com/QT0os3y.gif"

    // authorized for restricted commands
    admins = ["1044106122220540015", "274553417685270528", "803492136543977513"];

    normalBetChances = 0.5;
    vipBetChances = 0.65;
    vipPassiveEarning = 7;
    vipPassiveEarningCooldown = 60;
    boosterPassiveEarning = 3;
    repsLimit = 10000;
    payLimit = 10000;

    vipPrice = 10.00;

    emojis = ["🐵", "🐶"];

    pets: Array<{ name: string, emoji: string, price: number }> = [
        {
            "name": "Alexanduck",
            "emoji": "<a:Alexanduck:1180519634164785224>",
            "price": 160000
        },
        {
            "name": "Axeon",
            "emoji": "<a:Axeon:1180518434442854421>",
            "price": 140000
        },
        {
            "name": "Billance",
            "emoji": "<a:Billance:1180521545727221841>",
            "price": 135000
        },
        {
            "name": "Blazehound",
            "emoji": "<a:Blazehound:1180518403832815626>",
            "price": 275000
        },
        {
            "name": "Bulla",
            "emoji": "<a:Bulla:1180518460728553543>",
            "price": 85000
        },
        {
            "name": "Chimpmunk",
            "emoji": "<a:Chimpmunk:1180518500696064080>",
            "price": 115000
        },
        {
            "name": "Croakur",
            "emoji": "<a:Croakur:1180518919891595304>",
            "price": 235000
        },
        {
            "name": "Doyle",
            "emoji": "<a:Doyle:1180521567608901742>",
            "price": 95000
        },
        {
            "name": "Firestorm",
            "emoji": "<a:Firestorm:1180519502597849229>",
            "price": 220000
        },
        {
            "name": "Frongue",
            "emoji": "<a:Frongue:1180519571036323940>",
            "price": 75000
        },
        {
            "name": "Furlion",
            "emoji": "<a:Furlion:1180519533996429373>",
            "price": 90000
        },
        {
            "name": "Gartesque",
            "emoji": "<a:Gartesque:1180519732651233360>",
            "price": 285000
        },
        {
            "name": "Gorryson",
            "emoji": "<a:Gorryson:1180568264850546839>",
            "price": 300000
        },
        {
            "name": "Grizzitch",
            "emoji": "<a:Grizzitch:1180521213936816190>",
            "price": 230000
        },
        {
            "name": "Murko",
            "emoji": "<a:Murko:1180521244936900660>",
            "price": 65000
        },
        {
            "name": "Ozy",
            "emoji": "<a:Ozy:1180521274892632094>",
            "price": 155000
        },
        {
            "name": "Quaggi",
            "emoji": "<a:Quaggi:1180522208368525392>",
            "price": 60000
        },
        {
            "name": "Roawrath",
            "emoji": "<a:Roawrath:1180521430778134558>",
            "price": 190000
        },
        {
            "name": "Snowbane",
            "emoji": "<a:Snowbane:1180521491184500937>",
            "price": 130000
        },
        {
            "name": "Sparky",
            "emoji": "<a:Sparky:1180521458976424037>",
            "price": 150000
        },
        {
            "name": "Suntaur",
            "emoji": "<a:Suntaur:1180568277878046810>",
            "price": 245000
        },
        {
            "name": "Reaper",
            "emoji": "<a:Reaper:1180521301681647707>",
            "price": 215000
        },
        {
            "name": "Vampy",
            "emoji": "<a:Vampy:1180521520863395873>",
            "price": 80000
        }
    ];

    crashChannel = process.env.CRASH_CHANNEL;

    public constructor(config: ISettings) {
        this._name = config.botname as string;
        this._cashname = config.cashname as string;
    }

    public get name() {
        return this._name;
    }

    public get cashname() {
        return this._cashname;
    }

    public getCashString(ammount: number): string {
        return `**${this.CASH} ${ammount.toLocaleString("pt-BR").split(",")[0]} ${this.cashname}**`
    }

    public async mention(userId: string): Promise<string> {
        let user = await UserController.getUserById(userId);
        let str = "";
        if(user.activatedTitle) str += titles[String(user.activatedTitle)].translate(String(user.titleName));

        str += (str === "") ? `<@${userId}>` : `(<@${userId}>)`;

        return str;
    }
}