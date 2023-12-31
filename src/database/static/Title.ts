
export default class Title {

    public icon: string = "";
    public price: number = 0;
    public chars: Map<string, string> = new Map();

    constructor(icon: string = "", price: number = 0) {
        this.icon = icon;
        this.price = price;
    }

    public translate(content: string): string | null {
        let parsed: string = "";
        
        if(!this.isValid(content)) return null;

        content.split("").forEach((char) => {
            parsed += this.chars.get(char);
        });

        return parsed;

    }

    public setupChars(...chars: string[]) {
        let codes = "abcdefghijklmnopqrstuvwxyz0123456789".split("");
        codes.forEach((code, index) => this.chars.set(code, chars[index]));
    }

    private isValid(input: string) {
        let regex = /^[a-z0-9]+$/i;
        return regex.test(input);
    }

}