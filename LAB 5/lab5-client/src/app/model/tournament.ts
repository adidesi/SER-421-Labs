import { Player } from "./player";

export interface Tournament{
    name: string
    year: number
    award: number
    yardage: number
    par: number
    players: Player[]
}