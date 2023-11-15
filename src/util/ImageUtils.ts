import { CanvasRenderingContext2D, createCanvas, loadImage } from "canvas";
import { botConfig } from "../app";


export async function getDouble(sorted: string) {
    let width = 750;
    let height = 250;

    const canvas = createCanvas(width, height);
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

    let posX = 0;
    if(sorted === "red") ctx.drawImage(await loadImage(botConfig.LOCAL_IMG_DOUBLE_RED_RESULT), 0, 0);
    if(sorted === "black") ctx.drawImage(await loadImage(botConfig.LOCAL_IMG_DOUBLE_BLACK_RESULT), 0, 0);
    if(sorted === "white") ctx.drawImage(await loadImage(botConfig.LOCAL_IMG_DOUBLE_WHITE_RESULT), 0, 0); 

    const buffer = canvas.toBuffer('image/jpeg');

    return buffer;
}

export async function loadImageURL(url: string) {

    const fetched_icon = await (await fetch(url)).arrayBuffer();
    const image = await loadImage(Buffer.from(fetched_icon));

    return image;
}