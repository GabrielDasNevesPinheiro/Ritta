import { ISettings } from "../database/models/Settings";

export default class BotConfig {

    private _name: string = "";
    private _cashname: string = "";

    // Emojis
    // LZ server
    NO_STONKS = "<:Desapontado:1180561094327148686>"
    STONKS = "<:Brilhante:1180561782801191042>"
    CASH = "<:LZ_fichas:1174026554075005020>"
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
    BRIGHT = "<:Coraao:1180347814174273627>"
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
    IMG_BRIGHT = "https://i.imgur.com/ixIrNrS.jpg"
    IMG_FLOWER = "https://i.imgur.com/5Dcjr8Y.jpg"
    IMG_HEART = "https://i.imgur.com/x0E3ATK.jpg"
    IMG_HEARTS = "https://i.imgur.com/g4NPbOl.jpg"
    IMG_HEY = "https://i.imgur.com/cmLYH6J.jpg"
    IMG_HYPE = "https://i.imgur.com/PNRlLKA.jpg"
    IMG_INDIGNATED = "https://i.imgur.com/U3BCrfS.jpg"
    IMG_LAUGH = "https://i.imgur.com/j9PBNlc.jpg"
    IMG_LOVE = "https://i.imgur.com/g4NPbOl.jpg"
    IMG_NOSTONKS = "https://i.imgur.com/IckHKwX.jpg"
    IMG_NOTED = "https://i.imgur.com/FQ3Uxzp.jpg"
    IMG_PEACE = "https://i.imgur.com/4GkF2mN.jpg"
    IMG_PLEASE = "https://i.imgur.com/tmvduSF.jpg"
    IMG_QI = "https://i.imgur.com/1BHjohp.jpg"
    IMG_SONG = "https://i.imgur.com/4xQXZQY.jpg"
    IMG_STONKS = "https://i.imgur.com/Tjw4jrJ.jpg"
    IMG_THEROCK = "https://i.imgur.com/hIHKorw.jpg"
    IMG_TIME = "https://i.imgur.com/1eyAtc1.jpg"
    IMG_TONGLE = "https://i.imgur.com/GZBJwG7.jpg"
    IMG_TASK = "https://i.imgur.com/mWqkWC9.png"
    IMG_FBI = "https://i.imgur.com/5HdE197.png"
    IMG_GUN = "https://i.imgur.com/o5dGAU4.png"
    IMG_RAINMONEY = "https://i.imgur.com/OYsWRvE.png"
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
    GIF_DOUBLE = "https://i.imgur.com/onMSkcv.gif"
    GIF_TIGER = "https://i.imgur.com/XfWN4e6.gif"
    GIF_2DICE = "https://i.imgur.com/KnnOITl.gif"
    GIF_5DICE = "https://i.imgur.com/pvhPqLR.gif"
    GIF_7DICE = "https://i.imgur.com/290D4qc.gif"
    GIF_ROULETTE = "https://i.imgur.com/QT0os3y.gif"
    


    normalBetChances = 0.5;
    vipBetChances = 0.65;
    vipPassiveEarning = 7;
    vipPassiveEarningCooldown = 60;
    boosterPassiveEarning = 3;

    repsLimit = 10000;
    payLimit = 10000;

    vipPrice = 10.00;

    emojis = ["🐵", "🐶"];
    crashChannel = "1180514195192688691";

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
}