import { IUser } from "../database/models/User";

export function calculateTimeRemainingForNextVote(user: IUser): string {
    const currentTime = new Date();
    const lastVoteDate = user.votedate || currentTime;

    
    const nextVoteDate = new Date(lastVoteDate.getTime() + 24 * 60 * 60 * 1000);

    const timeRemainingInMillis = nextVoteDate.getTime() - currentTime.getTime();

    if (timeRemainingInMillis <= 0) {
      
      return 'Você pode votar agora!';
      
    }

    
    const hours = Math.floor(timeRemainingInMillis / (60 * 60 * 1000));
    const minutes = Math.floor((timeRemainingInMillis % (60 * 60 * 1000)) / (60 * 1000));

    return `Aguarde ${hours} horas e ${minutes} minutos para votar novamente.`;
  }