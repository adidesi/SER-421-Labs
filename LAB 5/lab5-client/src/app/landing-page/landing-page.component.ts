import { Component, OnInit } from '@angular/core';
import { Tournament } from '../model/tournament';
import { HttpServiceService } from '../service/http-service.service';

@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  tournaments: Tournament[]= []

  constructor(private httpService: HttpServiceService) { }

  ngOnInit(): void {
    console.log('ngoninit');
    this.httpService.getTournaments().subscribe(res=>{
      this.tournaments = res;
      console.log('tournaments', this.tournaments);
    })
  }

  filterByYear(){
    console.log('CLICKED')
  }

}
