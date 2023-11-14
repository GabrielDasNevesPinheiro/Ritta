import { ISettings } from "../database/models/Settings";

export default class BotConfig {

    private _name: string = "";
    private _cashname: string = "";

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