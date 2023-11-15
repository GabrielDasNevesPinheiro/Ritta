import { CanvasRenderingContext2D, createCanvas, loadImage } from "canvas";
import { botConfig } from "../app";


export async function getDouble(sorted: string) {
    let width = 750;
    let height = 250;

    const canvas = createCanvas(width, height);
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

    let redPoint = 61;
    let blackPoint = 305;
    let whitePoint = 610;

    const red = await loadImage(botConfig.LOCAL_IMG_DOUBLE_RED);
    const black = await loadImage(botConfig.LOCAL_IMG_DOUBLE_BLACK);
    const white = await loadImage(botConfig.LOCAL_IMG_DOUBLE_WHITE);

    ctx.drawImage(red, 0, 0, 250, 250);
    ctx.drawImage(black, 250, 0, 250, 250);
    ctx.drawImage(white, 500, 0, 250, 250);

    const coin = await loadImage(botConfig.LOCAL_IMG_DOUBLE_COIN);

    let posX = 0;
    if(sorted === "red") posX = 61;
    if(sorted === "black") posX = 305;
    if(sorted === "white") posX = 549; 
    ctx.drawImage(coin, posX, 61, 128, 128);

    const buffer = canvas.toBuffer('image/jpeg');

    return buffer;
}

export async function loadImageURL(url: string) {

    const fetched_icon = await (await fetch(url)).arrayBuffer();
    const image = await loadImage(Buffer.from(fetched_icon));

    return image;
}