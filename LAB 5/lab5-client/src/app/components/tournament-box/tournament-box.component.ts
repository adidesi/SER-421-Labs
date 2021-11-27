import { Component, Input, OnInit } from '@angular/core';
import { Tournament } from 'src/app/model/tournament';

@Component({
  selector: 'tournament-box',
  templateUrl: './tournament-box.component.html',
  styleUrls: ['./tournament-box.component.css']
})
export class TournamentBoxComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    // console.log('tournament from box', this.tournament)
  }

}
