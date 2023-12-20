
export default class Title {

    public icon: string = "";
    public chars: Map<string, string> = new Map();


    public translate(content: string): string | null {
        let parsed: string = "";
        
        if(!this.isValid(content)) return null;

        content.split("").forEach((char) => {
            parsed += this.chars.get(char);
        });

        return parsed;

    }

    private isValid(input: string) {
        let regex = /^[a-z0-9]+$/i;
        return regex.test(input);
    }

}