import { CanvasRenderingContext2D, createCanvas, loadImage } from "canvas";
import { botConfig } from "../app";


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

export async function getDice(value: number) {
    let width = 653;
    let height = 250;

    const canvas = createCanvas(width, height);
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

    let startPoint: Position = { x: 41, y: 98 }
    let endPoint: Position = { x: 609, y: 98 }

    
    const linhaX = startPoint.x + (endPoint.x - startPoint.x) * (value / 100);
    const linhaY = startPoint.y + (endPoint.y - startPoint.y) * (value / 100);

    ctx.beginPath()
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

    ctx.drawImage(await loadImage(botConfig.LOCAL_IMG_DICE_BACKGROUND), 0, 0);

    return canvas.toBuffer();

}