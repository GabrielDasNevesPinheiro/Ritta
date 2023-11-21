import { CanvasRenderingContext2D, Image, createCanvas, loadImage } from "canvas";
import { botConfig } from "../app";
import { User } from "discord.js";
import { IUser } from "../database/models/User";


export async function getDouble(sorted: string) {
    let width = 653;
    let height = 250;

    const canvas = createCanvas(width, height);
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

    let posX = 0;
    if (sorted === "red") ctx.drawImage(await loadImage(botConfig.LOCAL_IMG_DOUBLE_RED_RESULT), 0, 0);
    if (sorted === "black") ctx.drawImage(await loadImage(botConfig.LOCAL_IMG_DOUBLE_BLACK_RESULT), 0, 0);
    if (sorted === "white") ctx.drawImage(await loadImage(botConfig.LOCAL_IMG_DOUBLE_WHITE_RESULT), 0, 0);

    const buffer = canvas.toBuffer('image/jpeg');

    return buffer;
}

export async function loadImageURL(url: string) {

    const fetched_icon = await (await fetch(url)).arrayBuffer();
    const image = await loadImage(Buffer.from(fetched_icon));

    return image;
}

type Position = {
    x: number,
    y: number
}

export async function getTigerResult(array: number[][], win: boolean) {


    let canvas = createCanvas(800, 800);
    let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

    if (win) ctx.drawImage(await loadImage(botConfig.LOCAL_IMG_TIGER_WIN), 0, 0);
    if (!win) ctx.drawImage(await loadImage(botConfig.LOCAL_IMG_TIGER_LOSE), 0, 0);

    let assetSize = 128;

    let star = await loadImage(botConfig.LOCAL_IMG_TIGER_LOSESTAR)
    let tiger = await loadImage(botConfig.LOCAL_IMG_TIGER);
    let cash = await loadImage(botConfig.LOCAL_IMG_DOUBLE_COIN);

    let images = [star, cash, tiger];



    let positions: Position[][] = [
        [{ x: 176, y: 146 }, { x: 340, y: 146 }, { x: 504, y: 146 }],
        [{ x: 176, y: 336 }, { x: 340, y: 336 }, { x: 504, y: 336 }],
        [{ x: 176, y: 530 }, { x: 340, y: 530 }, { x: 504, y: 530 }]
    ]

    ctx.strokeStyle = '#FF0000';

    array.forEach((row, rowIndex) => {

        row.forEach((icon, iconIndex) => {
            ctx.drawImage
            ctx.drawImage(images[icon], positions[rowIndex][iconIndex].x, positions[rowIndex][iconIndex].y, assetSize, assetSize);
        });

    });

    let horizontal = (array[1][1] == array[1][0] && array[1][1] == array[1][2]);
    let vertical = (array[1][1] == array[0][1] && array[1][1] == array[2][1]);
    let diagonalLtR = (array[1][1] == array[0][0] && array[1][1] == array[2][2]);
    let diagonalRtL = (array[1][1] == array[0][2] && array[1][1] == array[2][0]);

    ctx.beginPath();
    ctx.lineWidth = 10;

    if (horizontal) {
        ctx.moveTo(positions[1][0].x + (assetSize / 2), positions[1][0].y + (assetSize / 2));
        ctx.lineTo(positions[1][2].x + (assetSize / 2), positions[1][2].y + (assetSize / 2));
        ctx.stroke();
    }

    if (vertical) {
        ctx.moveTo(positions[0][1].x + (assetSize / 2), positions[0][1].y + (assetSize / 2));
        ctx.lineTo(positions[2][1].x + (assetSize / 2), positions[2][1].y + (assetSize / 2));
        ctx.stroke();
    }

    if (diagonalLtR) {
        ctx.moveTo(positions[0][0].x + (assetSize / 2), positions[0][0].y + (assetSize / 2));
        ctx.lineTo(positions[2][2].x + (assetSize / 2), positions[2][2].y + (assetSize / 2));
        ctx.stroke();
    }

    if (diagonalRtL) {
        ctx.moveTo(positions[0][2].x + (assetSize / 2), positions[0][2].y + (assetSize / 2));
        ctx.lineTo(positions[2][0].x + (assetSize / 2), positions[2][0].y + (assetSize / 2));
        ctx.stroke();
    }

    return canvas.toBuffer("image/jpeg");

}


export async function getJackpotResult(array: number[]) {

    let canvas = createCanvas(653, 250);
    let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

    ctx.drawImage(await loadImage(botConfig.LOCAL_IMG_JACKPOT_BACKGROUND), 0, 0);

    let iconSize = 75;
    let cash = await loadImage(botConfig.LOCAL_IMG_DOUBLE_COIN);
    let bomb = await loadImage(botConfig.LOCAL_IMG_BOMB);
    let explosion = await loadImage(botConfig.LOCAL_IMG_EXPLOSION);

    let icons = [cash, bomb, explosion];
    let positions: Position[] = [
        { x: 161, y: 89 }, { x: 289, y: 89 }, { x: 418, y: 89 }
    ];

    array.forEach((item, i) => {
        let img = icons[item]
        ctx.drawImage(img, positions[i].x, positions[i].y, iconSize, iconSize);
    })
    return canvas.toBuffer();

}

export async function getDice(value: number, bet: number) {
    let width = 653;
    let height = 250;

    const canvas = createCanvas(width, height);
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

    let startPoint: Position = { x: 41, y: 98 }
    let endPoint: Position = { x: 609, y: 98 }


    let linhaX = startPoint.x + (endPoint.x - startPoint.x) * (bet / 100);
    const linhaY = startPoint.y + (endPoint.y - startPoint.y) * (bet / 100);

    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineWidth = 120;
    ctx.strokeStyle = "#ff0000";
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 120;
    ctx.strokeStyle = "#03fc35";
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(linhaX, linhaY);
    ctx.stroke();

    linhaX = startPoint.x + ((endPoint.x - 29) - (startPoint.x)) * (value / 100);

    ctx.drawImage(await loadImage(botConfig.LOCAL_IMG_DICE_BACKGROUND), 0, 0);
    ctx.drawImage(await loadImage(botConfig.LOCAL_IMG_DICE), linhaX - 25, linhaY - 1, 55, 55);

    return canvas.toBuffer();

}

export async function getRouletteResult(result: string) {
    let width = 560;
    let height = 560;

    const canvas = createCanvas(width, height);
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

    let images = {
        "Perdeu": await loadImage(botConfig.LOCAL_IMG_ROULETTELOSE),
        "1k": await loadImage(botConfig.LOCAL_IMG_ROULETTE1K),
        "5k": await loadImage(botConfig.LOCAL_IMG_ROULETTE5K),
        "9k": await loadImage(botConfig.LOCAL_IMG_ROULETTE9K),
        "15k": await loadImage(botConfig.LOCAL_IMG_ROULETTE15K),
        "VIP": await loadImage(botConfig.LOCAL_IMG_ROULETTEVIP),
    }

    ctx.drawImage(images[result], 0, 0);

    return canvas.toBuffer();
}


export default async function getRank(users: User[], info: IUser[]) {
    let width = 1350;
    let height = 900;

    const canvas = createCanvas(width, height);
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    let images: Image[] = [];

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    for (let user of users) {
        images.push(await loadImageURL(user.displayAvatarURL({ extension: "png" }) || "https://archive.org/download/discordprofilepictures/discordblue.png"));
    }

    let leftInitialPoint: Position = { x: 67, y: 140 };
    let rightInitialPoint: Position = { x: 690, y: 140 };
    let ySum = 153;

    images.forEach(async (image, index) => {
        let x, y;

        if (index < 5) {
            x = leftInitialPoint.x;
            y = leftInitialPoint.y + ySum * index;
        } else {
            x = rightInitialPoint.x;
            y = rightInitialPoint.y + ySum * (index - 5);
        }
        ctx.drawImage(image, x, y, 150, 150);
    });

    ctx.drawImage(await loadImage(botConfig.LOCAL_IMG_RANK), 0, 0);

    images.forEach(async (image, index) => {
        let x, y;
        ctx.fillStyle = "#FFF";
        ctx.font = '50px Arial';
        if (index < 5) {
            x = leftInitialPoint.x;
            y = leftInitialPoint.y + ySum * index;
        } else {
            x = rightInitialPoint.x;
            y = rightInitialPoint.y + ySum * (index - 5);
        }
        ctx.fillText(users[index].displayName, x + 180, y + 50);
        ctx.font = '30px Arial';
        ctx.fillText("ID: "+users[index].id, x + 180, y + 89);
        ctx.font = '30px Arial';
        ctx.fillText(info[index].coins.toLocaleString("pt-BR") + " fichas", x + 180, y + 129);
    });

    return canvas.toBuffer();

}


export async function getProfile(user: IUser, discordProfile: User, reps: number, partner: string = null) {
    
    let width = 561;
    let height = 420;

    let profileImage = await loadImageURL(discordProfile.displayAvatarURL({ size: 256, extension: "png" }));

    const canvas = createCanvas(width, height);
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

    let photoPoint: Position = { x: 24, y: 157 };
    let photoSize: Position = { x: 150, y: 150 };

    let namePoint: Position = { x: 191, y: 249 };
    let repPoint: Position = { x: 191 , y: 286 };
    let scorePoint: Position = { x: 306 , y: 286 };
    let marryPoint: Position = { x: 191 , y: 313 };
    let aboutmePoint: Position = { x: 34, y: 356 };

    ctx.drawImage(profileImage, photoPoint.x, photoPoint.y, photoSize.x, photoSize.y);
    ctx.drawImage(await loadImage(botConfig.LOCAL_IMG_PROFILE_TEMPLATE), 0, 0);
    
    ctx.fillStyle = "#FFF";
    ctx.font = '20px Arial';

    ctx.fillText(discordProfile.displayName, namePoint.x, namePoint.y);
    ctx.fillText(`${reps} Reps`, repPoint.x, repPoint.y);
    ctx.fillText(`${user.coins.toLocaleString("pt-BR")} fichas`, scorePoint.x, scorePoint.y);
    ctx.fillText(partner ? `Casado(a) com ${partner}` : `Solteiro(a)`, marryPoint.x, marryPoint.y);
    ctx.font = '18px Arial';
    drawTextInBox(ctx, String(user.about), aboutmePoint.x, aboutmePoint.y, 499, 74);

    return canvas.toBuffer();
    
}


function drawTextInBox(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    boxWidth: number,
    boxHeight: number
  ) {
    // Define a fonte e alinhamento do texto
    const fontSize = 23;
    ctx.font = `${fontSize}px Arial`;
  
    // Define os limites do retângulo
    const boxX = x;
    const boxY = y;
  
    // Verifica se o texto se ajusta aos limites da caixa
    const words = text.split(' ');
    let line = '';
    let testY = boxY;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
  
      if (testWidth > boxWidth && i > 0) {
        ctx.fillText(line, boxX, testY);
        line = words[i] + ' ';
        testY += fontSize; // Ajuste para a próxima linha
      } else {
        line = testLine;
      }
    }
  
    ctx.fillText(line, boxX, testY);
  }
  