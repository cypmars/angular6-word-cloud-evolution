import { ElementRef, OnInit } from '@angular/core';
export declare class AgWordCloudDirective implements OnInit {
    wordData: AgWordCloudData[];
    temp: Array<AgWordCloudData>;
    color: string[];
    options: AgWordCloudOptions;
    width: number;
    height: number;
    private old_min;
    private old_max;
    private svg;
    private element;
    constructor(element: ElementRef);
    ngOnInit(): void;
    private roundNumber();
    private scale(inputY);
    private updateMaxMinValues();

    private setup();
    private buildSVG();
    private populate();
    private drawWordCloud(words);

    getWordSize(word: string): number;
    update(): void;
    removeElementsByClassName(classname: string): void;
}
export interface AgWordCloudOptions {
    settings?: {
        minFontSize?: number;
        maxFontSize?: number;
        fontFace?: string;
        fontWeight?: string;
        spiral?: string;
    };
    margin?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    labels?: boolean;
}
export interface AgWordCloudData {
    text: string;
    size: number;
    color?: string;
}
