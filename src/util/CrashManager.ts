

export abstract class CrashManager {

    static running = false;
    static inGame: {[key: string]: { username: string, userId: string, bet: number, stoppedMultiplier: number, stopped: boolean, lose: boolean } } = {}

}