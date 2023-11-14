import { IUser } from "../database/models/User";
import moment from "moment";

export function cooldownCheck (cooldown: number, cmpDate: Date, resethours: boolean = false): { allowed: boolean, time: number, textTime: string } {
    
    const currentTime = new Date();
    const lastVoteDate = cmpDate;

    const nextVoteDate = new Date(lastVoteDate.getTime() + cooldown * 60 * 60 * 1000);

    let date1 = moment(lastVoteDate);
    let date2 = moment(nextVoteDate);

    if(!lastVoteDate) {
        return { allowed: true, time: 0, textTime: "" };
    }
    

    if(resethours) {
        nextVoteDate.setHours(0);
        nextVoteDate.setMinutes(0,0,0);
    }

    const offset = moment(currentTime).diff(lastVoteDate, 'hours');
    
    if (cooldown - offset <= 0) {
      
      return { allowed: true, time: date2.unix(), textTime: "" };

    }
    let hours = date2.diff(date1, 'hours');
    let minutes = Math.floor(date2.diff(date1, "minutes") / hours) - new Date().getMinutes();

    return { allowed: false, time: date2.unix(), textTime: `${hours} Horas e ${minutes} minutos`};
  }