import { ISettings } from "../database/models/Settings";

export default class BotConfig {

    private _name: string = "";
    private _cashname: string = "";

    // Emojis
    // LZ server
    NO_STONKS = "<:LZ_nostonks:1173954364432461854>"
    STONKS = "<:LZ_stonks:1173954341342818365>"
    CASH = "<:LZ_cookie:1173796905306816593>"
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
    KEKW =  "<:LZ_kekw:1173761402754846720>"
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
}