import { IUser } from "../database/models/User";
import moment from "moment";


export function isVipExpired(user: IUser) {
  return cooldownCheck(720, user.vipDate, false);
}

export function isBoosterExpired(user: IUser) {
  return cooldownCheck(360, user.boosterDate, false);
}

export function sortCooldownCheck(minutes: number, cmpDate: Date) {
  const currentDate = moment(); 
  const comparisonDate = moment(cmpDate);

  const diffInMinutes = currentDate.diff(comparisonDate, 'minutes');
  return diffInMinutes >= minutes;
}

export function getMinutesCooldownFromNow(minutes: number) {
  const currentDate = moment(); 

  const futureDate = currentDate.add(minutes, 'minutes');
  return futureDate.unix();
}

export function cooldownCheck (cooldown: number, cmpDate: Date, resethours: boolean = false): { allowed: boolean, time: number, textTime: string } {
    
    const currentTime = new Date();
    const lastVoteDate = cmpDate;

    if(!lastVoteDate) {
        return { allowed: true, time: 0, textTime: "" };
    }
    
    const nextVoteDate = new Date(lastVoteDate.getTime() + cooldown * 60 * 60 * 1000);

    if(resethours) {
        nextVoteDate.setHours(0);
        nextVoteDate.setMinutes(0,0,0);
    }

    const offset = moment(currentTime).diff(lastVoteDate, 'hours');
    
    if (cooldown - offset <= 0) {
      
      return { allowed: true, time: 0, textTime: "" };

    }
    let date1 = moment(lastVoteDate);
    let date2 = moment(nextVoteDate);
    let hours = date2.diff(date1, 'hours');
    let minutes = Math.floor(date2.diff(date1, "minutes") / hours) - new Date().getMinutes();

    return { allowed: false, time: date2.unix(), textTime: `${hours} Horas e ${minutes} minutos`};
  }

  export function dailyCooldownCheck (cooldown: number, cmpDate: Date, resethours: boolean = false): { allowed: boolean, time: number, textTime: string } {
    
    const currentTime = new Date();
    const lastVoteDate = cmpDate;

    if(!lastVoteDate) {
        return { allowed: true, time: 0, textTime: "" };
    }
    
    const nextVoteDate = new Date(lastVoteDate.getTime() + cooldown * 60 * 60 * 1000);

    if(resethours) {
        nextVoteDate.setHours(0);
        nextVoteDate.setMinutes(0,0,0);
    }

    const offset = moment(lastVoteDate).diff(currentTime, 'hours');
    
    if ((offset + cooldown) <= 0) {
      
      return { allowed: true, time: 0, textTime: "" };

    }
    let date1 = moment(lastVoteDate);
    let date2 = moment(nextVoteDate);
    let hours = date2.diff(date1, 'hours');
    let minutes = Math.floor(date2.diff(date1, "minutes") / hours) - new Date().getMinutes();

    return { allowed: false, time: date2.unix(), textTime: `${hours} Horas e ${minutes} minutos`};
  }

  export function claimCooldownCheck (cooldown: number, cmpDate: Date, resethours: boolean = false): { allowed: boolean, time: number, textTime: string } {
    
    const currentTime = new Date();
    const lastVoteDate = cmpDate;

    if(!lastVoteDate) {
        return { allowed: true, time: 0, textTime: "" };
    }
    
    const nextVoteDate = new Date(lastVoteDate.getTime() + cooldown * 60 * 60 * 1000);

    if(resethours) {
        nextVoteDate.setHours(0);
        nextVoteDate.setMinutes(0,0,0);
    }

    const offset = moment(lastVoteDate).diff(currentTime, 'hours');
    
    if ((offset + cooldown) <= 0) {
      
      return { allowed: true, time: 0, textTime: "" };

    }
    let date1 = moment(lastVoteDate);
    let date2 = moment(nextVoteDate);
    let hours = date2.diff(date1, 'hours');
    let minutes = Math.floor(date2.diff(date1, "minutes") / hours) - new Date().getMinutes();

    return { allowed: false, time: date2.unix(), textTime: `${hours} Horas e ${minutes} minutos`};
  }