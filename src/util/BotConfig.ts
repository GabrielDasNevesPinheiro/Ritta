import { ISettings } from "../database/models/Settings";

export default class BotConfig {

    private _name: string = "";
    private _cashname: string = "";

    // Emojis
    // LZ server
    NO_STONKS = "<:LZ_nostonks:1173954364432461854>"
    STONKS = "<:LZ_stonks:1173954341342818365>"
    CASH = "<:LZ_fichas:1174026554075005020>"
    FLOWER = "<:LZ_flower:1173778878825771008>"
    FEAR = "<:LZ_fear:1173778853060153385>"
    THINKING = "<:LZ_thinking:1173778773586477156>"
    OWO = "<:LZ_owo:1173778643395301477>"
    CONFUSED = "<:LZ_confused:1173778280470544404>"
    NO = "<:LZ_no:1173778191412899860>"
    ANNOUNCE = "<:LZ_Announce:1173770336265834569>"
    EYES = "<:LZ_eyes:1173763570274668554>"
    MONEY = "<:LZ_money:1173761910873796618>"
    NERVOUS = "<:LZ_nervous:1173761881845022830>"
    CHARMING = "<:LZ_charming:1173761858860224512>"
    GG = "<:LZ_gg:1173761815600173087>"
    LOVE = "<:LZ_love:1173761785799643177>"
    OK = "<:LZ_ok:1173761733383421972>"
    CANDLES = "<:LZ_candles:1173761714802659338>"
    SICK = "<:LZ_seasick:1173761698394554489>"
    CHARMED = "<:LZ_charmed:1173761625459802322>"
    HEART = "<:LZ_heart:1173761593947996211>"
    HURT = "<:LZ_hurt:1173761572347330600>"
    CLOWN = "<:LZ_hurt:1173761572347330600>"
    PARTY = "<:LZ_clown:1173761550385942568>"
    SURPRISED = "<:LZ_surprised:1173761503376187422>"
    PEPE = "<:LZ_pepe:1173761467774935150>"
    PAT = "<:LZ_pat:1173761448036532348>"
    NOOOO = "<:LZ_nOoOo:1173761427903889408>"
    KEKW = "<:LZ_kekw:1173761402754846720>"
    AWN = "<:LZ_kekw:1173761402754846720>"
    PEPEHEART = "<:LZ_pepeheart:1173761342604324894>"
    BRIGHT = "<:LZ_pepeheart:1173761342604324894>"
    HALLOWEEN = "<:LZ_halloween:1173761288233549874>"
    DRINKING = "<:LZ_halloween:1173761288233549874>"
    SCARED = "<:LZ_scared:1173761189977792532>"
    ANOTED = "<:LZ_anoted:1173761170616893440>"
    SAD = "<:LZ_sad:1173761151629279284>"
    FRIGHT = "<:LZ_fright:1173761134097076325>"
    FACEPALM = "<:LZ_facepalm:1173761110457978940>"
    WAITING = "<:LZ_waiting:1174084916951126096>"
    CRYING = "<:LZ_crying:1174084287734231100>"
    VIP_NO = "<:LZ_no:1174321296516059176>"
    VIP_YES = "<:LZ_si:1174321267424374834>" 


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
    IMG_TASK = "https://i.imgur.com/aC4quov.png"
    IMG_FBI = "https://i.imgur.com/5HdE197.png"
    IMG_GUN = "https://i.imgur.com/o5dGAU4.png"
    IMG_RAINMONEY = "https://i.imgur.com/5urPHlx.jpg"
    LOCAL_IMG_DOUBLE_RED = "./src/assets/red_double.jpg"
    LOCAL_IMG_DOUBLE_BLACK = "./src/assets/black_double.jpg"
    LOCAL_IMG_DOUBLE_WHITE = "./src/assets/white_double.jpg"
    LOCAL_IMG_DOUBLE_COIN= "./src/assets/coin_double.png"

    normalBetChances = 0.5;
    vipBetChances = 0.65;

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
        return `**${this.CASH} ${ammount.toLocaleString("pt-BR")} ${this.cashname}**`
    }
}